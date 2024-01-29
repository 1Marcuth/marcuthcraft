export type FileToDataUrlOptions = {
    file: File
}

type Event = ProgressEvent<FileReader>
type Resolve = (value: string | PromiseLike<string>) => void
type Reject = (reason?: any) => void

type HandleFileReaderLoadOptions = {
    event: Event
    resolve: Resolve
    reject: Reject
}

function handleFileReaderLoad({
    event,
    resolve,
    reject
}: HandleFileReaderLoadOptions) {
    const target = event.target

    if (!target) {
        return reject(
            new Error("Not found target of event: " + JSON.stringify(event))
        )
    }

    const data = event.target.result

    if (!data) {
        return reject(
            new Error("Not found data of event: " + JSON.stringify(event))
        )
    }

    return resolve(data as string)
}

function fileToDataUrl({ file }: FileToDataUrlOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onerror = reject

        reader.onload = (event) => handleFileReaderLoad({
            event: event,
            resolve: resolve,
            reject: reject
        })

        reader.readAsDataURL(file)
    })
}

export default fileToDataUrl