export const screenSize = {
    width: 1280,
    height: 720
}

export const visionScale = .25
export const chunksRenderedByDirection = 4
export const bedrockEnd = 5
export const dirtStart = 66
export const dirtEnd = dirtStart + 4
export const diamondStart = 5
export const diamondEnd = diamondStart + 9
export const goldStart = 20
export const goldEnd = goldStart + 9
export const ironStart = 40
export const ironEnd = ironStart + 17
export const coalStart = 40
export const coalEnd = coalStart + 19
export const coalGenerationChance = 0.03
export const ironGenerationChance = 0.015
export const goldGenerationChance = 0.0075
export const diamondGenerationChance = 0.0030

export const maxHeight = 12
export const minHeight = 0
export const chunkWidth = 16
export const maxChunksToLeft = 20
export const maxChunksToRight = maxChunksToLeft
export const startChunkIndex = Math.floor((maxChunksToLeft + maxChunksToLeft) / 2)
export const defaultMoveSpeed = 60
export const worldHeight = 128
export const blockSize = { width: 60, height: 60 }
export const maxCaveHeigh = 20
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
    y: (((worldHeight - dirtEnd) - 8) * blockSize.height) * visionScale
}

export const blocks = [
    {
        name: "Air",
        type: "AIR",
        isSolid: false
    },
    {
        name: "Dirty",
        type: "DIRTY",
        resistance: 1000,
        isSolid: true,
        clipping: {
            x: 0,
            y: 0,
            width: 16,
            height: 16
        }
        //color: "#845b3c"
    },
    {
        name: "Grass",
        type: "GRASS",
        resistance: 1000,
        isSolid: true,
        clipping: {
            x: 16,
            y: 0,
            width: 16,
            height: 16
        }
        //color: "#7cfc00"
    },
    {
        name: "Stone",
        type: "STONE",
        resistance: 2000,
        isSolid: true,
        clipping: {
            x: 32,
            y: 0,
            width: 16,
            height: 16
        }
        //color: "#7d7a79"
    },
    {
        name: "Water",
        type: "WATER",
        isSolid: false,
        clipping: {
            x: 0,
            y: 16,
            width: 16,
            height: 16
        }
        //color: "#0073e6"
    },
    {
        name: "Lava",
        type: "LAVA",
        isSolid: false,
        clipping: {
            x: 16,
            y: 16,
            width: 16,
            height: 16
        }
        //color: "#ff0000"
    },
    {
        name: "Bedrock",
        type: "BEDROCK",
        isSolid: true,
        resistance: "infinite",
        clipping: {
            x: 48,
            y: 0,
            width: 16,
            height: 16
        }
        //color: "#3f3f3f"
    },
    {
        name: "Wood",
        type: "WOOD",
        resistance: 1000,
        isSolid: true,
        clipping: {
            x: 64,
            y: 0,
            width: 16,
            height: 16
        }
        //color: "#deb887"
    },
    {
        name: "Leaf",
        type: "LEAF",
        isSolid: false,
        resistance: 250,
        clipping: {
            x: 64,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Coal Ore",
        type: "COAL_ORE",
        isSolid: true,
        resistance: 2000,
        clipping: {
            x: 32,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Diamond Ore",
        type: "DIAMOND_ORE",
        isSolid: true,
        resistance: 2000,
        clipping: {
            x: 48,
            y: 32,
            width: 16,
            height: 16
        }
    },
    {
        name: "Iron Ore",
        type: "IRON_ORE",
        isSolid: true,
        resistance: 2000,
        clipping: {
            x: 48,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Gold Ore",
        type: "GOLD_ORE",
        isSolid: true,
        resistance: 2000,
        clipping: {
            x: 32,
            y: 32,
            width: 16,
            height: 16
        }
    }
]

export const mobs = [
    {
        name: "Zombie",
        health: 10,
        speed: 1.5,
        damage: 2,
        chanceToSpawn: 0.5
    },
    {
        name: "Cow",
        health: 10,
        speed: 0.5,
        damage: 0,
        chanceToSpawn: 0.3
    }
]