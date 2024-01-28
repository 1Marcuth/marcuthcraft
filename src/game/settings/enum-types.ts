enum BiomeTypes {
    PLAINS = "PLAINS",
    MOUNTAIN = "MOUNTAIN",
    FOREST = "FOREST",
    TAIGA = "TAIGA",
    JUNGLE = "JUNGLE"
}

enum BlockTypes {
    BEDROCK = "BEDROCK",
    DIAMOND_ORE = "DIAMOND_ORE",
    GOLD_ORE = "GOLD_ORE",
    IRON_ORE = "IRON_ORE",
    COAL_ORE = "COAL_ORE",
    STONE = "STONE",
    DIRT = "DIRT",
    GRASS = "GRASS",
    OAK_TRUNK = "OAK_TRUNK",
    OAK_LEAF = "OAK_LEAF",
    AIR = "AIR",
    WATER = "WATER",
    LAVA = "LAVA"
}

type BiomeType = string | keyof typeof BiomeTypes
type BlockType = string | keyof typeof BlockTypes

export {
    BiomeTypes,
    BlockTypes
}

export type {
    BiomeType,
    BlockType
}