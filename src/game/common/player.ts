import { blockSize, gravity, playerJumpHeight, playerMaxFallSpeed, playerVisionScale, screenSize, worldSize } from "../settings/index"
import { calculateJumpSpeed } from "../utils/gravity"
import randomUUID from "../../utils/id-generator"
import Camera from "./camera"
import calculateScreenPosition from "../utils/calculate-screen-position"

type Position = {
    x: number
    y: number
}

enum MovementDirections {
    LEFT = "LEFT",
    RIGHT =  "RIGHT"
}

type MovementDirectionType = keyof typeof MovementDirections | string

type Speed = {
    x: number
    y: number
}

export type PlayerProps = {
    camera: Camera
    speed: Speed
    position: Position
    skin: HTMLImageElement
    isClimbing: boolean
    isFalling: boolean
    isHurt: boolean
    isJumping: boolean
    isRising: boolean
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

type BlockPosition = {
    x: number
    y: number
}

type UpdateOptions = {
    blockPositions: BlockPosition[]
}

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
    "position" |
    "isClimbing" | 
    "isFalling" | 
    "isJumping" |
    "isHurt" |
    "isRising" |
    "lastJumpTime" | 
    "speed" |
    "currentMovementDirection"
>

const defaultProps = {
    isClimbing: false,
    isFalling: false,
    isJumping: false,
    isHurt: false,
    isRising: false,
    lastJumpTime: 0,
    position: {
        x: 0,
        y: 0
    },
    currentMovementDirection: MovementDirections.LEFT,
    speed: {
        x: 0,
        y: 0
    }
}

export type PlayerData = {
    id: string
    speed: Speed
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

    private observers: Observer[] = [
        // (event, ...args) => {
        //     if (event === "jump" || event === "fall") {
        //         this.props.camera.props.moveSpeed = this.props.speed.y
        //     } else if (event === "moveToLeft" || event === "moveToRight") {
        //         this.props.camera.props.moveSpeed = this.props.speed.x
        //     }
        // },
        (event) => console.log(this, event)
    ]

    private reachedJumpMaxHeight: boolean = false

    public constructor(props: PlayerPartialProps, id?: string) {
        this.id = id ?? randomUUID()

        this.props = {
            ...props,
            ...defaultProps,
            position: calculateScreenPosition({
                x: 0,
                y: 0,
                blockSize: blockSize,
                worldSize: worldSize,
                screenSize: screenSize,
                scale: playerVisionScale
            })
        }

        this.props.camera.props.offset = {x: -640, y: 3540}
    }

    public move(direction: PlayerMoveDirectionsType): void {
        if (direction === "left") {
            this.notifyAll("moveToLeft")
            this.props.position.x -= this.props.camera.props.moveSpeed ?? 0
            //this.props.camera.move({ left: true })
        } else if (direction === "right") {
            this.notifyAll("moveToRight")
            this.props.position.x += this.props.camera.props.moveSpeed ?? 0
            //this.props.camera.move({ right: true })
        }
    }

    public jump(): void {
        const canJump = true//!this.props.isJumping && !this.props.isFalling && !this.props.isHurt

        if (canJump) {
            this.notifyAll("jump")
            this.props.position.y -= this.props.camera.props.moveSpeed ?? 0
            this.props.speed.y = calculateJumpSpeed({ gravity: 0.1, height: playerJumpHeight })
            //this.props.camera.move({ up: true })
            this.props.isJumping = true
        }
    }

    public sneak(): void {
        this.notifyAll("sneak")
        this.props.position.y += this.props.camera.props.moveSpeed ?? 0
        //this.props.camera.move({ down: true })
    }

    public die(): void {
        this.notifyAll("die")
    }

    public getData(): PlayerData {
        const data: PlayerData = {
            id: this.id,
            speed: this.props.speed,
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
    
    public setSkinImage(skinImage: HTMLImageElement): void {
        this.props.skin = skinImage
    }

    private checkBlockCollision(blockPositions: BlockPosition[]): void {
        const playerBottom = this.props.position.y - this.props.skin.height

        for (const blockPosition of blockPositions) {
            const blockTop = blockPosition.y
            const blockBottom = blockPosition.y + blockSize.height
            const blockLeft = blockPosition.x
            const blockRight = blockPosition.x + blockSize.width

            const isAboveTopOfBlock = playerBottom <= blockTop
            const isRightOfLeftSideOfBlock = this.props.position.x >= blockLeft
            const isLeftOfRightSideOfBlock = this.props.position.x <= blockRight

            if (isAboveTopOfBlock && isRightOfLeftSideOfBlock && isLeftOfRightSideOfBlock) {
                this.props.position.y = blockTop + this.props.skin.height
                this.props.isJumping = false
                this.props.speed.y = 0
                return
            }
        }

        this.props.isJumping = true
    }

    public update({ blockPositions }: UpdateOptions): void {
        this.props.position.x += this.props.speed.x

        this.checkBlockCollision(blockPositions)

        if (!this.props.isJumping) {
            this.applyGravity()
        }

        this.props.position.y += this.props.speed.y

        if (this.props.isJumping) {
            this.props.speed.y = 0
            this.props.isJumping = false
        }

        if (this.props.position.y >= 0) {
            this.props.position.y = 0
            this.props.isRising = false
        } else {
            this.props.isRising = true
        }
    }

    private applyGravity(): void {
        this.props.speed.y -= gravity

        if (this.props.speed.y < -playerMaxFallSpeed) {
            this.props.speed.y = -playerMaxFallSpeed
        }
    }

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    private notifyAll(eventType: PlayerEventType, ...args: any[]): void {
        for (const observer of this.observers) {
            observer(eventType, ...args)
        }
    }
}

export default Player