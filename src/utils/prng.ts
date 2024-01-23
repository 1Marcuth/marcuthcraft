class PRNG {
    public seed: number

    constructor(seed: string | number) {
        if (typeof seed === "string") {
            this.seed = this.stringToSeed(seed)
        } else {
            this.seed = seed
        }
    }

    private stringToSeed(seed: string): number {
        let result = 0

        for (let i = 0; i < seed.length; i++) {
            result = (result * 31 + seed.charCodeAt(i)) & 0xffffffff
        }

        return result
    }

    private lcgRandom(): number {
        const a = 1664525
        const c = 1013904223
        const m = Math.pow(2, 32)

        this.seed = (a * this.seed + c) % m

        return Math.abs(this.seed / m)
    }

    public next(): number {
        return this.lcgRandom()
    }
}

export default PRNG