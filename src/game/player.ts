import { defaultMoveSpeed } from "../game-config"
import randomUUID from "../utils/id-generator"
import Camera from "./camera"

type Position = {
    x: number
    y: number
}

enum MovementDirections {
    LEFT = "LEFT",
    RIGHT =  "RIGHT"
}

type MovementDirectionType = keyof typeof MovementDirections | string

export type PlayerProps = {
    camera: Camera
    position: Position
    skin: HTMLImageElement
    isClimbing: boolean
    isFalling: boolean
    isHurt: boolean
    isJumping: boolean
    lastJumpTime: number
    currentMovementDirection: MovementDirectionType

    currentHealthPoints?: number
    healthPoints?: number
    currentSaturationPoints?: number
    saturationPoints?: number
    inventorySlots?: []
    selectedInventorySlotIndex?: number
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
    "isJumping" |
    "isHurt" |
    "lastJumpTime" | 
    "currentMovementDirection"
>

const defaultProps = {
    isClimbing: false,
    isFalling: false,
    isJumping: false,
    isHurt: false,
    lastJumpTime: 0,
    position: {
        x: 0,
        y: 0
    },
    currentMovementDirection: MovementDirections.LEFT
}

export type PlayerData = {
    id: string
    position: Position
    isClimbing: boolean
    isFalling: boolean
    isHurt: boolean
    isJumping: boolean
    lastJumpTime: number
    currentMovementDirection: MovementDirectionType
    currentHealthPoints: number
    healthPoints: number
    currentSaturationPoints: number
    saturationPoints: number
    inventorySlots: []
    selectedInventorySlotIndex: number
}

class Player {
    public id: string
    public props: PlayerProps
    private observers: Observer[] = []

    public constructor(props: PlayerPartialProps, id?: string) {
        this.id = id ?? randomUUID()

        const camera = new Camera({
            offset: { x: 0, y: 0 },
            moveSpeed: defaultMoveSpeed
        })

        this.props = {
            ...props,
            ...defaultProps,
            position: camera.props.offset,
            camera: camera
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

    public getData(): PlayerData {
        const data: PlayerData = {
            id: this.id,
            position: this.props.position,
            isClimbing: this.props.isClimbing,
            isFalling: this.props.isFalling,
            isHurt: this.props.isHurt,
            isJumping: this.props.isJumping,
            lastJumpTime: this.props.lastJumpTime,
            currentMovementDirection: this.props.currentMovementDirection,
            currentHealthPoints: this.props.currentHealthPoints ?? 0,
            healthPoints: this.props.healthPoints ?? 0,
            currentSaturationPoints: this.props.currentSaturationPoints ?? 0,
            saturationPoints: this.props.saturationPoints ?? 0,
            inventorySlots: this.props.inventorySlots ?? [],
            selectedInventorySlotIndex: this.props.selectedInventorySlotIndex ?? 0,
        }

        return data
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