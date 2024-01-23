import { createNoise2D } from "simplex-noise"

import randInt from "../utils/randint"
import {
    bedrockEnd, blocks, coalEnd, coalGenerationChance,
    coalStart, diamondEnd, diamondGenerationChance,
    diamondStart, dirtEnd, dirtStart, goldEnd,
    goldGenerationChance, goldStart, ironEnd,
    ironGenerationChance, ironStart, worldHeight
} from "./../game-config"
import PRNG from "../utils/prng"
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
    const frequency = .02
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

function selectBlock(index: number, chunk: Chunk, prng: PRNG): number {
    const y = Math.floor(index / chunk.props.width)

    if (chunk.props.borders.left && (index + 1) % chunk.props.width === 0 ) {
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
    } else if (y >= dirtStart && y <= dirtEnd) {
        const lowerBlockIndex = index - chunk.props.width
        const lowerBlock = chunk.props.data[lowerBlockIndex]

        if (lowerBlock.props.type === "GRASS" || lowerBlock.props.lowerBlockType === "GRASS") {
            return airIndex
        }

        if (y === dirtStart) {
            return prng.next() < .3 ? stoneIndex : dirtyIndex
        } else if (y === dirtEnd - 1) {
            return prng.next() < .4 ? grassIndex : dirtyIndex
        } else if (y === dirtEnd - 2) {
            return prng.next() < .2 ? grassIndex : dirtyIndex
        } else if (y === dirtEnd) {
            return grassIndex
        }

        return dirtyIndex
    } else if (y > bedrockEnd && y < dirtStart) {
        if (y === dirtStart - 1) {
            return prng.next() < .5 ? dirtyIndex : stoneIndex
        } else if (y === dirtStart - 1) {
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
        return airIndex
    }
}

function generateBlock(index: number, chunk: Chunk, prng: PRNG): Block {
    const selectedBlockIndex = selectBlock(index, chunk, prng)
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
            const block = generateBlock(i, this, this.props.prng)
            this.props.data.push(block)
        }

        this.props.data = this.props.data.reverse()

        // if (Math.random() < cavesGenerationChance) {
        //     generateCaves(this, prng)
        // }
    }
}

export default Chunk