type Observer = (keyPressed: string) => any

class KeyboardListener {
    private observers: Observer[] = []
    private document: Document

    public constructor(document: Document) {
        this.document = document

        document.addEventListener("keydown", this.handleKeydown.bind(this))
    }

    private handleKeydown(event: KeyboardEvent) {
        const key = event.code
        this.notifyAll(key)
    }

    public subscribe(observer: Observer) {
        this.observers.push(observer)
    }

    private notifyAll(keyPressed: string) {
        for (const observer of this.observers) {
            observer(keyPressed)
        }
    }

    public destroy() {
        this.document.removeEventListener("keydown", this.handleKeydown)
    }
}

export default KeyboardListener