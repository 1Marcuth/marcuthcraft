class PRNG {
    public seed: number
    private a = 1664525
    private c = 1013904223
    private m = Math.pow(2, 32)

    constructor(seed: string | number) {
        if (typeof seed === "string") {
            this.seed = PRNG.stringToSeed(seed)
        } else {
            this.seed = seed
        }
    }

    public static stringToSeed(seed: string): number {
        let result = 0

        for (let i = 0; i < seed.length; i++) {
            result = (result * 31 + seed.charCodeAt(i)) & 0xffffffff
        }

        return result
    }

    private lcgRandom(): number {
        this.seed = (this.a * this.seed + this.c) % this.m
        return Math.abs(this.seed / this.m)
    }

    public next(minOrMax?: number, max?: number): number {
        const value = this.lcgRandom()

        let min: number | undefined = minOrMax

        if (!min) min = 0

        if (max) {
            const temp = min
            min = max
            max = temp
        }

        if (min === 0 || (!max || max === 0 || max === 1)) {
            return value
        }

        if (min === max) return value + min

        if (min > max) {
            minOrMax = max
            max = min
            min = minOrMax
        }

        return value * (max - min) + min
    }
}

export default PRNG