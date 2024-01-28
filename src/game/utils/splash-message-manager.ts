export type SplashMessagesProps = {
    messages: string[]
    intervalTime: number
}

type SetInterval = Omit<typeof setInterval, "__promisify__"> & NodeJS.Timeout

class SplashMessageManager {
    public props: SplashMessagesProps
    private currentInterval?: SetInterval
    private currentMessage?: string

    public constructor(props: SplashMessagesProps) {
        this.props = props
    }

    private getRandomMessageIndex() {
        const randomMessageIndex = Math.floor(Math.random() * this.props.messages.length)
        return randomMessageIndex
    }

    private chooseANewMessage() {
        let newMessage = ""

        while (!newMessage) {
            const newMessageIndex = this.getRandomMessageIndex()
            if (this.currentMessage !== this.props.messages[newMessageIndex]) {
                newMessage = this.props.messages[newMessageIndex]
            }
        }

        this.currentMessage = newMessage
    }

    public getCurrentMessage(): string {
        return this.currentMessage!
    }

    public start() {
        if (this.currentInterval) return
        this.currentInterval = setInterval(this.chooseANewMessage.bind(this), this.props.intervalTime)
        this.chooseANewMessage()
    }

    public stop() {
        if (this.currentInterval) {
            clearInterval(this.currentInterval)
        }
    }
}

export default SplashMessageManager