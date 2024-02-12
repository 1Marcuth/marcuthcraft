import { defaultPlayerMoveSpeed } from "../settings/index"

type Offset = {
    x: number
    y: number
}

type MoveDirection = {
    up?: boolean
    down?: boolean
    right?: boolean
    left?: boolean
}

export type CameraProps = {
    offset: Offset
    moveDirection?: MoveDirection
    moveSpeed?: number
}

class Camera {
    public props: CameraProps
    public moveDirection?: MoveDirection

    public constructor(props: CameraProps) {
        this.props = {
            ...props,
            moveSpeed: props.moveSpeed ?? defaultPlayerMoveSpeed
        }
    }

    public move(moveDirection: MoveDirection) {
        this.moveDirection = moveDirection
        
        if (!this.props.moveSpeed || !this.moveDirection) return

        if (this.moveDirection.left) {
            this.props.offset.x -= this.props.moveSpeed
        }
        
        if (this.moveDirection.right) {
            this.props.offset.x += this.props.moveSpeed
        }

        if (this.moveDirection.up) {
            this.props.offset.y -= this.props.moveSpeed
        }

        if (this.moveDirection.down) {
            this.props.offset.y += this.props.moveSpeed
        }
    }
}

export default Camera