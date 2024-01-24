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
                let noise = Perlin.noise(seed, x / 10, y / 10);
                cavesMap[x][y] = noise
            }
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                cavesMap[x][y] = cavesMap[x][y] < threshold ? 0 : 1;
            }
        }

        return cavesMap;
    }
}

export default Noise