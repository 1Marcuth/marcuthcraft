import { chunkWidth, maxChunksToLeft, maxChunksToRight, startChunkIndex } from "./../game-config"
import { biomeGenerationSettings } from "./settings"
import Chunk, { ChunkPartialProps } from "./chunk"
import PRNG from "../utils/prng"
import Noise from "../utils/noise"

type Seed = number | string

class WorldGenerator {
    private seed: Seed
    private prng: PRNG

    constructor(seed: Seed) {
        this.seed = seed
        this.prng = new PRNG(this.seed)
    }

    private generateTerrainHeightNoise(width: number): number[] {
        return Noise.generateHeightMap({
            seed: this.prng.next(),
            offset: 0,
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

        for (let i = 0; i < chunkCount; i++) {
            const terrainHeightNoise = this.generateTerrainHeightNoise(chunkWidth * chunkCount)
            const biomeType = this.selectBiome()
            const chunkProps = this.generateChunkProps(i, biomeType, terrainHeightNoise)

            const chunk = new Chunk(chunkProps)
            chunks.push(chunk)
        }

        return chunks
    }
}

export default WorldGenerator