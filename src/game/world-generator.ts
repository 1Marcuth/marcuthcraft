import { chunkWidth, maxChunksToLeft, maxChunksToRight, startChunkIndex, worldSize } from "./../game-config"
import { biomeGenerationSettings, BlockTypes } from "./settings"
import Chunk, { ChunkPartialProps, getBlockByType } from "./chunk"
import Noise from "../utils/noise"
import PRNG from "../utils/prng"
import Block from "./block"

enum WorldGeneratorEvents {
    startedGeneration,
    generatedChunks,
    generatedCaves,
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

    private generateChunks(): Chunk[] {
        const chunks: Chunk[] = []
        const chunkCount = maxChunksToLeft + maxChunksToRight + 1

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

        return chunks
    }

    private generateCaves(chunks: Chunk[]): void {
        const seed = typeof this.seed === "number" ? this.seed : PRNG.stringToSeed(this.seed)

        const cavesNoise = Noise.generateCavesMap({
            seed: seed + this.prng.next(),
            height: worldSize.height,
            width: worldSize.width,
            density: .53,
            iterations: 10
        })

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            for (let blockIndex = 0; blockIndex < chunkWidth * worldSize.height; blockIndex++) {
                const blockX = blockIndex % chunkWidth
                const blockY = Math.floor(blockIndex / chunkWidth)

                const x = chunkIndex * chunkWidth + blockX
                const y = blockY

                const currentBlockType = chunks[chunkIndex].props.data[blockIndex].props.type

                if (
                    cavesNoise[x][y] === 0 &&
                    currentBlockType !== BlockTypes.BEDROCK
                ) {
                    chunks[chunkIndex].props.data[blockIndex] = new Block({
                        name: "Ar",
                        type: "AIR",
                        isSolid: false
                    })
                }
            }
        }

        this.notifyAll("generatedChunks")
    }

    private generateOres(chunks: Chunk[]): void {
        const seed = typeof this.seed === "number" ? this.seed : PRNG.stringToSeed(this.seed)

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex]
            const chunkBiome = chunk.props.biomeType

            const biomeSettings = biomeGenerationSettings.find(biomeSettings => biomeSettings.type === chunkBiome)

            if (!biomeSettings) {
                throw new Error(`Not found biome configuration of biome: ${chunkBiome}`)
            }

            for (const oreSettings of biomeSettings.ores) {
                const layerRange = oreSettings.spawnLayerRange

                const oresNoise = Noise.generateOresMap({
                    seed: seed + this.prng.next(),
                    height: worldSize.height,
                    width: chunkWidth,
                    density: oreSettings.noiseDensity,
                    iterations: oreSettings.cellularAutomatonIterations
                })

                for (let blockIndex = 0; blockIndex < chunkWidth * worldSize.height; blockIndex++) {
                    const x = blockIndex % chunkWidth
                    const y = Math.floor(blockIndex / chunkWidth)
    
                    const correctedHeight = (worldSize.height - y)

                    const isOreSpace = oresNoise[x][y] === 0

                    const isInLayerRange = (
                        correctedHeight >= layerRange[0] &&
                        (
                            layerRange[1] === "biomeMaxHeight" ?
                            correctedHeight <= biomeSettings.maxHeight :
                            correctedHeight <= layerRange[1]
                        )
                    )

                    const isAReplaceableBlock = (() => {
                        const currentBlockType = chunks[chunkIndex].props.data[blockIndex].props.type
                        let result = true

                        if (oreSettings.replaceableBlocks) {
                            if (oreSettings.replaceableBlocks === "*") {
                                result = true

                            } else {
                                if (!oreSettings.replaceableBlocks.includes(currentBlockType)) {
                                    result = false
                                }
                            }
                        }

                        if (oreSettings.unreplaceableBlocks) {
                            for (const replaceableBlockType of oreSettings.unreplaceableBlocks) {
                                if (replaceableBlockType === currentBlockType) {
                                    result = false
                                }
                            }
                        }

                        return result
                    })()
    
                    if (isOreSpace && isInLayerRange && isAReplaceableBlock) {
                        console.log(oreSettings.blockType)
                        const blockProps = getBlockByType(oreSettings.blockType)
                        chunks[chunkIndex].props.data[blockIndex] = new Block(blockProps)
                    }
                }
            }
        }
    }

    public generate(): Chunk[] {
        this.notifyAll("startedGeneration")

        const chunks = this.generateChunks()
        this.generateOres(chunks)
        this.generateCaves(chunks)

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