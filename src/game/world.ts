import randomUUID from "../utils/id-generator"
import WorldGenerator from "./world-generator"
import PRNG from "../utils/prng"
import Player from "./player"
import Entity from "./entity"
import Chunk from "./chunk"
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

        this.generate()
    }

    public generate() {
        const generator = new WorldGenerator(this.props.prng.seed)
        const chunks = generator.generateChunks()
        
        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex]
            this.props.chunks[chunkIndex] = chunk
        }

        console.log(chunks)
    }

    public load() {

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
}

export default World