import { chunkWidth, maxChunksToLeft, maxChunksToRight, startChunkIndex, worldSize } from "./../game-config"
import { biomeGenerationSettings } from "./settings"
import Chunk, { ChunkPartialProps } from "./chunk"
import Noise from "../utils/noise"
import PRNG from "../utils/prng"
import Block from "./block"

enum WorldGeneratorEvents {
    startedGeneration,
    generatedChunks,
    finishedGeneration
}

type WorldGeneratorEventType = keyof typeof WorldGeneratorEvents

type Seed = number | string

type Observer = (eventType: WorldGeneratorEventType, ...args: any[]) => any

export const worldGenerationStepsCount = (Object.keys(WorldGeneratorEvents).length / 2) - 2

const minChunksPerBiome = 5
const maxChunksPerBiome = 10

class WorldGenerator {
    private observers: Observer[] = []
    private seed: Seed
    private prng: PRNG

    constructor(seed: Seed) {
        this.seed = seed
        this.prng = new PRNG(this.seed)
    }

    private generateTerrainHeightNoise(width: number, chunkIndex: number): number[] {
        return Noise.generateHeightMap({
            seed: this.prng.seed,
            offset: chunkIndex * width,
            width: width,
            scale: 30,
            octaves: 2,
            persistence: .5,
            lacunarity: 2
        })
    }

    private selectBiome(): string {
        for (const biome of biomeGenerationSettings) {
            if (this.prng.next() < biome.spawnChance) {
                return biome.type
            }
        }

        const randomBiomeIndex = Math.floor(this.prng.next() * biomeGenerationSettings.length)
        const randomBiome = biomeGenerationSettings[randomBiomeIndex]

        return randomBiome.type
    }

    private generateChunkProps(index: number, biomeType: string, terrainHeightNoise: number[]): ChunkPartialProps {
        const firstChunkIndex = 0
        const lastChunkIndex = startChunkIndex + maxChunksToRight
        
        const borders = {
            left: index === firstChunkIndex,
            right: index === lastChunkIndex
        }

        return {
            width: chunkWidth,
            borders: borders,
            biomeType: biomeType,
            terrainHeightNoise: terrainHeightNoise,
            prng: new PRNG(this.prng.seed + index),
            index: index
        }
    }

    public generateChunks(): Chunk[] {
        const chunks: Chunk[] = []
        const chunkCount = maxChunksToLeft + maxChunksToRight + 1

        this.notifyAll("startedGeneration")

        const chunkBiomes: string[] = []

        while (chunkBiomes.length < chunkCount) {
            const currentBiome = this.selectBiome()
        
            const biomeDuration = Math.floor(
                this.prng.next(maxChunksPerBiome, minChunksPerBiome)
            )

            for (let i = 0; i < biomeDuration; i++) {
                chunkBiomes.push(currentBiome)
            }
        }

        for (let i = 0; i < chunkCount; i++) {
            const terrainHeightNoise = this.generateTerrainHeightNoise(chunkWidth, i)
            const biomeType = chunkBiomes[i]
            const chunkProps = this.generateChunkProps(i, biomeType, terrainHeightNoise)
            const chunk = new Chunk(chunkProps)
            chunks.push(chunk)
        }

        this.notifyAll("generatedChunks")

        this.generateCaves(chunks)

        this.notifyAll("finishedGeneration")

        return chunks
    }

    public generateCaves(chunks: Chunk[]) {
        const seed = typeof this.seed === "number" ? this.seed : PRNG.stringToSeed(this.seed)

        const cavesNoise = Noise.generateCavesMap({
            seed: seed,
            width: worldSize.width,
            height: worldSize.height,
            threshold: .1
        })

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            for (let blockIndex = 0; blockIndex < chunkWidth * worldSize.height; blockIndex++) {
                const x = chunkIndex * chunkWidth + Math.floor(blockIndex / worldSize.height)
                const y = blockIndex % worldSize.height

                const currentBlock = chunks[chunkIndex].props.data[blockIndex]
                const isVoid = cavesNoise[x][y] === 0

                if (isVoid && currentBlock.props.type !== "BEDROCK" && currentBlock.props.type !== "AIR") {
                    chunks[chunkIndex].props.data[blockIndex] = new Block({
                        name: "Ar",
                        type: "AIR",
                        isSolid: false
                    })
                }
            }
        }
    }

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    private notifyAll(eventType: WorldGeneratorEventType, ...args: any[]): void {
        for (const observer of this.observers) {
            observer(eventType, ...args)
        }
    }
}

export default WorldGenerator