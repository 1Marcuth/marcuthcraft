type BlockSize = {
    width: number
    height: number
}

type WorldSize = {
    width: number
    height: number
}

type ScreenSize = {
    width: number
    height: number
}

export type CalculateScreenPosition = {
    x: number
    y: number
    blockSize: BlockSize
    worldSize: WorldSize
    screenSize: ScreenSize
    scale: number
}

function calculateScreenPosition({
    x,
    y,
    blockSize,
    worldSize,
    screenSize,
    scale
}: CalculateScreenPosition) {
    const adjustedScale = Math.min(screenSize.width / worldSize.width, screenSize.height / worldSize.height) * scale

    const screenX = (x * blockSize.width) * adjustedScale
    const screenY = ((worldSize.height - (worldSize.height * y)) * blockSize.height) * adjustedScale

    const calculatedPosition = {
        x: screenX,
        y: screenY
    }

    return calculatedPosition
}

export default calculateScreenPosition