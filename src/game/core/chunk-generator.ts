import { getBiomeSettingsByType, getBlockPropsByType } from "../helper"
import { BlockTypes } from "../settings/enum-types"
import { worldSize } from "../settings/index"
import { ChunkProps } from "../common/chunk"
import Block from "../common/block"
import PRNG from "../utils/prng"

type Borders = {
    left?: boolean
    right?: boolean
}

export type ChunkGeneratorProps = {
    width: number
    borders: Borders
    biomeType: string
    terrainHeightNoise: number[]
    data: Block[]
    prng: PRNG
    index: number
}

type GenerateBlockOptions = {
    index: number
    chunkGenerator: ChunkGenerator
    prng: PRNG
    biomeType: string
    noiseHeight: number
}

type SelectBlockOptions = {
    index: number
    chunkGenerator: ChunkGenerator
    prng: PRNG
    biomeType: string
    noiseHeight: number
}

export type ChunkGeneratorPartialProps = Omit<ChunkGeneratorProps, "data">

class ChunkGenerator {
    public props: ChunkGeneratorProps

    private constructor(props: ChunkGeneratorProps) {
        this.props = props
    }

    public static generate(props: ChunkGeneratorPartialProps): ChunkProps {
        const instance = new ChunkGenerator({ ...props, data: [] })

        for (let blockIndex = 0; blockIndex < instance.props.width * worldSize.height; blockIndex++) {
            const noiseIndex = blockIndex % instance.props.width

            const block = instance.generateBlock({
                chunkGenerator: instance,
                index: blockIndex,
                prng: instance.props.prng,
                biomeType: instance.props.biomeType,
                noiseHeight: instance.props.terrainHeightNoise[noiseIndex]
            })

            instance.props.data.push(block)
        }

        instance.props.data = instance.props.data.reverse()

        return {
            width: instance.props.width,
            biomeType: instance.props.biomeType,
            data: instance.props.data
        }
    }

    private generateBlock({
        index,
        chunkGenerator,
        prng,
        biomeType,
        noiseHeight
    }: GenerateBlockOptions): Block {
        const selectedBlockType = this.selectBlockType({
            index: index,
            chunkGenerator: chunkGenerator,
            prng: prng,
            biomeType: biomeType,
            noiseHeight: noiseHeight
        })
    
        const selectedBlock = getBlockPropsByType(selectedBlockType)
        const lowerBlockIndex = index - chunkGenerator.props.width
        const lowerBlock = chunkGenerator.props.data[lowerBlockIndex]
    
        const block = new Block({
            name: selectedBlock.name,
            type: selectedBlock.type,
            isSolid: selectedBlock.isSolid,
            resistance: selectedBlock.resistance,
            clipping: selectedBlock.clipping,
            lowerBlockType: lowerBlock ? lowerBlock.props.type : undefined
        })
    
        return block
    }

    private selectBlockType({
        index,
        chunkGenerator,
        prng,
        biomeType,
        noiseHeight
    }: SelectBlockOptions): string {
        const biomeSettings = getBiomeSettingsByType(biomeType)
    
        const multiplier = biomeSettings.heightNoiseMultiplier 
        const height = Math.round(biomeSettings.maxHeight - multiplier + (noiseHeight * multiplier))
        const y = Math.floor(index / chunkGenerator.props.width)
    
        // const lowerBlockIndex = index - chunk.props.width
        // const lowerBlock = chunk.props.data[lowerBlockIndex]
    
        if (chunkGenerator.props.borders.left && (index + 1) % chunkGenerator.props.width === 0) {
            return BlockTypes.BEDROCK
        } else if(chunkGenerator.props.borders.right && index % chunkGenerator.props.width === 0) {
            return BlockTypes.BEDROCK
        }
    
        if (y <= height) {
            if (y === height) {
                return BlockTypes.GRASS
            }
    
            if (y === 0) {
                return BlockTypes.BEDROCK
            }
    
            if (y === 1 && prng.next() < .95) {
                return BlockTypes.BEDROCK
            }
    
            if (y === 2 && prng.next() < .75) {
                return BlockTypes.BEDROCK
            }
    
            if (y === 3 && prng.next() < .55) {
                return BlockTypes.BEDROCK
            }
    
            if (y <= height - 6) {
                if (y === height - 6 && prng.next() < .5) {
                    return BlockTypes.DIRT
                }
    
                if (y === height - 7 && prng.next() < .15) {
                    return BlockTypes.DIRT
                }
    
                return BlockTypes.STONE
            }
    
            return BlockTypes.DIRT
        }
    
        return BlockTypes.AIR
    }
}

export default ChunkGenerator