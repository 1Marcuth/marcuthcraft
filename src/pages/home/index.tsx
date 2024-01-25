import { FC, useEffect, useState } from "react"

import ResourceLoader, { Resource } from "../../game/resource-loader"
import { wait } from "@testing-library/user-event/dist/utils"
import Player, { getPlayerAction } from "../../game/player"
import KeyboardListener from "../../keyboard-listener"
import GameScreen from "../../components/game-screen"
import { screenSize, splashMessageIntervalTime, splashMessages } from "../../game-config"
import GameRender from "../../game/render"
import Game from "../../game"

import styles from "./style.module.scss"
import SplashMessageManager from "../../game/splash-message-manager"

const mainMenuBackgroundLayerTwo = require("../../assets/img/main-menu-background-layers/2.png")
const mainMenuBackgroundBlur = require("../../assets/img/main-menu-background-layers/blur.png")
const soundtrackSource = require("../../assets/aud/soundtrack.mp3")
const steveSkinSource = require("../../assets/img/skins/steve.png")
const logoIntroSource = require("../../assets/img/logo-intro.png")
const textureSpritesSource = require("../../assets/img/sprites.png")
const widgetsSource = require("../../assets/img/widgets.png")
const logoSource = require("../../assets/img/logo.png")

const HomePage: FC = () => {
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement | null>(null)

    function handleGameScreenReady(canvas: HTMLCanvasElement) {
        setCanvas(canvas)
    }

    function handleKeyPressed(
        keyPressed: string, 
        player: Player,
        currentScreen?: string
    ) {
        if (currentScreen === "world") {
            const playerAction = getPlayerAction(keyPressed, player)

            if (playerAction) {
                playerAction()
            }
        }
    }

    useEffect(() => {
        if (!canvas) return

        const loadedResources: Resource[] = []

        async function playSoundtrack(soundtrack: HTMLAudioElement): Promise<any> {
            try {
                soundtrack.loop = true
                soundtrack.volume = .3
                await soundtrack.play()
            } catch(error) {
                await wait(1000)
                return await playSoundtrack(soundtrack)
            }
        }

        const playerSkin = new Image()
        const player = new Player({ skin: playerSkin })
        const game = new Game({ player: player })

        const keyboardListener = new KeyboardListener(document)

        const splashMessageManager = new SplashMessageManager({
            messages: splashMessages,
            intervalTime: splashMessageIntervalTime
        })

        const resourceLoader = new ResourceLoader({ resources: [
            {
                resourceObject: new Image(),
                source: logoIntroSource
            },
            {
                resourceObject: new Image(),
                source: textureSpritesSource
            },
            {
                loadEventName: "loadeddata",
                resourceObject: new Audio(),
                source: soundtrackSource
            },
            {
                resourceObject: playerSkin,
                source: steveSkinSource
            },
            {
                resourceObject: new Image(),
                source: logoSource
            },
            {
                resourceObject: new Image(),
                source: mainMenuBackgroundLayerTwo
            },
            {
                resourceObject: new Image(),
                source: widgetsSource
            },
            {
                resourceObject: new Image(),
                source: mainMenuBackgroundBlur
            }
        ] })

        const gameContext = {
            splashMessageManager: splashMessageManager,
            getLoadedResources: () => loadedResources,
            amountOfResources: resourceLoader.props.resources.length
        }

        const gameRender = new GameRender({
            $canvas: canvas,
            game: game,
            gameContext: gameContext,
            images: {},
            requestAnimationFrame: requestAnimationFrame
        })

        resourceLoader.subscribe(async (event, ...args) => {
            if (event === "loadedResource") {
                const resource: Resource = args[0]

                loadedResources.push(resource)

                if (resource.source === soundtrackSource) {
                    const soundtrack = resource.resourceObject
                    await playSoundtrack(soundtrack)
                } else if (resource.source === logoIntroSource) {
                    gameRender.setProps({
                        currentScreen: "intro",
                        images: {
                            ...gameRender.props.images,
                            logoIntro: resource.resourceObject as HTMLImageElement
                        }
                    })
                } else if (resource.source === logoSource) {
                    gameRender.setProps({
                        images: {
                            ...gameRender.props.images,
                            logo: resource.resourceObject as HTMLImageElement
                        }
                    })
                } else if (resource.source === textureSpritesSource) {
                    gameRender.setProps({
                        images: {
                            ...gameRender.props.images,
                            textureSprites: resource.resourceObject as HTMLImageElement
                        }
                    })
                } else if (resource.source === mainMenuBackgroundLayerTwo) {
                    gameRender.setProps({
                        images: {
                            ...gameRender.props.images,
                            backgroundLayerTwo: resource.resourceObject as HTMLImageElement
                        }
                    })
                } else if (resource.source === widgetsSource) {
                    gameRender.setProps({
                        images: {
                            ...gameRender.props.images,
                            widgets: resource.resourceObject as HTMLImageElement
                        }
                    })
                } else if (resource.source === mainMenuBackgroundBlur) {
                    gameRender.setProps({
                        images: {
                            ...gameRender.props.images,
                            backgroundBlur: resource.resourceObject as HTMLImageElement
                        }
                    })
                }

            } else if (event === "loadedAllResources") {
                await wait(600)

                gameRender.setProps({ currentScreen: "mainMenu" })

                splashMessageManager.start()

                player.subscribe((eventType) => console.log(eventType))

                keyboardListener.subscribe((keyPressed) => handleKeyPressed(
                    keyPressed,
                    player,
                    gameRender.props.currentScreen
                ))
            }
        })

        resourceLoader.load()
        gameRender.run()

        return () => {
            keyboardListener.destroy()
            resourceLoader.destroy()
        }
    }, [canvas])

    return (
        <div className={styles["container"]}>
            <GameScreen size={screenSize} onReady={handleGameScreenReady}/>
        </div>
    )
}

export default HomePage