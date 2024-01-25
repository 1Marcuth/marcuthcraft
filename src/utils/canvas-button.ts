export type CanvasButtonProps = {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    width: number
    height: number
    onClick?: () => any
    onDoubleClick?: () => any
    onMouseUp?: () => any
    onMouseDown?: () => any
}

type ImageClipping = {
    x: number
    y: number
    width: number
    height: number
}

type DrawProps = {
    image?: HTMLImageElement
    imageClipping?: ImageClipping
    color?: string
}

class CanvasButton {
    public props: CanvasButtonProps
    private isEventListenersAdded: boolean = false

    public constructor(props: CanvasButtonProps) {
        this.props = props

        this.handleClick = this.handleClick.bind(this)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
    }

    private isPointInsideButton(pointX: number, pointY: number, buttonX: number, buttonY: number, buttonWidth: number, buttonHeight: number) {
        return (
            pointX >= buttonX &&
            pointX <= buttonX + buttonWidth &&
            pointY >= buttonY &&
            pointY <= buttonY + buttonHeight
        )
    }

    private handleMouseMove(event: MouseEvent) {
        const { offsetX, offsetY } = event
        const { x, y, width, height } = this.props

        const ctx = this.props.ctx
        
        if (
            offsetX >= x &&
            offsetX <= x + width &&
            offsetY >= y &&
            offsetY <= y + height
        ) {
            ctx.canvas.style.cursor = "pointer"
        } else {
            ctx.canvas.style.cursor = "auto"
        }
    }

    private handleClick(event: MouseEvent) {
        const { offsetX, offsetY } = event
        const { x, y, width, height } = this.props

        if (this.isPointInsideButton(offsetX, offsetY, x, y, width, height) && this.props.onClick) {
            this.props.onClick()
        }
    }

    private handleDoubleClick(event: MouseEvent) {
        const { offsetX, offsetY } = event
        const { x, y, width, height } = this.props
        
        if (this.isPointInsideButton(offsetX, offsetY, x, y, width, height) && this.props.onDoubleClick) {
            this.props.onDoubleClick()
        }
    }

    private handleMouseUp(event: MouseEvent) {
        const { offsetX, offsetY } = event
        const { x, y, width, height } = this.props
        
        if (this.isPointInsideButton(offsetX, offsetY, x, y, width, height) && this.props.onMouseUp) {
            this.props.onMouseUp()
        }
    }

    private handleMouseDown(event: MouseEvent) {
        const { offsetX, offsetY } = event
        const { x, y, width, height } = this.props
        
        if (this.isPointInsideButton(offsetX, offsetY, x, y, width, height) && this.props.onMouseDown) {
            this.props.onMouseDown()
        }
    }

    public draw({
        image,
        imageClipping,
        color
    }: DrawProps) {
        if (!image && !color) return

        if (color) {
            this.props.ctx.fillStyle = color

            this.props.ctx.fillRect(
                this.props.x,
                this.props.y,
                this.props.width,
                this.props.height
            )

        } else if (image) {
            if (imageClipping) {
                this.props.ctx.drawImage(
                    image,
                    imageClipping.x,
                    imageClipping.y,
                    imageClipping.width,
                    imageClipping.height,
                    this.props.x,
                    this.props.y,
                    this.props.width,
                    this.props.height
                )
            } else {
                this.props.ctx.drawImage(
                    image,
                    this.props.x,
                    this.props.y,
                    this.props.width,
                    this.props.height
                )
            }

        } else {
            throw new Error("Either a color or an image must be provided")
        }

        if (!this.isEventListenersAdded) {
            this.props.ctx.canvas.addEventListener("mousedown", this.handleMouseDown)
            this.props.ctx.canvas.addEventListener("mouseup", this.handleMouseUp)
            this.props.ctx.canvas.addEventListener("click", this.handleClick)
            this.props.ctx.canvas.addEventListener("dblclick", this.handleDoubleClick)
            this.props.ctx.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
            this.isEventListenersAdded = true
        }
    }

    public destroy(ctx: CanvasRenderingContext2D) {
        if (this.isEventListenersAdded) {
            ctx.canvas.removeEventListener("mousedown", this.handleMouseDown)
            ctx.canvas.removeEventListener("mouseup", this.handleMouseUp)
            ctx.canvas.removeEventListener("click", this.handleClick)
            ctx.canvas.removeEventListener("dblclick", this.handleDoubleClick)
            ctx.canvas.removeEventListener("mousemove", this.handleMouseMove)
            this.isEventListenersAdded = false
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }
}

export default CanvasButton