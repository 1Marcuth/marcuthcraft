export type CanvasButtonProps = {
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
    ctx: CanvasRenderingContext2D
    x: number,
    y: number,
    width?: number
    height?: number 
    image?: HTMLImageElement
    imageClipping?: ImageClipping
    color?: string
}

class CanvasButton {
    public props: CanvasButtonProps
    private isEventListenersAdded: boolean = false

    public constructor(props: CanvasButtonProps) {
        this.props = props
    }

    private isPointInsideButton(pointX: number, pointY: number, buttonX: number, buttonY: number, buttonWidth: number, buttonHeight: number) {
        return (
            pointX >= buttonX &&
            pointX <= buttonX + buttonWidth &&
            pointY >= buttonY &&
            pointY <= buttonY + buttonHeight
        )
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
        ctx,
        x,
        y,
        width,
        height,
        image,
        imageClipping,
        color
    }: DrawProps) {
        if (!width || !height) {
            if (!image) return
            width = image.width
            height = image.height
        } else if (!color) return

        if (color) {
            ctx.fillStyle = color

            ctx.fillRect(
                x,
                y,
                width,
                height
            )

        } else if (image) {
            if (imageClipping) {
                ctx.drawImage(
                    image,
                    imageClipping.x,
                    imageClipping.y,
                    imageClipping.width,
                    imageClipping.height,
                    x,
                    y,
                    width,
                    height
                )
            } else {
                ctx.drawImage(
                    image,
                    x,
                    y,
                    width,
                    height
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
            this.isEventListenersAdded = true
        }
    }

    public destroy(ctx: CanvasRenderingContext2D) {
        if (this.isEventListenersAdded) {
            ctx.canvas.removeEventListener("mousedown", this.handleMouseDown)
            ctx.canvas.removeEventListener("mouseup", this.handleMouseUp)
            ctx.canvas.removeEventListener("click", this.handleClick)
            ctx.canvas.removeEventListener("dblclick", this.handleDoubleClick)
            this.isEventListenersAdded = false
        }
    }
}

export default CanvasButton