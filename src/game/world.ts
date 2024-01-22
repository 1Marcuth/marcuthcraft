import { chunkWidth, startChunkIndex, maxChunksToLeft, maxChunksToRight } from "./../game-config"
import randomUUID from "../utils/id-generator"
import Entity from "./entity"
import Player from "./player"
import Chunk from "./chunk"

type Chunks = {
    [key: number]: Chunk
}

export type WorldProps = {
    seed?: string
    chunks: Chunks
    entities: Entity[]
}

export type Coordinates = {
    x: number
    y: number
}

type WorldPartialProps = Omit<WorldProps, "chunks" | "entities">


class World {
    public id: string
    public props: WorldProps

    public constructor(props: WorldPartialProps) {
        this.id = randomUUID()
        this.props = {
            ...props,
            chunks: {},
            entities: []
        }

        this.generateChunks()
        this.generateMountains()
        this.generateCaves()
    }

    private generateChunks(): void {
        const firstChunkIndex = 0
        const lastChunkIndex = startChunkIndex + maxChunksToRight
        for (let i = startChunkIndex - maxChunksToLeft; i <= startChunkIndex + maxChunksToRight; i++) {
            if (!this.props.chunks[i]) {
                this.props.chunks[i] = new Chunk({
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
        /*
        const chunksAmount = Object.keys(this.props.chunks).length
        const worldWidth = chunkWidth * chunksAmount

        
        
        for (let chunkIndex = 0; chunkIndex < worldWidth / chunkWidth; chunkIndex++) {
            const chunk = this.props.chunks[chunkIndex]

            for (let blockIndex = 0; blockIndex < chunk.props.data.length; blockIndex++) {
                //const y = Math.floor(blockIndex / chunkWidth)
                //const x = chunkIndex * chunkWidth + Math.floor((blockIndex + 1) % chunkWidth)
            }
        }
        */
    }

    public addPlayer(player: Player, coordinates: Coordinates) {

    }

    public addEntity(entity: Entity, coordinates: Coordinates) {

    }
}

export default World