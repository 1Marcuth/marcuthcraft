import { createNoise2D } from "simplex-noise"

import randInt from "../utils/randint"
import {
    bedrockEnd, blocks, coalEnd, coalGenerationChance,
    coalStart, diamondEnd, diamondGenerationChance,
    diamondStart, dirtEnd, dirtStart, goldEnd,
    goldGenerationChance, goldStart, ironEnd,
    ironGenerationChance, ironStart, worldHeight
} from "./../game-config"
import Block from "./block"

const noise2D = createNoise2D()

const bedrockIndex = blocks.findIndex((block) => block.type === "BEDROCK")
const stoneIndex = blocks.findIndex((block) => block.type === "STONE")
const airIndex = blocks.findIndex((block) => block.type === "AIR") 
const dirtyIndex = blocks.findIndex((block) => block.type === "DIRTY")
const grassIndex = blocks.findIndex((block) => block.type === "GRASS")
const woodIndex = blocks.findIndex((block) => block.type === "WOOD")
const coalOreIndex = blocks.findIndex((block) => block.type === "COAL_ORE")
const ironOreIndex = blocks.findIndex((block) => block.type === "IRON_ORE")
const goldOreIndex = blocks.findIndex((block) => block.type === "GOLD_ORE")
const diamondOreIndex = blocks.findIndex((block) => block.type === "DIAMOND_ORE")

function generateCaveNoise(x: number, y: number): number {
    const frequency = .02  // Controla a granularidade da caverna
    const amplitude = randInt(20, 100) / 10
    const caveNoiseValue = noise2D(x * frequency, y * frequency) * amplitude
    return (caveNoiseValue + 1) / 2
}

function generateCaves(chunk: Chunk): void {
    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < chunk.props.width; x++) {
            const caveNoise = generateCaveNoise(x, y)
            const airBlock = blocks[airIndex]

            if (caveNoise < 0.3) {
                const blockIndex = y * chunk.props.width + x
                const lowerBlockIndex = blockIndex - chunk.props.width
                const lowerBlock = chunk.props.data[lowerBlockIndex]

                if (chunk.props.data[blockIndex].props.type === "BEDROCK") return

                chunk.props.data[blockIndex] = new Block({
                    name: airBlock.name,
                    type: airBlock.type,
                    isSolid: airBlock.isSolid,
                    resistance: airBlock.resistance,
                    clipping: airBlock.clipping,
                    lowerBlockType: lowerBlock ? lowerBlock.props.type : undefined
                })
            }
        }
    }
}

function selectBlock(index: number, chunk: Chunk): number {
    const y = Math.floor(index / chunk.props.width)

    if (chunk.props.borders.left && (index + 1) % chunk.props.width === 0 ) {
        return bedrockIndex
    } else if(chunk.props.borders.right && index % chunk.props.width === 0) {
        return bedrockIndex
    }

    if (y <= bedrockEnd) {
        if (y === bedrockEnd) {
            return Math.random() < 0.5 ? stoneIndex : bedrockIndex
        } else if (y === bedrockEnd - 1) {
            return Math.random() < 0.3 ? stoneIndex : bedrockIndex
        } else if (y === bedrockEnd - 2) {
            return Math.random() < 0.1 ? stoneIndex : bedrockIndex
        }

        return bedrockIndex
    } else if (y >= dirtStart && y <= dirtEnd) {
        const lowerBlockIndex = index - chunk.props.width
        const lowerBlock = chunk.props.data[lowerBlockIndex]

        if (lowerBlock.props.type === "GRASS" || lowerBlock.props.lowerBlockType === "GRASS") {
            return airIndex
        }

        if (y === dirtStart) {
            return Math.random() < .3 ? stoneIndex : dirtyIndex
        } else if (y === dirtEnd - 1) {
            return Math.random() < .4 ? grassIndex : dirtyIndex
        } else if (y === dirtEnd - 2) {
            return Math.random() < .2 ? grassIndex : dirtyIndex
        } else if (y === dirtEnd) {
            return grassIndex
        }

        return dirtyIndex
    } else if (y > bedrockEnd && y < dirtStart) {
        if (y === dirtStart - 1) {
            return Math.random() < .5 ? dirtyIndex : stoneIndex
        } else if (y === dirtStart - 1) {
            return Math.random() < .25 ? dirtyIndex : stoneIndex
        }

        const lowerBlockIndex = index - chunk.props.width
        const lowerBlock = chunk.props.data[lowerBlockIndex]

        if (y >= coalStart && y <= coalEnd && (Math.random() < coalGenerationChance || (lowerBlock.props.type === "COAL_ORE" && Math.random() < 0.15))) {
            return coalOreIndex
        }
    
        if (y >= ironStart && y <= ironEnd && (Math.random() < ironGenerationChance || (lowerBlock.props.type === "IRON_ORE" && Math.random() < 0.25))) {
            return ironOreIndex
        }
    
        if (y >= goldStart && y <= goldEnd && (Math.random() < goldGenerationChance || (lowerBlock.props.type === "GOLD_ORE" && Math.random() < 0.09))) {
            return goldOreIndex
        }
    
        if (y >= diamondStart && y <= diamondEnd && (Math.random() < diamondGenerationChance || (lowerBlock.props.type === "DIAMOND_ORE" && Math.random() < 0.5))) {
            return diamondOreIndex
        }

        return stoneIndex
    } else {
        return airIndex
    }
}

function generateBlock(index: number, chunk: Chunk): Block {
    const selectedBlockIndex = selectBlock(index, chunk)
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
    data: Block[]
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
        const cavesGenerationChance = .1

        for (let i = 0; i < width * worldHeight; i++) {
            const block = generateBlock(i, this)
            this.props.data.push(block)
        }

        this.props.data = this.props.data.reverse()

        if (Math.random() < cavesGenerationChance) {
            generateCaves(this)
        }
    }
}

export default Chunk