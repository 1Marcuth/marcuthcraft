import Perlin from "./perlin"

function generateNoiseForHeightMap(
    width: number,
    seed: number,
    scale: number,
    octaves: number,
    persistence: number,
    lacunarity: number
): number[] {
    let map: number[] = []

    if (scale <= 0) scale = 0.001

    for (let x = 0; x < width; x++) {
        let height = 0
        let frequency = 1
        let amplitude = 1
        
        for (let i = 0; i < octaves; i++) {
            const X = x / scale * frequency

            height += Perlin.noise(seed, X) * amplitude

            amplitude *= persistence
            frequency *= lacunarity
        }

        map[x] = height
    }

    return map
}

function generateNoiseForCaves(
    seed: number,
    width: number,
    height: number,
    scale: number, 
    octaves: number,
    persistence: number,
    lacunarity: number,
    smoothingIterations: number = 0
) {
    const noiseMap: number[][] = []

    for (let x = 0; x < width; x++) {
        noiseMap[x] = []

        for (let y = 0; y < height; y++) {
            let amplitude = 1
            let frequency = 1
            let noiseHeight = 0

            for (let octave = 0; octave < octaves; octave++) {
                const sampleX = x / scale * frequency
                const sampleY = y / scale * frequency

                const perlinValue = Perlin.noise(seed, sampleX, sampleY)
                //console.log(perlinValue)
                noiseHeight += perlinValue * amplitude

                amplitude *= persistence
                frequency *= lacunarity
            }

            noiseMap[x][y] = noiseHeight
        }
    }

    for (let i = 0; i < smoothingIterations; i++) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let total = 0
                let count = 0

                for (let offsetX = -1; offsetX <= 1; offsetX++) {
                    for (let offsetY = -1; offsetY <= 1; offsetY++) {
                        const newX = x + offsetX
                        const newY = y + offsetY

                        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                            total += noiseMap[newX][newY]
                            count++
                        }
                    }
                }

                noiseMap[x][y] = total / count
            }
        }
    }

    return noiseMap
}
export {
    generateNoiseForHeightMap,
    generateNoiseForCaves
}