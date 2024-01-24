import { chunkWidth, startChunkIndex, maxChunksToLeft, maxChunksToRight, maxCaveHeigh, worldHeight, blocks, dirtStart } from "./../game-config"
import randomUUID from "../utils/id-generator"
import PRNG from "../utils/prng"
import Entity from "./entity"
import Player from "./player"
import Chunk from "./chunk"
import { generateNoiseForCaves } from "../utils/generate-noise"
import Block from "./block"
import Perlin from "../utils/perlin"
import Noise from "../utils/noise"

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
        this.generateCaves()

        //if (!diamondOreBlock) return

        //this.setBlockAt(0, 0, new Block({ ...diamondOreBlock }))
    }

    private getChunkAndBlockIndices(globalBlockIndex: number): { chunkIndex: number, blockIndex: number } {
        const chunkIndex = Math.floor(globalBlockIndex / (chunkWidth * worldHeight))
        const blockIndex = Math.floor(globalBlockIndex % (chunkWidth * worldHeight))
        return { chunkIndex, blockIndex }
    }

    private generateChunks(): void {
        const firstChunkIndex = 0
        const lastChunkIndex = startChunkIndex + maxChunksToRight

        for (let i = startChunkIndex - maxChunksToLeft; i <= startChunkIndex + maxChunksToRight; i++) {
            if (!this.props.chunks[i]) {
                this.props.chunks[i] = new Chunk({
                    index: i,
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

    private generateCaves(): void {
        const chunksAmount = Object.keys(this.props.chunks).length;
        const worldWidth = chunkWidth * chunksAmount;
    
        const cavesMap = Noise.generateCavesMap({
            seed: this.props.prng.seed,
            width: worldWidth,
            height: worldHeight,
            threshold: 0.1, // Adjust the value of the threshold to control the amount of caves
        })
    
        for (let chunkIndex = 0; chunkIndex < chunksAmount; chunkIndex++) {
            for (let blockIndex = 0; blockIndex < chunkWidth * worldHeight; blockIndex++) {
                const x = chunkIndex * chunkWidth + Math.floor(blockIndex / worldHeight);
                const y = blockIndex % worldHeight

                const currentBlock = this.getBlockAt(chunkIndex, blockIndex)
    
                const isVoid = cavesMap[x][y] === 0
    
                if (isVoid && airBlock && currentBlock?.props.type !== "BEDROCK" && currentBlock?.props.type !== "AIR") {
                    const currentBlock = this.getBlockAt(chunkIndex, blockIndex);
                    const isEdgeBlock = x === 0 || x === worldWidth - 1 || y === 0 || y === worldHeight - 1
    
                    const transitionThreshold = isEdgeBlock ? 0.1 : 0.5
    
                    if (!currentBlock || this.props.prng.next() < transitionThreshold) {
                        this.setBlockAt(chunkIndex, blockIndex, new Block({ ...airBlock }))
                    }
                }
            }
        }
    }

    private getBlockAt(chunkIndex: number, blockIndex: number): Block | undefined {
        const chunk = this.props.chunks[chunkIndex]

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