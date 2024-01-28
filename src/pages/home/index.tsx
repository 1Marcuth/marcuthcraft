import { FC, useEffect, useState } from "react"

import {
    autoplaySoundtrack,
    screenSize,
    soundtrackVolume,
    splashMessageIntervalTime,
    splashMessages,
    worldFileExtension,
    worldGenerationStageNames
} from "../../game/settings/index"

import { worldGenerationStepsCount } from "../../game/core/world-generator"
import ResourceLoader, { Resource } from "../../game/utils/resource-loader"
import SplashMessageManager from "../../game/utils/splash-message-manager"
import KeyboardListener, { ModifierKeys } from "../../keyboard-listener"
import GameRender, { GameRenderNewProps } from "../../game/utils/render"
import Player, { getPlayerAction } from "../../game/common/player"
import { wait } from "@testing-library/user-event/dist/utils"
import GameScreen from "../../components/game-screen"
import resources from "../../game/resources"
import World from "../../game/common/world"
import Game from "../../game"

import styles from "./style.module.scss"
import importFile from "../../utils/import-file"

const HomePage: FC = () => {
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement | null>(null)

    function handleGameScreenReady(canvas: HTMLCanvasElement) {
        setCanvas(canvas)
    }

    useEffect(() => {
        if (!canvas) return

        const loadedResources: Resource[] = []

        const worldGenerationProgress = {
            totalStages: worldGenerationStepsCount,
            currentStageName: "Não Iniciado",
            stagesCompleted: 0
        }

        async function handleWorldFileChange(event: Event): Promise<void> {
            const fileInput = event.target as HTMLInputElement
            if (!fileInput || !fileInput.files) return
            const worldFile = fileInput.files[0]
            game.props.world = new World({})
            await game.props.world.import(worldFile)
            gameRender.setProps({ currentScreen: "world" })
        }

        async function handleKeyPressed(
            keyPressed: string,
            modifierKeys: ModifierKeys,
            player: Player,
            currentScreen?: string
        ): Promise<void> {
            if (modifierKeys.ctrl && keyPressed === "KeyE") {
                if (game.props.world) {
                    game.props.world.export(`meu_mundo${worldFileExtension}`)
                } else {
                    alert("Nenhum mundo foi encontrado!")
                }
            }

            if (modifierKeys.ctrl && keyPressed === "KeyI") {
                const worldFile = await importFile({ acceptedExtensions: [ worldFileExtension ] })
                game.props.world = new World({})
                await game.props.world.import(worldFile)
                gameRender.setProps({ currentScreen: "world" })
            }

            if (currentScreen === "world") {
                const playerAction = getPlayerAction(keyPressed, player)
    
                if (playerAction) {
                    playerAction()
                }
            }
        }

        async function playSoundtrack(soundtrack: HTMLAudioElement): Promise<any> {
            try {
                soundtrack.loop = true
                soundtrack.volume = soundtrackVolume
                await soundtrack.play()
            } catch(error) {
                await wait(1000)
                return await playSoundtrack(soundtrack)
            }
        }

        function handleGameRenderEvents(event: string, ...args: any[]): void {
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
        }

        async function handleGameEvents(sender: string, event: string, ...args: any[]): Promise<void> {
            if (sender === "WorldGenerator") {
                if (event === "startedGeneration") {
                    worldGenerationProgress.stagesCompleted = 0
                    worldGenerationProgress.totalStages = worldGenerationStepsCount
                    worldGenerationProgress.currentStageName = "Gerando Chunks..."
                } else if (event === "finishedGeneration") {
                    worldGenerationProgress.currentStageName = "Pronto!"
                    await wait(600)
                    gameRender.setProps({ currentScreen: "world" })
                } else {
                    const stageName = worldGenerationStageNames[worldGenerationProgress.stagesCompleted] || "Gerando Terreno..."
                    worldGenerationProgress.stagesCompleted++
                    worldGenerationProgress.currentStageName = stageName
                }
            }
        }

        async function handleResourceLoaderEvents(event: string, ...args: any[]): Promise<void> {
            if (event === "loadedResource") {
                const resource: Resource = args[0]

                loadedResources.push(resource)

                if (resource.key === "music1" && autoplaySoundtrack) {
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

                keyboardListener.subscribe((keyPressed, modifierKeys) => handleKeyPressed(
                    keyPressed,
                    modifierKeys,
                    player,
                    gameRender.props.currentScreen
                ))
            }
        }

        const player = new Player({ skin: new Image() })
        const game = new Game({ player: player })
        const resourceLoader = new ResourceLoader({ resources: resources })
        const keyboardListener = new KeyboardListener(document)

        const splashMessageManager = new SplashMessageManager({
            messages: splashMessages,
            intervalTime: splashMessageIntervalTime
        })

        const gameContext = {
            splashMessageManager: splashMessageManager,
            worldGenerationProgress: worldGenerationProgress,
            loadedResources: loadedResources,
            amountOfResources: resourceLoader.props.resources.length
        }

        const gameRender = new GameRender({
            $canvas: canvas,
            game: game,
            gameContext: gameContext,
            images: {},
            requestAnimationFrame: requestAnimationFrame
        })

        game.subscribe(handleGameEvents)
        gameRender.subscribe(handleGameRenderEvents)
        resourceLoader.subscribe(handleResourceLoaderEvents)

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