import {
    bedrockEnd, blocks, coalEnd, coalGenerationChance,
    coalStart, diamondEnd, diamondGenerationChance,
    diamondStart, dirtEnd, dirtStart, goldEnd,
    goldGenerationChance, goldStart, ironEnd,
    ironGenerationChance, ironStart, worldHeight
} from "./../game-config"
import Noise from "../utils/noise"
import PRNG from "../utils/prng"
import Block from "./block"


const bedrockIndex = blocks.findIndex((block) => block.type === "BEDROCK")
const stoneIndex = blocks.findIndex((block) => block.type === "STONE")
const airIndex = blocks.findIndex((block) => block.type === "AIR") 
const dirtyIndex = blocks.findIndex((block) => block.type === "DIRTY")
const grassIndex = blocks.findIndex((block) => block.type === "GRASS")
// const woodIndex = blocks.findIndex((block) => block.type === "WOOD")
const coalOreIndex = blocks.findIndex((block) => block.type === "COAL_ORE")
const ironOreIndex = blocks.findIndex((block) => block.type === "IRON_ORE")
const goldOreIndex = blocks.findIndex((block) => block.type === "GOLD_ORE")
const diamondOreIndex = blocks.findIndex((block) => block.type === "DIAMOND_ORE")

function selectBlock(index: number, chunk: Chunk, prng: PRNG, noiseHeight: number): number {
    const y = Math.floor(index / chunk.props.width)

    const currentDirtStart = dirtStart + Math.round(noiseHeight * 10.5)
    const currentDirtEnd = dirtEnd + Math.round(noiseHeight * 10.5)

    const lowerBlockIndex = index - chunk.props.width
    const lowerBlock = chunk.props.data[lowerBlockIndex]

    if (chunk.props.borders.left && (index + 1) % chunk.props.width === 0) {
        return bedrockIndex
    } else if(chunk.props.borders.right && index % chunk.props.width === 0) {
        return bedrockIndex
    }

    if (y <= bedrockEnd) {
        if (y === bedrockEnd) {
            return prng.next() < 0.5 ? stoneIndex : bedrockIndex
        } else if (y === bedrockEnd - 1) {
            return prng.next() < 0.3 ? stoneIndex : bedrockIndex
        } else if (y === bedrockEnd - 2) {
            return prng.next() < 0.1 ? stoneIndex : bedrockIndex
        }

        return bedrockIndex
    } else if (y >= currentDirtStart && y <= currentDirtEnd) {
        if (lowerBlock.props.type === "GRASS" || lowerBlock.props.lowerBlockType === "GRASS") {
            return airIndex
        }

        if (currentDirtEnd === y) {
            return grassIndex
        }

        return dirtyIndex
    } else if (y > bedrockEnd && y < currentDirtStart) {
        if (y === currentDirtStart - 1) {
            return prng.next() < .5 ? dirtyIndex : stoneIndex
        } else if (y === currentDirtStart - 2) {
            return prng.next() < .25 ? dirtyIndex : stoneIndex
        }

        const lowerBlockIndex = index - chunk.props.width
        const lowerBlock = chunk.props.data[lowerBlockIndex]

        if (y >= coalStart && y <= coalEnd && (prng.next() < coalGenerationChance || (lowerBlock.props.type === "COAL_ORE" && prng.next() < 0.15))) {
            return coalOreIndex
        }
    
        if (y >= ironStart && y <= ironEnd && (prng.next() < ironGenerationChance || (lowerBlock.props.type === "IRON_ORE" && prng.next() < 0.25))) {
            return ironOreIndex
        }
    
        if (y >= goldStart && y <= goldEnd && (prng.next() < goldGenerationChance || (lowerBlock.props.type === "GOLD_ORE" && prng.next() < 0.09))) {
            return goldOreIndex
        }
    
        if (y >= diamondStart && y <= diamondEnd && (prng.next() < diamondGenerationChance || (lowerBlock.props.type === "DIAMOND_ORE" && prng.next() < 0.5))) {
            return diamondOreIndex
        }

        return stoneIndex
    } else {
        if (lowerBlock.props.type === "DIRT") {
            return grassIndex
        }

        return airIndex
    }
}

function generateBlock(index: number, chunk: Chunk, prng: PRNG, noiseHeight: number): Block {
    const selectedBlockIndex = selectBlock(index, chunk, prng, noiseHeight)
    const selectedBlock = blocks[selectedBlockIndex]

    const lowerBlockIndex = index - chunk.props.width
    const lowerBlock = chunk.props.data[lowerBlockIndex]

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

type Borders = {
    left?: boolean
    right?: boolean
}

export type ChunkProps = {
    width: number,
    borders: Borders
    data: Block[],
    prng: PRNG
    index: number
}

type ChunkPartialProps = Omit<ChunkProps, "data">

class Chunk {
    public props: ChunkProps

    public constructor(props: ChunkPartialProps) {
        this.props = {
            ...props,
            data: []
        }

        this.generateData()
    }

    private generateData() {
        const { width } = this.props

        const noiseHeightMap = Noise.generateHeightMap({
            seed: this.props.prng.seed,
            offset: (this.props.index + 1) * this.props.width,
            width: this.props.width,
            scale: 30,
            octaves: 2,
            persistence: .5,
            lacunarity: 2
        })

        for (let i = 0; i < width * worldHeight; i++) {
            const noiseIndex = i % width
            const block = generateBlock(i, this, this.props.prng, noiseHeightMap[noiseIndex])
            this.props.data.push(block)
        }

        this.props.data = this.props.data.reverse()
    }
}

export default Chunk