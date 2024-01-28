import Block from "./block"

export type ChunkProps = {
    width: number
    biomeType: string
    data: Block[]
}

export type ChunkData = {
    biomeType: string
    blockTypes: string[] 
}

class Chunk {
    public props: ChunkProps

    public constructor(props: ChunkProps) {
        this.props = props
    }

    public getData() {
        const data: ChunkData = {
            biomeType: this.props.biomeType,
            blockTypes: []
        }

        for (let blockIndex = 0; blockIndex < this.props.data.length; blockIndex++) {
            const block = this.props.data[blockIndex]
            const blockType = block.props.type
            data.blockTypes.push(blockType)
        }

        return data
    }
}

export default Chunk