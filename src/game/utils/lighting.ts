type Position = {
    x: number
    y: number
}

type LightSource = {
    position: Position
    intensity: number
}

export type CalculateLightIntensityAtPointOptions = {
    point: Position
    lightSources: LightSource[]
}

function calculateLightIntensityAtPoint({
    point,
    lightSources
}: CalculateLightIntensityAtPointOptions): number {
    let totalIntensity = 0

    for (const source of lightSources) {
        const distanceSquared = (point.x - source.position.x) ** 2 + (point.y - source.position.y) ** 2
        const intensity = source.intensity / distanceSquared
        totalIntensity += intensity
    }

    return totalIntensity
}

export { calculateLightIntensityAtPoint }