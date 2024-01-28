export const screenSize = {
    width: 1280,
    height: 720
}

export const visionScale = .25

export const gameVersion = "0.1"

export const chunksRenderedByDirection = 4
export const chunkWidth = 16
export const maxChunksToLeft = 5
export const maxChunksToRight = maxChunksToLeft
export const startChunkIndex = Math.floor((maxChunksToLeft + maxChunksToLeft) / 2)

export const defaultMoveSpeed = 120 * visionScale

export const worldSize = {
    width: (maxChunksToLeft + maxChunksToRight + 1) * chunkWidth,
    height: 256
}

export const blockSize = { width: 60, height: 60 }

export const splashMessages = [
    "Feito em TypeScript!",
    "Made in TypeScript",
    "TypeScript is awesome!",
    "Try Minecraft",
    "GitHub: @1Marcuth",
    "Insta: @marcuth.dev",
    "By Marcuth"
]

export const splashMessageIntervalTime = 10000

export const playerSize = {
    width: blockSize.width / 2,
    height: blockSize.height * 2
}

export const playerSpawnCoord = {
    x: (Math.floor((startChunkIndex + 1 + maxChunksToRight) * chunkWidth / 2) * blockSize.width) * visionScale,
    y: (((worldSize.height - 70) - 8) * blockSize.height) * visionScale
}