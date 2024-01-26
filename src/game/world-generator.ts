import { chunkWidth, maxChunksToLeft, maxChunksToRight, startChunkIndex } from "./../game-config"
import { biomeGenerationSettings } from "./settings"
import Chunk, { ChunkPartialProps } from "./chunk"
import Noise from "../utils/noise"
import PRNG from "../utils/prng"

enum WorldGeneratorEvents {
    startedGeneration,
    generatedChunks,
    finishedGeneration
}

type WorldGeneratorEventType = keyof typeof WorldGeneratorEvents

type Seed = number | string

type Observer = (eventType: WorldGeneratorEventType, ...args: any[]) => any

export const worldGenerationStepsCount = (Object.keys(WorldGeneratorEvents).length / 2) - 2

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
            offset: chunkIndex,
            width: width,
            scale: 30,
            octaves: 2,
            persistence: 0.5,
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

        for (let i = 0; i < chunkCount; i++) {
            const terrainHeightNoise = this.generateTerrainHeightNoise(chunkWidth, i)
            const biomeType = this.selectBiome()
            const chunkProps = this.generateChunkProps(i, biomeType, terrainHeightNoise)
            const chunk = new Chunk(chunkProps)
            chunks.push(chunk)
        }

        this.notifyAll("generatedChunks")

        this.notifyAll("finishedGeneration")

        return chunks
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