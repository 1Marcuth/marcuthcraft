type Size = {
    width: number
    height: number
}

type Position = {
    x: number
    y: number
}

type Speed = {
    x: number
    y: number
}

export type EntityProps = {
    size: Size
    position: Position
    speed: Speed
}

type Observer = (event: string, ...args: any[]) => any

class Entity {
    public props: EntityProps
    private observers: Observer[] = []

    public constructor(props: EntityProps) {
        this.props = props
    }

    public increaseHealthPoints() {}

    public decreaseHealthPoints() {}

    public attack() {}

    public beAttacked() {}

    public die() {}

    public update() {}

    public subscribe(observer: Observer) {
        this.observers.push(observer)
    }

    private notifyAll(event: string, ...args: any[]): void {
        for (const observer of this.observers) {
            observer(event, ...args)
        }
    }
}

export default Entity