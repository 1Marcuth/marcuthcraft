import Perlin from "./perlin"
import PRNG from "./prng"

export type GenerateHeightMapOptions = {
    seed: number
    width: number
    offset: number
    scale: number
    octaves: number
    persistence: number
    lacunarity: number
}

export type NoiseGenerator2DProps = {
    seed: number
    width: number
    height: number
    density: number
    iterations: number
}

type NoiseMap2D = number[][]

export type GenerateOreMapOptions = {
    seed: number
    width: number
    height: number
    density: number
    iterations: number
}

class NoiseGenerator2D {
    public props: NoiseGenerator2DProps
    private prng: PRNG

    private constructor(props: NoiseGenerator2DProps) {
        this.props = props
        this.prng = new PRNG(this.props.seed)
    }

    public static generate(props: NoiseGenerator2DProps): NoiseMap2D {
        const generator = new NoiseGenerator2D(props)
        const { iterations } = generator.props

        const noiseMap2D = generator.generateInitialMap()

        for (let i = 0; i < iterations; i++) {
            generator.iterateMap(noiseMap2D)
        }

        return noiseMap2D
    }

    private generateInitialMap(): NoiseMap2D {
        const { width, height, density } = this.props
        const noiseMap2D: NoiseMap2D = []

        for (let x = 0; x < width; x++) {
            noiseMap2D[x] = []

            for (let y = 0; y < height; y++) {
                noiseMap2D[x][y] = this.prng.next() < density ? 1 : 0
            }
        }

        return noiseMap2D
    }

    private iterateMap(noiseMap2D: NoiseMap2D): void {
        const { width, height } = this.props

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const wallCount = this.getNeighborsWalls(noiseMap2D, x, y)
                noiseMap2D[x][y] = wallCount > 4 ? 1 : 0
            }
        }
    }

    private getNeighborsWalls(cavesMap: NoiseMap2D, x: number, y: number) {
        const { width, height } = this.props
        let wallCount = 0

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i !== x || j !== y) {
                    if (x + i < 0 || y + j < 0 || x + i >= width || y + j >= height) {
                        wallCount++
                    } else {
                        wallCount += cavesMap[x + i][y + j] ? 1 : 0
                    }
                }
            }
        }

        return wallCount
    }
}
class Noise {
    public static generateHeightMap({
        seed,
        width,
        offset,
        scale,
        octaves,
        persistence,
        lacunarity
    }: GenerateHeightMapOptions): number[] {
        const hightMap: number[] = []

        if (scale <= 0) scale = 0.001

        for (let x = 0; x < width; x++) {
            let height = 0
            let frequency = 1
            let amplitude = 1

            for (let i = 0; i < octaves; i++) {
                const y = (x + offset) / scale * frequency
                height += Perlin.noise(seed, y) * amplitude
                amplitude *= persistence
                frequency *= lacunarity
            }

            hightMap[x] = height
        }

        return hightMap
    }

    public static generateCavesMap(props: NoiseGenerator2DProps): NoiseMap2D {
        return NoiseGenerator2D.generate(props)
    }

    public static generateOresMap(props: NoiseGenerator2DProps): NoiseMap2D {
        return NoiseGenerator2D.generate(props)
    }
}

export default Noise