import { FC, useEffect, useState } from "react"

import KeyboardListener from "../../keyboard-listener"
import GameScreen from "../../components/game-screen"
import Player, { getPlayerAction } from "../../game/player"
import { screenSize } from "../../game-config"
import renderGame from "../../game/render"
import Game from "../../game"

import spritesSource from "../../assets/img/sprites.png"
const soundtrackSource = require("../../assets/aud/soundtrack.mp3") as string

///import styles from "./style.module.scss"

const HomePage: FC = () => {
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement | null>(null)
 
    function handleGameScreenReady(canvas: HTMLCanvasElement) {
        setCanvas(canvas)
    }

    useEffect(() => {
        const player = new Player({ skin: new Image() })
        const game = new Game({ player: player })

        const keyboardListener = new KeyboardListener(document)
        const sourceImage = new Image()
        const soundtrack = new Audio()

        sourceImage.src = spritesSource
        soundtrack.src = soundtrackSource

        async function handleSoundtrackLoad() {
            try {
                soundtrack.loop = true
                soundtrack.volume = .3
                //await soundtrack.play()
            } catch(error) {
                setTimeout(() => {
                    console.log("tentando de novo")
                    handleSoundtrackLoad()
                }, 1000)
            }
        }

        function handleImagesLoad() {
            if (!canvas) return

            player.subscribe((eventType) => {
                console.log(eventType)
            })
    
            function handleKeyPressed(keyPressed: string) {
                const playerAction = getPlayerAction(keyPressed, player)
    
                if (playerAction) {
                    playerAction()
                }
            }
    
            keyboardListener.subscribe(handleKeyPressed)

            renderGame(game, canvas, sourceImage, requestAnimationFrame)
        }

        sourceImage.addEventListener("load", handleImagesLoad) 
        soundtrack.addEventListener("loadeddata", handleSoundtrackLoad)

        return () => {
            keyboardListener.destroy()
            sourceImage.removeEventListener("load", handleImagesLoad)
            soundtrack.removeEventListener("loadeddata", handleSoundtrackLoad)
            soundtrack.pause()
        }
    }, [canvas])

    return (
        <>
            <GameScreen size={screenSize} onReady={handleGameScreenReady}/>
        </>
    )
}

export default HomePage