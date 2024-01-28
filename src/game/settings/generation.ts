import { BiomeType, BlockTypes, BiomeTypes, BlockType } from "./enum-types"

type NoiseVariation = {
    strength: number
    scale: number
}

type SpawnVariationLayer = {
    layerRange: [number, number]
    alternativeBlocks: BlockType[]
    spawnChance: number
    noiseVariation?: NoiseVariation
}

type BlockLayer = {
    layerRange: [number, number]
    blockType: BlockType
    spawnVariationLayers?: SpawnVariationLayer[]
}

type SpawnOreMaxLayerHeight = number | "biomeMaxHeight"

type ReplaceableBlocks = BlockType[] | "*"
type UnreplaceableBlocks = BlockType[]

type Ore = {
    spawnLayerRange: [number, SpawnOreMaxLayerHeight]
    noiseDensity: number
    cellularAutomatonIterations: number
    blockType: BlockType
    replaceableBlocks?: ReplaceableBlocks
    unreplaceableBlocks?: UnreplaceableBlocks
}

type BiomeGenerationSettings = {
    type: BiomeType
    spawnChance: number
    maxHeight: number
    heightNoiseMultiplier: number
    ores: Ore[]
    blockLayers: BlockLayer[]
}

const biomeGenerationSettings: BiomeGenerationSettings[] = [
    {
        type: BiomeTypes.MOUNTAIN,
        spawnChance: .1,
        maxHeight: 160,
        heightNoiseMultiplier: 15,
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
                    }
                ]
            },
            {
                layerRange: [ 81, 90 ],
                blockType: BlockTypes.DIRT,
            }
        ],
        ores: [
            {
                spawnLayerRange: [ 20, "biomeMaxHeight" ],
                blockType: BlockTypes.COAL_ORE,
                noiseDensity: .67,
                cellularAutomatonIterations: 1,
                replaceableBlocks: [ BlockTypes.STONE ]
            },
            {
                spawnLayerRange: [ 20, "biomeMaxHeight" ],
                blockType: BlockTypes.IRON_ORE,
                noiseDensity: .67,
                cellularAutomatonIterations: 1,
                replaceableBlocks: [ BlockTypes.STONE, BlockTypes.COAL_ORE ]
            },
            {
                spawnLayerRange: [ 0, 45 ],
                blockType: BlockTypes.GOLD_ORE,
                noiseDensity: .64,
                cellularAutomatonIterations: 4,
                replaceableBlocks: [ BlockTypes.STONE, BlockTypes.COAL_ORE, BlockTypes.IRON_ORE ]
            },
            {
                spawnLayerRange: [ 0, 18 ],
                blockType: BlockTypes.DIAMOND_ORE,
                noiseDensity: .64,
                cellularAutomatonIterations: 3,
                replaceableBlocks: [
                    BlockTypes.STONE,
                    BlockTypes.COAL_ORE,
                    BlockTypes.IRON_ORE,
                    BlockTypes.GOLD_ORE
                ]
            }
        ]
    }
]

export { biomeGenerationSettings }

export type { BiomeGenerationSettings }