export type CreateImageOptions = {
    source: string
}

function createImage(options: CreateImageOptions): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()

        image.src = options.source

        image.onload = () => resolve(image)
        
        image.onerror = (error) => reject(
            new Error(`Failed to load image at ${options.source}: ${error}`)
        )
    })
}

export default createImage