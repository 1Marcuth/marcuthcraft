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
    imageMouseOver?: HTMLImageElement
    imageClipping?: ImageClipping
    imageMouseOverClipping?: ImageClipping
    color?: string
    colorMouseOver?: string
}

class CanvasButton {
    public props: CanvasButtonProps

    private isEventListenersAdded: boolean = false
    private lastMouseMovementCheck: number = 0
    private isMouseOver: boolean = false

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
        const currentTime = Date.now()

        const { offsetX, offsetY } = event
        const { x, y, width, height } = this.props

        const ctx = this.props.ctx

        if (
            offsetX >= x &&
            offsetX <= x + width &&
            offsetY >= y &&
            offsetY <= y + height &&
            !this.isMouseOver
        ) {
            ctx.canvas.style.cursor = "pointer"
            this.isMouseOver = true
            this.lastMouseMovementCheck = currentTime
        } else if (this.isMouseOver && currentTime > this.lastMouseMovementCheck + 150) {
            this.lastMouseMovementCheck = currentTime
            ctx.canvas.style.cursor = "auto"
            this.isMouseOver = false
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
        imageMouseOver,
        imageMouseOverClipping,
        color,
        colorMouseOver
    }: DrawProps) {        
        if (!image && !color) return

        const selectedImage = this.isMouseOver ? (imageMouseOver && imageMouseOverClipping ? imageMouseOver : image) : image
        const selectedImageClipping = this.isMouseOver ? (imageMouseOver && imageMouseOverClipping ? imageMouseOverClipping : imageClipping) : imageClipping
        const selectedColor = this.isMouseOver ? (colorMouseOver ? colorMouseOver : color) : color

        const { ctx } = this.props

        if (selectedColor) {
            ctx.fillStyle = selectedColor

            ctx.fillRect(
                this.props.x,
                this.props.y,
                this.props.width,
                this.props.height
            )

        } else if (selectedImage) {
            if (selectedImageClipping) {
                ctx.drawImage(
                    selectedImage,
                    selectedImageClipping.x,
                    selectedImageClipping.y,
                    selectedImageClipping.width,
                    selectedImageClipping.height,
                    this.props.x,
                    this.props.y,
                    this.props.width,
                    this.props.height
                )
            } else {
                ctx.drawImage(
                    selectedImage,
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
            ctx.canvas.addEventListener("mousedown", this.handleMouseDown)
            ctx.canvas.addEventListener("mouseup", this.handleMouseUp)
            ctx.canvas.addEventListener("click", this.handleClick)
            ctx.canvas.addEventListener("dblclick", this.handleDoubleClick)
            ctx.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
            this.isEventListenersAdded = true
        }
    }

    public destroy() {
        const { ctx } = this.props

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
        //this.handleMouseMove = this.handleMouseMove.bind(this)
    }
}

export default CanvasButton