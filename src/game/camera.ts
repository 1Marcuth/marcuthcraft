import { defaultMoveSpeed } from "./../game-config"

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

    public constructor(props: CameraProps) {
        this.props = {
            ...props,
            moveSpeed: props.moveSpeed ?? defaultMoveSpeed
        }
    }

    public setMoveSpeed(newMoveSpeed: number) {
        this.props.moveSpeed = newMoveSpeed
    }

    public setMoveDirection(newMoveDirection: MoveDirection) {
        this.props.moveDirection = newMoveDirection
    }

    public move() {
        if (!this.props.moveSpeed || !this.props.moveDirection) return

		if (this.props.moveDirection.left) {
			this.props.offset.x -= this.props.moveSpeed
		}
        
		if (this.props.moveDirection.right) {
			this.props.offset.x += this.props.moveSpeed
		}

		if (this.props.moveDirection.up) {
			this.props.offset.y -= this.props.moveSpeed
		}

		if (this.props.moveDirection.down) {
			this.props.offset.y += this.props.moveSpeed
		}
	}
}

export default Camera