import { biomeGenerationSettings, BiomeGenerationSettings } from "./settings/generation"
import { BlockPartialProps } from "./common/block"
import blocksProps from "./settings/blocks"

function getBlockPropsByType(blockType: string): BlockPartialProps {
    const blockProps = blocksProps.find(block => block.type === blockType)

    if (!blockProps) {
        throw new Error(`Not found block of type '${blockType}'`)
    }

    return blockProps
}

function getBiomeSettingsByType(biomeType: string): BiomeGenerationSettings {
    const biomeSettings = biomeGenerationSettings.find(biome => biome.type === biomeType)

    if (!biomeSettings) {
        throw new Error(`Unknown biome type "${biomeType}"`)
    }

    return biomeSettings
}

export {
    getBlockPropsByType,
    getBiomeSettingsByType
}