import { defaultMoveSpeed, playerSpawnCoord } from "../game-config"
import Camera from "./camera"

type Position = {
    x: number
    y: number
}

export type PlayerProps = {
    camera: Camera,
    position: Position
    skin: HTMLImageElement
    isClimbing: boolean
    isFalling: boolean
    lastJump: number
}

enum PlayerEvents {
    moveToLeft,
    moveToRight,
    jump,
    sneak,
    fall,
    die,
    respawn
}

type PlayerEventType = keyof typeof PlayerEvents

type Observer = (eventType: PlayerEventType, ...args: any[]) => any

type PlayerAction = () => any

export function getPlayerAction(key: string, player: Player): PlayerAction | null {
    const acceptedKeys: { [key: string]: PlayerAction } = {
        ArrowUp: () => player.jump(),
        Space: () => player.jump(),
        KeyW: () => player.jump(),
        ArrowDown: () => player.sneak(),
        KeyS: () => player.sneak(),
        ShiftLeft: () => player.sneak(),
        ShiftRight: () => player.sneak(),
        ArrowLeft: () => player.move("left"),
        KeyA: () => player.move("left"),
        ArrowRight: () => player.move("right"),
        KeyD: () => player.move("right")
    }

    if (key in acceptedKeys) {
        return acceptedKeys[key]
    }

    return null
}

enum PlayerMoveDirections {
    left,
    right
}

type PlayerMoveDirectionsType = keyof typeof PlayerMoveDirections

type PlayerPartialProps = Omit<
    PlayerProps,
    "camera" |
    "position" |
    "isClimbing" | 
    "isFalling" | 
    "lastJump"
>

class Player {
    public props: PlayerProps
    private observers: Observer[] = []

    public constructor(props: PlayerPartialProps) {
        const playerInitialPosition = {...playerSpawnCoord}

        const camera = new Camera({
            offset: playerInitialPosition,
            moveSpeed: defaultMoveSpeed
        })

        this.props = {
            ...props,
            position: camera.props.offset,
            camera: camera,
            isClimbing: false,
            isFalling: false,
            lastJump: 0
        }
    }

    public move(direction: PlayerMoveDirectionsType) {
        if (direction === "left") {
            this.notifyAll("moveToLeft")
            this.props.camera.setMoveDirection({ left: true })
        } else if (direction === "right") {
            this.notifyAll("moveToRight")
            this.props.camera.setMoveDirection({ right: true })
        }

        this.props.camera.move()
        this.props.position = this.props.camera.props.offset
    }

    public jump() {
        this.notifyAll("jump")
        this.props.camera.setMoveDirection({ up: true })
        this.props.camera.move()
        this.props.position = this.props.camera.props.offset
    }

    public sneak() {
        this.notifyAll("sneak")
        // Se estiver voando
        this.props.camera.setMoveDirection({ down: true })
        this.props.camera.move()
        this.props.position = this.props.camera.props.offset
    }

    public die() {
        this.notifyAll("die")
    }

    public subscribe(observer: Observer) {
        this.observers.push(observer)
    }

    private notifyAll(eventType: PlayerEventType, ...args: any[]) {
        for (const observer of this.observers) {
            observer(eventType, ...args)
        }
    }

    public setSkinImage(skinImage: HTMLImageElement) {
        this.props.skin = skinImage
    }
}

export default Player