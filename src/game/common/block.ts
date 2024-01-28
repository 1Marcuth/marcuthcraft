import isNumber from "../../utils/is-number"

type Clipping = {
    x: number,
    y: number,
    width: number
    height: number 
}

type Resistance = number | "infinite"

export type BlockProps = {
    name: string
    type: string
    isSolid: boolean
    isLiquid?: boolean
    isLightSource?: boolean
    isInteractive?: boolean
    isLiquidSource?: boolean
    liquidSourceBlock?: Block
    dischargeLevel?: number
    destroyed: boolean
    clipping?: Clipping
    resistance?: Resistance
    currentResistance?: Resistance
    idealToolType?: string
    lowerBlockType?: string
    lightingLevel?: number
}

export type BlockPartialProps = Omit<BlockProps, "currentResistance" | "destroyed">

enum BlockEvents {
    destroyed,
    placed
}

type Coordinates = {
    x: number
    y: number
}

type BlockEventType = keyof typeof BlockEvents

type Observer = (eventType: string, ...args: any[]) => any

class Block {
    public props: BlockProps
    private observers: Observer[] = []

    public constructor(props: BlockPartialProps) {
        this.props = {
            ...props,
            currentResistance: props.resistance,
            destroyed: false
        }
    }

    public resetResistance() {
        this.props.currentResistance = this.props.resistance
    }

    public decreaseResistancePoints(points: number) {
        const resistance = this.props.resistance
        const currentResistance = this.props.currentResistance as any
        const blockIsDestructive = isNumber(resistance) && isNumber(currentResistance)

        if (blockIsDestructive) {
            const finalDecreasePoints = Math.max(points, 0)
            this.props.currentResistance = currentResistance - finalDecreasePoints

            if (currentResistance <= 0) {
                this.destroy()
            }
        }
    }

    public place(coordinates: Coordinates) {
        this.notifyAll("placed", coordinates)
    }

    public destroy() {
        this.props.currentResistance = 0
        this.props.destroyed = true
        this.notifyAll("destroyed")
    }

    public subscribe(observer: Observer) {
        this.observers.push(observer)
    }

    private notifyAll(eventType: BlockEventType, ...args: any[]) {
        for (const observer of this.observers) {
            observer(eventType, ...args)
        }
    }
}

export default Block