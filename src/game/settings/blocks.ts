import { BlockPartialProps } from "../common/block"
import { BlockTypes } from "../settings/enum-types"

const blocksProps: BlockPartialProps[] = [
    {
        name: "Bloco de Terra",
        type: BlockTypes.DIRT,
        isSolid: true,
        resistance: 500,
        clipping: {
            x: 0,
            y: 0,
            width: 16,
            height: 16
        }
    },
    {
        name: "Bloco de Grama",
        type: BlockTypes.GRASS,
        isSolid: true,
        resistance: 500,
        clipping: {
            x: 16,
            y: 0,
            width: 16,
            height: 16
        }
    },
    {
        name: "Pedra",
        type: BlockTypes.STONE,
        isSolid: true,
        resistance: 1500,
        clipping: {
            x: 32,
            y: 0,
            width: 16,
            height: 16
        }
    },
    {
        name: "Minério de Carvão",
        type: BlockTypes.COAL_ORE,
        isSolid: true,
        resistance: 3000,
        clipping: {
            x: 32,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Minério de Ferro",
        type: BlockTypes.IRON_ORE,
        isSolid: true,
        resistance: 3000,
        clipping: {
            x: 48,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Minério de Ouro",
        type: BlockTypes.GOLD_ORE,
        isSolid: true,
        resistance: 3000,
        clipping: {
            x: 32,
            y: 32,
            width: 16,
            height: 16
        }
    },
    {
        name: "Minério de Diamante",
        type: BlockTypes.DIAMOND_ORE,
        isSolid: true,
        resistance: 3000,
        clipping: {
            x: 48,
            y: 32,
            width: 16,
            height: 16
        }
    },
    {
        name: "Rocha-mãe",
        type: BlockTypes.BEDROCK,
        isSolid: true,
        resistance: "infinite",
        clipping: {
            x: 48,
            y: 0,
            width: 16,
            height: 16
        }
    },
    {
        name: "Tronco de Carvalho",
        type: BlockTypes.OAK_TRUNK,
        isSolid: true,
        clipping: {
            x: 64,
            y: 0,
            width: 16,
            height: 16
        }
    },
    {
        name: "Folha de Carvalho",
        type: BlockTypes.OAK_LEAF,
        isSolid: true,
        clipping: {
            x: 64,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Água",
        type: BlockTypes.WATER,
        isSolid: false,
        isLiquid: true,
        clipping: {
            x: 0,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Lava",
        type: BlockTypes.LAVA,
        isSolid: false,
        isLiquid: true,
        clipping: {
            x: 16,
            y: 16,
            width: 16,
            height: 16
        }
    },
    {
        name: "Ar",
        type: BlockTypes.AIR,
        isSolid: false
    }
]

export default blocksProps