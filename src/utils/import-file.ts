export type ImportFileOptions = {
    acceptedExtensions: string[]
}

function importFile({ acceptedExtensions }: ImportFileOptions): Promise<File> {
    const $fileInput = document.createElement("input")
    
    $fileInput.type = "file"
    $fileInput.accept = acceptedExtensions.join(",")
    $fileInput.click()

    return new Promise((resolve, reject) => {
        $fileInput.addEventListener("change", () => {
            if (!$fileInput.files) return reject("No files received!")
            const worldFile = $fileInput.files[0]
            $fileInput.remove()
            return resolve(worldFile)
        })
    })
}

export default importFile