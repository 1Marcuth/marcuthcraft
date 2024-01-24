import { FC, useEffect, useState } from "react"

import ResourceLoader, { PartialResource, Resource } from "../../game/resource-loader"
import { wait } from "@testing-library/user-event/dist/utils"
import Player, { getPlayerAction } from "../../game/player"
import KeyboardListener from "../../keyboard-listener"
import GameScreen from "../../components/game-screen"
import { screenSize } from "../../game-config"
import renderGame from "../../game/render"
import Game from "../../game"

const soundtrackSource = require("../../assets/aud/soundtrack.mp3")
const steveSkinSource = require("../../assets/img/skins/steve.png")
const logoIntroSource = require("../../assets/img/logo-intro.png")
const spritesSource = require("../../assets/img/sprites.png")
const logoSource = require("../../assets/img/logo.png")

///import styles from "./style.module.scss"

const HomePage: FC = () => {
    const [ loadedResources, setLoadedResources ] = useState<Resource[]>([])
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
                //await soundtrack.play()
            } catch(error) {
                await wait(1000)
                return await playSoundtrack(soundtrack)
            }
        }

        const playerSkin = new Image()
        const player = new Player({ skin: playerSkin })
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
            },
            {
                name: steveSkinSource,
                loadEventName: "load",
                resourceObject: playerSkin,
                source: steveSkinSource
            },
            {
                name: logoIntroSource,
                loadEventName: "load",
                resourceObject: new Image(),
                source: logoIntroSource
            },
            {
                name: logoSource,
                loadEventName: "load",
                resourceObject: new Image(),
                source: logoSource
            },
        ] })

        resourceLoader.subscribe(async (event, ...args) => {
            if (event === "loadedResource") {
                const resource: Resource = args[0]

                setLoadedResources(prevLoadedResources => [...prevLoadedResources, resource])

                if (resource.name === soundtrackSource) {
                    const soundtrack = resource.resourceObject
                    await playSoundtrack(soundtrack)
                }

            } else if (event === "loadedAllResources") {
                const resources: PartialResource[] = args[0]
                const resource = resources.find(resource => resource.name === spritesSource)

                if (!canvas || !resource) return

                const sourceImage = resource.resourceObject

                player.subscribe((eventType) => console.log(eventType))
                keyboardListener.subscribe((keyPressed) => handleKeyPressed(keyPressed, player))

                renderGame(game, canvas, sourceImage, requestAnimationFrame)
            }
        })

        resourceLoader.load()

        return () => {
            keyboardListener.destroy()
            resourceLoader.destroy()
        }
    }, [canvas])

    return (
        <>
            <h1 style={{ textAlign: "center", marginBottom: "1rem", marginTop: "1rem" }}>MarcuthCraft</h1>
            <GameScreen size={screenSize} onReady={handleGameScreenReady}/>
            <ul>
                {loadedResources.map(loadedResource => {
                    const maxLength = 30

                    const slicedResourceName = (loadedResource.name.length > maxLength ?
                        loadedResource.name.slice(0, maxLength) + "..." :
                        loadedResource.name
                    )

                    return (
                        <li key={Math.random()}><b>[Loaded Resource]:</b> {slicedResourceName}</li>
                    )
                })}
            </ul>
        </>
    )
}

export default HomePage