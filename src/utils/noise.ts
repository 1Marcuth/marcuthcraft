import Perlin from "./perlin"

type GenerateHeightMapOptions = {
    seed: number
    width: number
    offset: number
    scale: number
    octaves: number
    persistence: number
    lacunarity: number
}


type GenerateCavesMapOptions = {
    seed: number
    width: number
    height: number
    threshold: number
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

    public static generateCavesMap({
        seed,
        width,
        height,
        threshold,
    }: GenerateCavesMapOptions): number[][] {
        const cavesMap: number[][] = []

        for (let x = 0; x < width; x++) {
            cavesMap[x] = []

            for (let y = 0; y < height; y++) {
                let noise = Perlin.noise(seed, x / 10, y / 10)
                cavesMap[x][y] = noise
            }
        }

        for (let i = 0; i < 1; i++) {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let total = 0
                    let count = 0
    
                    for (let offsetX = -1; offsetX <= 1; offsetX++) {
                        for (let offsetY = -1; offsetY <= 1; offsetY++) {
                            const newX = x + offsetX
                            const newY = y + offsetY
    
                            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                                total += cavesMap[newX][newY]
                                count++
                            }
                        }
                    }
    
                    cavesMap[x][y] = total / count
                }
            }
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                cavesMap[x][y] = cavesMap[x][y] < threshold ? 1 : 0
            }
        }

        return cavesMap
    }
}

export default Noise