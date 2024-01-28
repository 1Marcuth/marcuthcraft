import WorldGenerator from "../core/world-generator"
import randomUUID from "../../utils/id-generator"
import exportFile from "../../utils/export-file"
import { gameVersion } from "../settings/index"
import { getBlockPropsByType } from "../helper"
import Chunk, { ChunkData } from "./chunk"
import Player from "./player"
import Entity from "./entity"
import Block from "./block"

type Chunks = {
    [key: number]: Chunk
}

export type WorldProps = {
    seed?: string | number
    chunks: Chunks
    entities: Entity[]
    players: Player[]
    ownerPlayerId?: string
}

export type Coordinates = {
    x: number
    y: number
}

type ChunksData = { [key: number]: ChunkData }

type WorldData = {
    seed: string | number
    ownerPlayerId: string
    chunkWidth: number
    players: any[]
    chunks: ChunksData
    generatedInVersion: string
}

type WorldPartialProps = Omit<WorldProps, "chunks" | "entities" | "players" | "ownerPlayerId" | "seed">

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
            entities: [],
            players: []
        }
    }

    public generate(seed?: string | number): void {
        this.props.seed = seed ?? randomUUID()
        const worldSeed = this.props.seed
        const generator = new WorldGenerator(worldSeed)

        generator.subscribe((event, ...args) => this.notifyAll(WorldGenerator.name, event, ...args))

        const chunks = generator.generate()
        
        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex]
            this.props.chunks[chunkIndex] = chunk
        }
    }

    public async import(file: File): Promise<void> {
        const dataText = await file.text()
        const data: WorldData = JSON.parse(dataText)
        this.load(data)
    }

    public load(data: WorldData): void {
        this.props.chunks = {}

        for (const chunkIndex in data.chunks) {
            const chunkData = data.chunks[chunkIndex]

            const blocks = chunkData.blockTypes.map(blockType => {
                const blockProps = getBlockPropsByType(blockType)
                const block = new Block(blockProps)
                return block
            })

            this.props.chunks[chunkIndex] = new Chunk({
                biomeType: chunkData.biomeType,
                data: blocks,
                width: data.chunkWidth
            })
        }
    }

    public export(fileName: string): void {
        const chunkWidth = this.props.chunks[0].props.width
        const ownerPlayerId = this.props.ownerPlayerId!
        const playersData = this.props.players.map(player => player.getData())

        const worldData: WorldData = {
            seed: this.props.seed!,
            ownerPlayerId: ownerPlayerId,
            chunkWidth: chunkWidth,
            players: playersData,
            chunks: {},
            generatedInVersion: gameVersion
        }

        for (const chunkIndex in this.props.chunks) {
            const chunk = this.props.chunks[chunkIndex]
            const chunkData = chunk.getData()
            worldData.chunks[chunkIndex] = chunkData
        }

        const dataText = JSON.stringify(worldData)
        
        exportFile({ content: dataText, fileName: fileName })
    }

    public getBlockAt(chunkIndex: number, blockIndex: number): Block | undefined {
        const chunk = this.props.chunks[chunkIndex]

        if (chunk) {
            const block = chunk.props.data[blockIndex]
            return block
        }
    }

    public setBlockAt(chunkIndex: number, blockIndex: number, block: Block): void {
        const chunk = this.props.chunks[chunkIndex]

        if (chunk) {
            chunk.props.data[blockIndex] = block
        }
    }

    public addEntity(entity: Entity, coordinates: Coordinates): void {}

    public addPlayer(player: Player, coordinates: Coordinates, isOwner?: boolean): void {
        if (isOwner) {
            if (this.props.ownerPlayerId) {
                throw new Error(`This world already has an owner, the owner's ID is: ${this.props.ownerPlayerId}`)
            }

            this.props.ownerPlayerId = player.id
        }

        this.props.players.push(player)
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