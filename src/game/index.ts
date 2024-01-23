import Player from "./player"
import World from "./world"

export type GameProps = {
    player: Player
    world: World
}

type GamePartialProps = {
    player: Player
    world?: World
}

class Game {
    public props: GameProps

    public constructor(props: GamePartialProps) {
        const world = props.world ?? this.createWorld(props.player)
        
        this.props = {
            ...props,
            world: world
        }
    }

    private createWorld(player: Player): World {
        const world = new World({ seed: 1 })
        world.addPlayer(player, { x: 0, y: 0 })
        return world
    }

    public update() {
        // Update the game state based on input and physics
        // if (this.props.player) {
        //     this.props.player.update()
        // }

        // if (this.props.world) {
        //     this.props.world.update()
        // }
    }
}

export default Game