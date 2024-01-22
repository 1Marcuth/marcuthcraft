type Size = {
    width: number
    height: number
}

export type EntityProps = {
    size: Size
}

class Entity {
    public props: EntityProps

    public constructor(props: EntityProps) {
        this.props = props
    }
}

export default Entity