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
}

export type Coordinates = {
    x: number
    y: number
}

type WorldPartialProps = Omit<WorldProps, "chunks" | "entities" | "prng">

type Observer = (sender: string, eventType: string, ...args: any[]) => any

class World {
    public id: string
    public props: WorldProps

    private observers: Observer[] = []

    public constructor(props: WorldPartialProps) {
        this.id = randomUUID()
        this.props = {
            ...props,
            chunks: {},
            entities: []
        }
    }

    public generate() {
        const worldSeed = this.props.seed ?? randomUUID()
        const generator = new WorldGenerator(worldSeed)

        generator.subscribe((event, ...args) => this.notifyAll(WorldGenerator.name, event, ...args))

        const chunks = generator.generateChunks()
        
        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex]
            this.props.chunks[chunkIndex] = chunk
        }
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

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    private notifyAll(sender: string, eventType: string, ...args: any[]): void {
        for (const observer of this.observers) {
            observer(sender, eventType, ...args)
        }
    }
}

export default World