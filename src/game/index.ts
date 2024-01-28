import Player from "./common/player"
import World from "./common/world"

export type GameProps = {
    player: Player
    world?: World
}

type GamePartialProps = {
    player: Player
    world?: World
}

type Observer = (sender: string, eventType: string, ...args: any[]) => any

class Game {
    public props: GameProps

    private observers: Observer[] = []

    public constructor(props: GamePartialProps) {
        this.props = props
    }

    public createWorld(player: Player): void {
        const world = new World({})
        world.subscribe((sender, event, ...args) => this.notifyAll(sender, event, ...args))
        world.generate()
        world.addPlayer(player, { x: 0, y: 0 }, true)
        this.props.world = world
    }

    public update() {}

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    private notifyAll(sender: string, eventType: string, ...args: any[]): void {
        for (const observer of this.observers) {
            observer(sender, eventType, ...args)
        }
    }
}

export default Game