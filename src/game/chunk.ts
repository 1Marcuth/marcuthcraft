import { BlockTypes, biomeGenerationSettings } from "./settings"
import Block, { BlockPartialProps } from "./block"
import { worldSize } from "./../game-config"
import PRNG from "../utils/prng"

function getBlockByType(blockType: string): BlockPartialProps {
    const blocksProps: BlockPartialProps[] = [
        {
            name: "Bloco de Terra",
            type: BlockTypes.DIRT,
            isSolid: true,
            resistance: 500,
            clipping: {
                x: 0,
                y: 0,
                width: 16,
                height: 16
            }
        },
        {
            name: "Bloco de Grama",
            type: BlockTypes.GRASS,
            isSolid: true,
            resistance: 500,
            clipping: {
                x: 16,
                y: 0,
                width: 16,
                height: 16
            }
        },
        {
            name: "Pedra",
            type: BlockTypes.STONE,
            isSolid: true,
            resistance: 1500,
            clipping: {
                x: 32,
                y: 0,
                width: 16,
                height: 16
            }
        },
        {
            name: "Minério de Carvão",
            type: BlockTypes.COAL_ORE,
            isSolid: true,
            resistance: 3000,
            clipping: {
                x: 32,
                y: 16,
                width: 16,
                height: 16
            }
        },
        {
            name: "Minério de Ferro",
            type: BlockTypes.IRON_ORE,
            isSolid: true,
            resistance: 3000,
            clipping: {
                x: 48,
                y: 16,
                width: 16,
                height: 16
            }
        },
        {
            name: "Minério de Ouro",
            type: BlockTypes.GOLD_ORE,
            isSolid: true,
            resistance: 3000,
            clipping: {
                x: 32,
                y: 32,
                width: 16,
                height: 16
            }
        },
        {
            name: "Minério de Diamante",
            type: BlockTypes.DIAMOND_ORE,
            isSolid: true,
            resistance: 3000,
            clipping: {
                x: 48,
                y: 32,
                width: 16,
                height: 16
            }
        },
        {
            name: "Rocha-mãe",
            type: BlockTypes.BEDROCK,
            isSolid: true,
            resistance: "infinite",
            clipping: {
                x: 48,
                y: 0,
                width: 16,
                height: 16
            }
        },
        {
            name: "Tronco de Carvalho",
            type: BlockTypes.OAK_TRUNK,
            isSolid: true,
            clipping: {
                x: 64,
                y: 0,
                width: 16,
                height: 16
            }
        },
        {
            name: "Folha de Carvalho",
            type: BlockTypes.OAK_LEAF,
            isSolid: true,
            clipping: {
                x: 64,
                y: 16,
                width: 16,
                height: 16
            }
        },
        {
            name: "Água",
            type: BlockTypes.WATER,
            isSolid: false,
            isLiquid: true,
            clipping: {
                x: 0,
                y: 16,
                width: 16,
                height: 16
            }
        },
        {
            name: "Lava",
            type: BlockTypes.LAVA,
            isSolid: false,
            isLiquid: true,
            clipping: {
                x: 16,
                y: 16,
                width: 16,
                height: 16
            }
        },
        {
            name: "Ar",
            type: BlockTypes.AIR,
            isSolid: false
        }
    ]

    const blockProps = blocksProps.find(block => block.type === blockType)

    if (!blockProps) {
        throw new Error(`Not found block of type '${blockType}'`)
    }

    return blockProps
}

type SelectBlockProps = {
    index: number
    chunk: Chunk
    prng: PRNG
    biomeType: string
    noiseHeight: number
}

function selectBlockType({
    index,
    chunk,
    prng,
    biomeType,
    noiseHeight
}: SelectBlockProps): string {
    const y = Math.floor(index / chunk.props.width)

    const lowerBlockIndex = index - chunk.props.width
    const lowerBlock = chunk.props.data[lowerBlockIndex]

    if (chunk.props.borders.left && (index + 1) % chunk.props.width === 0) {
        return BlockTypes.BEDROCK
    } else if(chunk.props.borders.right && index % chunk.props.width === 0) {
        return BlockTypes.BEDROCK
    }

    const biomeSettings = biomeGenerationSettings.find(biomeSettings => biomeSettings.type === biomeType)

    if (biomeSettings) {
        for (const blockLayer of biomeSettings.blockLayers) {
            const adjustedLayerRange = [ ...blockLayer.layerRange ].map((layerRangeValue, index) => {
                // if (blockLayer.blockType === BlockTypes.STONE) {
                //     return layerRangeValue + Math.floor(noiseHeight * 10)
                // } else if (blockLayer.blockType === BlockTypes.DIRT) {
                //     return layerRangeValue - Math.floor(noiseHeight * 10)
                // }

                return layerRangeValue
            })
            // justamente pela variação de altura que não acaba entrando nessa condição
            if (y >= adjustedLayerRange[0] && y <= adjustedLayerRange[1]) {
                if (blockLayer.spawnVariationLayers) {
                    for (const variationLayer of blockLayer.spawnVariationLayers) {
                        if (y >= variationLayer.layerRange[0] && y <= variationLayer.layerRange[1]) {
                            if (prng.next() < variationLayer.spawnChance) {
                                const randomBlockIndex = Math.floor(prng.next() * variationLayer.alternativeBlocks.length)
                                const randomBlockType = variationLayer.alternativeBlocks[randomBlockIndex]
                                return randomBlockType
                            }
                        }
                    }
                }

                if (blockLayer.blockType === BlockTypes.DIRT && y === blockLayer.layerRange[1]) {
                    return BlockTypes.GRASS
                }

                return blockLayer.blockType
            } else if (y >= blockLayer.layerRange[0] && y <= blockLayer.layerRange[1]) {
                return BlockTypes.WATER
            }
        } 
    }

    return BlockTypes.AIR
}

type GenerateBlockProps = {
    index: number
    chunk: Chunk
    prng: PRNG
    biomeType: string
    noiseHeight: number
}

function generateBlock({
    index,
    chunk,
    prng,
    biomeType,
    noiseHeight
}: GenerateBlockProps): Block {
    const selectedBlockType = selectBlockType({
        index: index,
        chunk: chunk,
        prng: prng,
        biomeType: biomeType,
        noiseHeight: noiseHeight
    })

    const selectedBlock = getBlockByType(selectedBlockType)
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
    biomeType: string
    terrainHeightNoise: number[]
    data: Block[],
    prng: PRNG
    index: number
}

export type ChunkPartialProps = Omit<ChunkProps, "data">

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

        console.log(this.props.terrainHeightNoise.map(v => v * 10))
        for (let blockIndex = 0; blockIndex < this.props.width * worldSize.height; blockIndex++) {
            const noiseIndex = blockIndex % this.props.width

            const block = generateBlock({
                chunk: this,
                index: blockIndex,
                prng: this.props.prng,
                biomeType: this.props.biomeType,
                noiseHeight: this.props.terrainHeightNoise[noiseIndex]
            })

            this.props.data.push(block)
        }

        this.props.data = this.props.data.reverse()
    }
}

export default Chunk