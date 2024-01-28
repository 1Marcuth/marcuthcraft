type OnLoaded = (event: any) => any

export type Resource = {
    key: string
    loadEventName?: string
    resourceObject: any
    onLoaded?: OnLoaded
    source: string
}

type EventListenerToDestroy = {
    element: HTMLElement
    eventName: string
    callback: EventListener
}

export type ResourceLoaderProps = {
    resources: Resource[]
    loadedCount: number
    elementsToDestroy: HTMLElement[]
    eventListenersToDestroy: EventListenerToDestroy[]
}

enum ResourceLoaderEvents {
    loadedResource,
    loadedAllResources
}

type ResourceLoaderEventType = keyof typeof ResourceLoaderEvents

type Observer = (eventType: ResourceLoaderEventType, ...args: any[]) => any

type ResourceLoaderPartialProps = Omit<ResourceLoaderProps, "elementsToDestroy" | "eventListenersToDestroy" | "loadedCount">

type LoadResourceCallback = () => any

export type PartialResource = {
    source: string
    resourceObject: any
    key: string
}

function loadResource(resource: Resource, loader: ResourceLoader, callback: LoadResourceCallback): void {
    resource.resourceObject.src = resource.source

    function eventListener(event: any) {
        callback()

        if (resource.onLoaded) {
            resource.onLoaded(event)
        }
    }

    if (!resource.loadEventName) resource.loadEventName = "load"

    resource.resourceObject.addEventListener(resource.loadEventName, eventListener)
    loader.addToDestroyList(resource.resourceObject, resource.loadEventName, eventListener)
}

class ResourceLoader {
    public props: ResourceLoaderProps
    private observers: Observer[] = []

    public constructor(props: ResourceLoaderPartialProps) {
        this.props = {
            ...props,
            loadedCount: 0,
            elementsToDestroy: [],
            eventListenersToDestroy: []
        }
    }

    public incrementLoadedCount() {
        this.props.loadedCount++
    }

    public load(): void {
        for (const resource of this.props.resources) {
            loadResource(resource, this, () => {
                this.incrementLoadedCount()
                this.notifyAll("loadedResource", resource)

                if (this.props.loadedCount === this.props.resources.length) {
                    const partialResources: PartialResource[] = this.props.resources.map(resource => {
                        const partialResource = {
                            source: resource.source,
                            resourceObject: resource.resourceObject,
                            key: resource.key
                        }

                        return partialResource
                    })

                    this.notifyAll("loadedAllResources", partialResources)
                }
            })
        }
    }

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    private notifyAll(eventType: ResourceLoaderEventType, ...args: any[]): void {
        for (const observer of this.observers) {
            observer(eventType, ...args)
        }
    }

    public addToDestroyList(element: HTMLElement, eventName: string, callback: EventListener): void {
        this.props.elementsToDestroy.push(element)
        this.props.eventListenersToDestroy.push({ element, eventName, callback })
    }

    public destroy(): void {
        for (const { element, eventName, callback } of this.props.eventListenersToDestroy) {
            element.removeEventListener(eventName, callback)
        }

        for (const element of this.props.elementsToDestroy) {
            if (element instanceof HTMLAudioElement) {
                if (!element.paused) {
                    element.pause()
                }
            }

            if (element.parentNode) {
                element.parentNode.removeChild(element)
            }
        }

        this.props.eventListenersToDestroy = []
        this.props.elementsToDestroy = []
    }
}

export default ResourceLoader