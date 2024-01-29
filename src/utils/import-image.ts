import fileToDataUrl from "./file-to-data-url"
import createImage from "./create-image"
import importFile from "./import-file"

type Size = {
    width: number
    height: number
}

export type ImportImageOptions = {
    minSize?: Size
    maxSize?: Size
}

async function importImage({
    minSize,
    maxSize
}: ImportImageOptions): Promise<HTMLImageElement> {
    const file = await importFile({ acceptedExtensions: [ "image/*"] })
    const fileDataUrl = await fileToDataUrl({ file: file })
    const image = await createImage({ source: fileDataUrl })

    if (minSize) {
        if (image.width < minSize.width || image.height < minSize.height) {
            throw new Error(`The selected image is too small. The minimum size allowed is ${minSize.width}x${minSize.height}.`)
        }
    }

    if (maxSize) {
        if (image.width > maxSize.width || image.height > maxSize.height) {
            throw new Error(`The selected image is too large. The maximum size allowed is ${maxSize.width}x${maxSize.height}`)
        }
    }

    return image
}

export default importImage