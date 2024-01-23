import { FC, useEffect, useState } from "react"

import ResourceLoader, { Resource } from "../../game/resource-loader"
import { wait } from "@testing-library/user-event/dist/utils"
import Player, { getPlayerAction } from "../../game/player"
import KeyboardListener from "../../keyboard-listener"
import GameScreen from "../../components/game-screen"
import { screenSize } from "../../game-config"
import renderGame from "../../game/render"
import Game from "../../game"

import spritesSource from "../../assets/img/sprites.png"

const soundtrackSource = require("../../assets/aud/soundtrack.mp3") as string

///import styles from "./style.module.scss"

const HomePage: FC = () => {
    const [ currentSoundtrack, setCurrentSoundtrack ] = useState<HTMLAudioElement | null>(null)
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement | null>(null)

    function handleGameScreenReady(canvas: HTMLCanvasElement) {
        setCanvas(canvas)
    }

    function handleKeyPressed(keyPressed: string, player: Player) {
        const playerAction = getPlayerAction(keyPressed, player)

        if (playerAction) {
            playerAction()
        }
    }

    useEffect(() => {
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

        const player = new Player({ skin: new Image() })
        const game = new Game({ player: player })

        const keyboardListener = new KeyboardListener(document)
        const resourceLoader = new ResourceLoader({ resources: [
            {
                name: spritesSource,
                loadEventName: "load",
                resourceObject: new Image(),
                source: spritesSource
            },
            {
                name: soundtrackSource,
                loadEventName: "loadeddata",
                resourceObject: new Audio(),
                source: soundtrackSource
            }
        ] })

        resourceLoader.subscribe(async (event, ...args) => {
            if (event === "loadedResource") {
                const resource: Resource = args[0]

                if (resource.name === soundtrackSource) {
                    const soundtrack = resource.resourceObject
                    setCurrentSoundtrack(soundtrack)
                    await playSoundtrack(soundtrack)

                } else if (resource.name === spritesSource) {
                    if (!canvas) return

                    const sourceImage = resource.resourceObject

                    player.subscribe((eventType) => console.log(eventType))
                    keyboardListener.subscribe((keyPressed) => handleKeyPressed(keyPressed, player))

                    renderGame(game, canvas, sourceImage, requestAnimationFrame)
                }
            }
        })

        resourceLoader.load()

        return () => {
            keyboardListener.destroy()
            resourceLoader.destroy();
        }
    }, [canvas])

    return (
        <>
            <GameScreen size={screenSize} onReady={handleGameScreenReady}/>
        </>
    )
}

export default HomePage