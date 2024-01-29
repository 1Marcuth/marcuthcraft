export type ExportFileOptions = {
    content: string
    fileName: string
    mediaType?: string
}

function exportFile({
    content,
    fileName,
    mediaType = "text/plain"
}: ExportFileOptions): void {
    const blob = new Blob([ content ], { type: mediaType })
    const url = URL.createObjectURL(blob)
    const $a = document.createElement("a")

    $a.href = url
    $a.download = fileName
    $a.click()
    $a.remove()

    URL.revokeObjectURL(url)
}

export default exportFile