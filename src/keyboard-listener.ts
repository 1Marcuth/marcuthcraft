export type ModifierKeys = {
    ctrl: boolean
    alt: boolean
    shift: boolean
    meta: boolean
}

type Observer = (keyPressed: string, modifierKeys: ModifierKeys) => any

class KeyboardListener {
    private observers: Observer[] = []
    private document: Document

    public constructor(document: Document) {
        this.document = document
        this.handleKeydown = this.handleKeydown.bind(this)
        document.addEventListener("keydown", this.handleKeydown)
    }

    private handleKeydown(event: KeyboardEvent) {
        const key = event.code

        const modifierKeys: ModifierKeys = {
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            meta: event.metaKey
        }

        this.notifyAll(key, modifierKeys)
    }

    public subscribe(observer: Observer) {
        this.observers.push(observer)
    }

    private notifyAll(keyPressed: string, modifierKeys: ModifierKeys) {
        for (const observer of this.observers) {
            observer(keyPressed, modifierKeys)
        }
    }

    public destroy() {
        this.document.removeEventListener("keydown", this.handleKeydown)
    }
}

export default KeyboardListener