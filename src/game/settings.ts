export enum BiomeTypes {
    PLAINS = "PLAINS",
    MOUNTAIN = "MOUNTAIN",
    FOREST = "FOREST",
    TAIGA = "TAIGA",
    JUNGLE = "JUNGLE"
}

export enum BlockTypes {
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
    LAVA = "LAVA",
}

type AlternativeBlockType = string

type NoiseVariation = {
    strength: number
    scale: number
}

type SpawnVariationLayer = {
    layerRange: [number, number]
    alternativeBlocks: AlternativeBlockType[]
    spawnChance: number
    noiseVariation?: NoiseVariation
}

type BlockLayer = {
    layerRange: [number, number]
    blockType: string
    spawnVariationLayers?: SpawnVariationLayer[]
}

type BiomeGenerationSettings = {
    type: string
    spawnChance: number
    blockLayers: BlockLayer[]
}

const biomeGenerationSettings: BiomeGenerationSettings[] = [
    {
        type: BiomeTypes.MOUNTAIN,
        spawnChance: .1,
        blockLayers: [
            {
                layerRange: [ 0, 4 ],
                blockType: BlockTypes.BEDROCK,
                spawnVariationLayers: [
                    {
                        layerRange: [ 2, 3 ],
                        spawnChance: 0.15,
                        alternativeBlocks: [ BlockTypes.STONE ],
                        noiseVariation: {
                            strength: 0.2,
                            scale: 0.1,
                        }
                    },
                    {
                        layerRange: [ 3, 4 ],
                        spawnChance: 0.35,
                        alternativeBlocks: [ BlockTypes.STONE ],
                        noiseVariation: {
                            strength: 0.2,
                            scale: 0.1,
                        }
                    }
                ]
            },
            {
                layerRange: [ 5, 80 ],
                blockType: BlockTypes.STONE,
                spawnVariationLayers: [
                    {
                        layerRange: [ 78, 79 ],
                        spawnChance: 0.25,
                        alternativeBlocks: [ BlockTypes.DIRT ],
                        noiseVariation: {
                            strength: 0.1,
                            scale: 0.05,
                        }
                    },
                    {
                        layerRange: [ 79, 80 ],
                        spawnChance: 0.5,
                        alternativeBlocks: [ BlockTypes.DIRT ],
                        noiseVariation: {
                            strength: 0.1,
                            scale: 0.05,
                        }
                    },
                    {
                        layerRange: [ 20, 80 ],
                        spawnChance: 0.01806640625,
                        alternativeBlocks: [ BlockTypes.COAL_ORE ]
                    },
                    {
                        layerRange: [ 10, 80 ],
                        spawnChance: 0.01953125,
                        alternativeBlocks: [ BlockTypes.IRON_ORE ]
                    },
                    {
                        layerRange: [ 6, 30 ],
                        spawnChance: 0.0143,
                        alternativeBlocks: [ BlockTypes.GOLD_ORE ]
                    },
                    {
                        layerRange: [ 5, 18 ],
                        spawnChance: 0.0029296875,
                        alternativeBlocks: [ BlockTypes.DIAMOND_ORE ]
                    }
                ]
            },
            {
                layerRange: [ 81, 90 ],
                blockType: BlockTypes.DIRT,
            }
        ]
    },
    /*{
        type: BiomeTypes.FOREST,
        spawnChance: .2,
        blockLayers: [
            {
                layerRange: [ 0, 4 ],
                blockType: BlockTypes.BEDROCK,
                spawnVariationLayers: [
                    {
                        layerRange: [ 2, 3 ],
                        spawnChance: 0.5,
                        alternativeBlocks: [ BlockTypes.STONE ],
                        noiseVariation: {
                            strength: 0.2,
                            scale: 0.1,
                        }
                    },
                    {
                        layerRange: [ 3, 4 ],
                        spawnChance: 0.25,
                        alternativeBlocks: [ BlockTypes.STONE ],
                        noiseVariation: {
                            strength: 0.2,
                            scale: 0.1,
                        }
                    }
                ]
            },
            {
                layerRange: [ 5, 60 ],
                blockType: BlockTypes.STONE,
                spawnVariationLayers: [
                    {
                        layerRange: [ 58, 59 ],
                        spawnChance: 0.25,
                        alternativeBlocks: [ BlockTypes.DIRT ],
                        noiseVariation: {
                            strength: 0.1,
                            scale: 0.05,
                        }
                    },
                    {
                        layerRange: [ 59, 60 ],
                        spawnChance: 0.5,
                        alternativeBlocks: [ BlockTypes.DIRT ],
                        noiseVariation: {
                            strength: 0.1,
                            scale: 0.05,
                        }
                    }
                ]
            },
            {
                layerRange: [ 61, 65 ],
                blockType: BlockTypes.DIRT,
            },
            {
                layerRange: [ 10, 40 ],
                blockType: BlockTypes.IRON_ORE,
                spawnVariationLayers: [
                    {
                        layerRange: [ 20, 30 ],
                        spawnChance: 0.3,
                        alternativeBlocks: [ BlockTypes.STONE ],
                        noiseVariation: {
                            strength: 0.1,
                            scale: 0.05,
                        }
                    }
                ]
            },
            {
                layerRange: [ 30, 50 ],
                blockType: BlockTypes.COAL_ORE,
                spawnVariationLayers: [
                    {
                        layerRange: [ 40, 45 ],
                        spawnChance: 0.2,
                        alternativeBlocks: [ BlockTypes.STONE ],
                        noiseVariation: {
                            strength: 0.1,
                            scale: 0.05,
                        }
                    }
                ]
            }
        ]
    }*/
]

export { biomeGenerationSettings }