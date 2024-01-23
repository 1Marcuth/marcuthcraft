import { chunkWidth, startChunkIndex, maxChunksToLeft, maxChunksToRight, maxCaveHeigh, worldHeight, blocks, dirtStart } from "./../game-config"
import randomUUID from "../utils/id-generator"
import PRNG from "../utils/prng"
import Entity from "./entity"
import Player from "./player"
import Chunk from "./chunk"
import { generateNoiseForCaves } from "../utils/generate-noise"
import Block from "./block"

type Chunks = {
    [key: number]: Chunk
}

export type WorldProps = {
    seed?: string | number
    chunks: Chunks
    entities: Entity[]
    prng: PRNG
}

export type Coordinates = {
    x: number
    y: number
}

type WorldPartialProps = Omit<WorldProps, "chunks" | "entities" | "prng">

const airBlock = blocks.find((block) => block.type === "WOOD")
const diamondOreBlock = blocks.find((block) => block.type === "DIAMOND_ORE")
class World {
    public id: string
    public props: WorldProps

    public constructor(props: WorldPartialProps) {
        if (!props.seed) props.seed = randomUUID()

        this.id = randomUUID()
        this.props = {
            ...props,
            chunks: {},
            entities: [],
            prng: new PRNG(props.seed)
        }

        this.generateChunks()
        this.generateMountains()
        this.generateCaves()

        if (!diamondOreBlock) return

        this.setBlockAt(0, 0, new Block({ ...diamondOreBlock }))
    }

    private generateChunks(): void {
        const firstChunkIndex = 0
        const lastChunkIndex = startChunkIndex + maxChunksToRight

        for (let i = startChunkIndex - maxChunksToLeft; i <= startChunkIndex + maxChunksToRight; i++) {
            if (!this.props.chunks[i]) {
                this.props.chunks[i] = new Chunk({
                    prng: this.props.prng,
                    width: chunkWidth, 
                    borders: {
                        left: i === firstChunkIndex,
                        right: i === lastChunkIndex
                    }
                })
            }
        }
    }

    private generateMountains(): void {
        /*
        const chunksAmount = Object.keys(this.props.chunks).length
        const worldWidth = chunkWidth * chunksAmount

        for (let chunkIndex = 0; chunkIndex < worldWidth / chunkWidth; chunkIndex++) {
            
        }
        */
    }

    private generateCaves(): void {
        const chunksAmount = Object.keys(this.props.chunks).length;
        const worldWidth = chunkWidth * chunksAmount;
        const caveWidth = worldWidth;
        const caveHeight = worldHeight;
        const caveStartAtY = 20;
        
        const caveNoise = generateNoiseForCaves(this.props.prng.seed, caveWidth, caveHeight, 20, 50, 0.5, 2)

        for (let x = 0; x < caveWidth; x++) {
            for (let y = 0; y < caveHeight; y++) {
                const globalBlockIndex = x * y
                const chunkIndex = Math.floor(globalBlockIndex / (chunkWidth * worldHeight))
                const blockIndex = Math.floor(globalBlockIndex / chunkWidth)
                const caveValue = caveNoise[x][y]
    
                if (true) {
                    const currentBlock = this.getBlockAt(chunkIndex, blockIndex)
    
                    if (airBlock/*currentBlock && currentBlock.props.type !== "BEDROCK" && airBlock*/) {
                        const block = new Block({ ...airBlock })

                        this.setBlockAt(chunkIndex, blockIndex, block)
                    }
                    /*
                    const widthVariation = Math.sin((x / caveWidth) * Math.PI) * 2
                    const tunnelWidth = 4 + widthVariation
    
                    for (let tunnelY = -tunnelWidth / 2; tunnelY < tunnelWidth / 2; tunnelY++) {
                        const adjustedY = y + tunnelY

                        if (adjustedY >= 0 && adjustedY < worldHeight) {
                            const currentBlock = this.getBlockAt(chunkIndex, blockIndex)
    
                            if (currentBlock && currentBlock.props.type !== "BEDROCK" && airBlock) {
                                const block = new Block({
                                    name: airBlock.name,
                                    isSolid: airBlock.isSolid,
                                    type: airBlock.type,
                                })
    
                                this.setBlockAt(chunkIndex, blockIndex, block)
                            }
                        }
                    }*/
                }
            }
        }
    }

    private getBlockAt(chunkIndex: number, blockIndex: number): Block | undefined {
        const chunk = this.props.chunks[chunkIndex]

        //console.log(chunkIndex, blockIndex)

        if (chunk) {
            const block = chunk.props.data[blockIndex]
            return block
        }
    }

    private setBlockAt(chunkIndex: number, blockIndex: number, block: Block): void {
        const chunk = this.props.chunks[chunkIndex]

        if (chunk) {
            chunk.props.data[blockIndex] = block
        }
    }

    public addPlayer(player: Player, coordinates: Coordinates) {

    }

    public addEntity(entity: Entity, coordinates: Coordinates) {

    }
}

export default World