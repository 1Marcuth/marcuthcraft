import { blockSize, chunkWidth, playerSize, screenSize } from "./../game-config"
import Game from "./index"

type RequestAnimationFrameFunction = typeof requestAnimationFrame

function renderGame(
    game: Game,
    $canvas: HTMLCanvasElement,
    sourceImage: HTMLImageElement,
    requestAnimationFrame: RequestAnimationFrameFunction
) {
    const ctx = $canvas.getContext("2d") as CanvasRenderingContext2D

    const chunks = game.props.world.props.chunks
    const camera = game.props.player.props.camera
    const cameraX = camera.props.offset.x
    const cameraY = camera.props.offset.y

    function clearScreen() {
        ctx.clearRect(0, 0, screenSize.width, screenSize.height)
    }

    function drawBackground() {
        const backgroundSize = { width: 706, height: 326 }
        const backgroundCoord = { x: 0, y: 0 }
        const backgroundSpriteX = 80
        const backgroundSpriteY = 0
        const backgroundAspectRatio = backgroundSize.width / backgroundSize.height

        let backgroundWidth = screenSize.width
        let backgroundHeight = backgroundWidth / backgroundAspectRatio

        if (backgroundHeight < screenSize.height) {
            backgroundHeight = screenSize.height
            backgroundWidth = backgroundHeight * backgroundAspectRatio
        }

        ctx.drawImage(
            sourceImage,
            backgroundSpriteX,
            backgroundSpriteY,
            backgroundSize.width,
            backgroundSize.height,
            backgroundCoord.x,
            backgroundCoord.y,
            backgroundWidth,
            backgroundHeight
        )
    }

    function drawChunks() {
        const chunksAmount = Object.keys(chunks).length
        const currentChunkIndex = Math.floor(cameraX / (chunkWidth * blockSize.width))

        const startChunkIndex = Math.max(0, currentChunkIndex - 1)
        const endChunkIndex = Math.min(chunksAmount - 1, currentChunkIndex + 1)

        for (let chunkIndex = startChunkIndex; chunkIndex <= endChunkIndex; chunkIndex++) {
            const chunk = chunks[chunkIndex]
    
            for (let blockIndex = 0; blockIndex < chunk.props.data.length; blockIndex++) {
                const block = chunk.props.data[blockIndex]
                const x = (blockIndex % chunkWidth) * blockSize.width + chunkIndex * chunkWidth * blockSize.width
                const y = Math.floor(blockIndex / chunkWidth) * blockSize.height
    
                if (block.props.clipping) {
                    const blockSpriteX = block.props.clipping.x
                    const blockSpriteY = block.props.clipping.y
                    const blockClippingWidth = block.props.clipping.width
                    const blockClippingHeight = block.props.clipping.height
                    const blockX = x - cameraX + $canvas.width / 2
                    const blockY = y - cameraY
    
                    ctx.drawImage(
                        sourceImage,
                        blockSpriteX,
                        blockSpriteY,
                        blockClippingWidth,
                        blockClippingHeight,
                        blockX,
                        blockY,
                        blockSize.width,
                        blockSize.height
                    )
                }
            }
        }
    }

    function drawPlayer() {
        ctx.fillStyle = "#000"

        const playerX = ($canvas.width / 2) - (playerSize.width / 2)
        const playerY = ($canvas.height / 2) - (playerSize.height / 2)

        ctx.fillRect(
            playerX,
            playerY,
            playerSize.width,
            playerSize.height
        )   
    }

    clearScreen()
    drawBackground()
    drawChunks()
    drawPlayer()

    return requestAnimationFrame(() => {
        game.update()

        renderGame(
            game,
            $canvas,
            sourceImage,
            requestAnimationFrame
        )
    })
}

export default renderGame
