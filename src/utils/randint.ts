function randInt(min: number, max: number): number {
    const minInt = Math.floor(min)
    const maxInt = Math.floor(max)
    const numberDifference = maxInt - minInt
    
    const randomInt = Math.floor(
        Math.random() * (numberDifference + 1)
    ) + minInt

    return randomInt
}

export default randInt