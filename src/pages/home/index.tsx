import { FC, useEffect, useState } from "react"

import { screenSize, splashMessageIntervalTime, splashMessages } from "../../game-config"
import ResourceLoader, { Resource } from "../../game/resource-loader"
import SplashMessageManager from "../../game/splash-message-manager"
import GameRender, { GameRenderNewProps } from "../../game/render"
import { wait } from "@testing-library/user-event/dist/utils"
import Player, { getPlayerAction } from "../../game/player"
import KeyboardListener from "../../keyboard-listener"
import GameScreen from "../../components/game-screen"
import Game from "../../game"

import styles from "./style.module.scss"
import { worldGenerationStepsCount } from "../../game/world-generator"

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

        const worldGenerationProgress = {
            totalStages: worldGenerationStepsCount,
            currentStageName: "Não Iniciado",
            stagesCompleted: 0
        }

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

        const keyboardListener = new KeyboardListener(document)

        const game = new Game({
            player: player,
            worldGenerationProgress: worldGenerationProgress,
        })

        const resourceLoader = new ResourceLoader({ resources: [
            {
                resourceObject: new Image(),
                source: require("../../assets/img/logo-intro.png"),
                key: "logoIntro"
            },
            {
                resourceObject: new Image(),
                source: require("../../assets/img/sprites.png"),
                key: "textureSprites"
            },
            {
                loadEventName: "loadeddata",
                resourceObject: new Audio(),
                source: require("../../assets/aud/soundtrack.mp3"),
                key: "music1"
            },
            {
                resourceObject: playerSkin,
                source: require("../../assets/img/skins/steve.png"),
                key: "playerSkin"
            },
            {
                resourceObject: new Image(),
                source: require("../../assets/img/logo.png"),
                key: "logo"
            },
            {
                resourceObject: new Image(),
                source: require("../../assets/img/main-menu-background-layers/2.png"),
                key: "backgroundLayerTwo"
            },
            {
                resourceObject: new Image(),
                source: require("../../assets/img/widgets.png"),
                key: "widgets"
            },
            {
                resourceObject: new Image(),
                source: require("../../assets/img/main-menu-background-layers/blur.png"),
                key: "backgroundBlur"
            },
            {
                resourceObject: new Image(),
                source: require("../../assets/img/options-background.png"),
                key: "optionsBackground"
            }
        ] })

        const splashMessageManager = new SplashMessageManager({
            messages: splashMessages,
            intervalTime: splashMessageIntervalTime
        })

        const gameContext = {
            splashMessageManager: splashMessageManager,
            getWorldGenerationProgress: () => worldGenerationProgress,
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

                if (resource.key === "music1") {
                    const soundtrack = resource.resourceObject
                    await playSoundtrack(soundtrack)
                } else if (resource.resourceObject instanceof HTMLImageElement) {
                    const newProps: GameRenderNewProps = {
                        images: {
                            ...gameRender.props.images,
                            [resource.key]: resource.resourceObject
                        }
                    }

                    if (resource.key === "logoIntro") newProps.currentScreen = "intro"

                    gameRender.setProps(newProps)
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

        game.subscribe(async (sender, event, ...args) => {
            if (sender === "WorldGenerator") {
                if (event === "startedGeneration") {
                    worldGenerationProgress.stagesCompleted = 0
                    worldGenerationProgress.totalStages = worldGenerationStepsCount
                    worldGenerationProgress.currentStageName = "Gerando Chunks..."
                    await wait(300)
                } else if (event === "finishedGeneration") {
                    worldGenerationProgress.currentStageName = "Pronto!"
                    await wait(600)
                    gameRender.setProps({ currentScreen: "world" })
                } else {
                    const stageNames: { [key: number]: string } = {
                        1: "Gerando Chunks"
                    }

                    const stageName = stageNames[worldGenerationProgress.stagesCompleted] || "Gerando Terreno..."

                    worldGenerationProgress.stagesCompleted++
                    worldGenerationProgress.currentStageName = stageName
                }
            }
        })

        gameRender.subscribe((event, ...args) => {
            if (event === "widgetClick") {
                const buttonKey = args[0]

                switch (buttonKey) {
                    case "mainMenu.singlePlayerButton":
                        gameRender.setProps({ currentScreen: "generatingWorld" })
                        game.createWorld(game.props.player)
                        break
                    
                    case "mainMenu.CreditsButton":
                        break

                    case "mainMenu.OptionsButton":
                        break

                    default:
                        throw new Error(`Not found button key: ${buttonKey}`)
                }
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