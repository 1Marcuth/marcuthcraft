import SplashMessageManager from "./splash-message-manager"
import CanvasButton from "../utils/canvas-ui/button"
import { Resource } from "./resource-loader"
import Game from "./index"
import {
    blockSize, chunksRenderedByDirection,
    chunkWidth, playerSize, screenSize,
    visionScale
} from "../game-config"

type RequestAnimationFrameFunction = typeof requestAnimationFrame

enum Screens {
    intro,
    worldMenu,
    mainMenu,
    loadingWorld,
    world
}

export type ScreenType = keyof typeof Screens

type Images = {
    textureSprites?: HTMLImageElement
    logoIntro?: HTMLImageElement
    logo?: HTMLImageElement
    backgroundLayerTwo?: HTMLImageElement
    widgets?: HTMLImageElement
    backgroundBlur?: HTMLImageElement
}

type GameContext = {
    getLoadedResources: () => Resource[]
    splashMessageManager: SplashMessageManager
    amountOfResources: number
}

export type GameRenderProps = {
    game: Game,
    $canvas: HTMLCanvasElement,
    currentScreen?: ScreenType,
    images: Images,
    gameContext: GameContext,
    requestAnimationFrame: RequestAnimationFrameFunction
}

export type GameRenderNewProps = {
    game?: Game,
    $canvas?: HTMLCanvasElement,
    currentScreen?: ScreenType,
    images?: Images,
    gameContext?: GameContext,
    requestAnimationFrame?: RequestAnimationFrameFunction
}

type CanvasContext = CanvasRenderingContext2D & { [key: string]: string }

type GameRenderWidget = CanvasButton

type GameRenderWidgets = { [key: string]: GameRenderWidget }

class GameRender {
    public props: GameRenderProps
    public isRunning: boolean = true
    private lastFrameTime: number = 0
    private fps: number = 0

    private backgroundLayerTwoOffsetX: number = 0
    private widgets: GameRenderWidgets = {}

    public constructor(props: GameRenderProps) {
        this.props = props
    }

    public setProps(newProps: GameRenderNewProps) {
        this.props = Object.assign(this.props, newProps)
    }

    private addWidget(key: string, widget: GameRenderWidget) {
        this.widgets[key] = widget
    }

    private removeUnnecessaryWidgets() {
        for (const widgetKey in this.widgets) {
            if (!this.props.currentScreen || !widgetKey.startsWith(this.props.currentScreen)) {
                this.widgets[widgetKey].destroy()
                delete this.widgets[widgetKey]
            }
        }
    }

    public pause() {
        this.isRunning = false
    }

    public run() {
        this.isRunning = true
        this.render(this.props)
    }

    private drawFps(ctx: CanvasRenderingContext2D) {
        const x = 10
        const y = 20

        ctx.fillStyle = "#fff"
        ctx.textAlign = "left"
        ctx.font = "15px Minecraft"
        
        ctx.fillText(`FPS: ${this.fps}`, x, y)
    }

    private calculateFps(currentTime: number) {
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime
            return
        }

        const elapsedMilliseconds = currentTime - this.lastFrameTime
        this.fps = Math.round(1000 / elapsedMilliseconds)
        this.lastFrameTime = currentTime
    }

    private render({
        game,
        $canvas,
        currentScreen,
        images,
        gameContext,
        requestAnimationFrame
    }: GameRenderProps) {
        const ctx = $canvas.getContext("2d") as CanvasContext
        
        const addWidget = this.addWidget.bind(this)
        const setProps = this.setProps.bind(this)
        const widgets = this.widgets

        if (currentScreen === "mainMenu") this.backgroundLayerTwoOffsetX -= .5
        const backgroundLayerTwoOffsetX = this.backgroundLayerTwoOffsetX
    
        const chunks = game.props.world.props.chunks
        const camera = game.props.player.props.camera
        const cameraX = camera.props.offset.x
        const cameraY = camera.props.offset.y
    
        function clearScreen() {
            ctx.clearRect(0, 0, screenSize.width, screenSize.height)
        }
    
        function drawBackground() {
            const backgroundSize = { width: 706, height: 326 }
            const backgroundCoord = { x: 0, y: 0 }
            const backgroundSpriteX = 80
            const backgroundSpriteY = 0
            const backgroundAspectRatio = backgroundSize.width / backgroundSize.height
    
            let backgroundWidth = screenSize.width
            let backgroundHeight = backgroundWidth / backgroundAspectRatio
    
            if (backgroundHeight < screenSize.height) {
                backgroundHeight = screenSize.height
                backgroundWidth = backgroundHeight * backgroundAspectRatio
            }
    
            ctx.drawImage(
                images.textureSprites!,
                backgroundSpriteX,
                backgroundSpriteY,
                backgroundSize.width,
                backgroundSize.height,
                backgroundCoord.x,
                backgroundCoord.y,
                backgroundWidth,
                backgroundHeight
            )
        }
    
        function drawChunks() {
            const chunksAmount = Object.keys(chunks).length
            const currentChunkIndex = Math.floor(cameraX / (chunkWidth * blockSize.width * visionScale))
    
            const startChunkIndex = Math.max(0, currentChunkIndex - chunksRenderedByDirection)
            const endChunkIndex = Math.min(chunksAmount - 1, currentChunkIndex + chunksRenderedByDirection)
    
            for (let chunkIndex = startChunkIndex; chunkIndex <= endChunkIndex; chunkIndex++) {
                const chunk = chunks[chunkIndex]
        
                for (let blockIndex = 0; blockIndex < chunk.props.data.length; blockIndex++) {
                    const block = chunk.props.data[blockIndex]
                    const x = ((blockIndex % chunkWidth) * blockSize.width + chunkIndex * chunkWidth * blockSize.width) * visionScale
                    const y = (Math.floor(blockIndex / chunkWidth) * blockSize.height) * visionScale
        
                    if (block.props.clipping) {
                        const blockSpriteX = block.props.clipping.x
                        const blockSpriteY = block.props.clipping.y
                        const blockClippingWidth = block.props.clipping.width
                        const blockClippingHeight = block.props.clipping.height
                        const blockX = x - cameraX + $canvas.width / 2
                        const blockY = y - cameraY
        
                        ctx.drawImage(
                            images.textureSprites!,
                            blockSpriteX,
                            blockSpriteY,
                            blockClippingWidth,
                            blockClippingHeight,
                            blockX,
                            blockY,
                            blockSize.width * visionScale,
                            blockSize.height * visionScale
                        )
                    }
                }
            }
        }
    
        function drawPlayer() {
            ctx.fillStyle = "#000"
    
            const playerX = ($canvas.width / 2) - (playerSize.width / 2)
            const playerY = ($canvas.height / 2) - (playerSize.height / 2)
    
            ctx.fillRect(
                playerX,
                playerY,
                playerSize.width * visionScale,
                playerSize.height * visionScale
            )   
        }
    
        function drawIntroLogo() {
            ctx.drawImage(
                images.logoIntro!,
                0,
                0,
                $canvas.width,
                $canvas.height
            )
        }
    
        function drawResourcesLoadingBar() {
            const resourcesLoaded = gameContext.getLoadedResources().length
            const progress = (resourcesLoaded / gameContext.amountOfResources) * 100
            const maxProgressBarWidth = 600
            const progressBarHeight = 15
            const externalFrameWidth = maxProgressBarWidth + 12
            const externalFrameHeight = progressBarHeight + 12
    
            const x = ($canvas.width / 2) - (externalFrameWidth / 2)
            const y = $canvas.height - 150
    
            function drawExternalFrame() {
                const externalFrameX = x
                const externalFrameY = y
    
                ctx.fillStyle = "#fff"
    
                ctx.fillRect(
                    externalFrameX,
                    externalFrameY,
                    externalFrameWidth,
                    externalFrameHeight
                )
            }
    
            function drawInnerFrame() {
                const innerFrameX = x + 3
                const innerFrameY = y + 3
                const innerFrameWidth = maxProgressBarWidth + 6
                const innerFrameHeight = progressBarHeight + 6
    
                ctx.fillStyle = "#ff2e3c"
            
                ctx.fillRect(
                    innerFrameX,
                    innerFrameY,
                    innerFrameWidth,
                    innerFrameHeight
                )
            }
    
            function drawProgressBar() {
                const progressBarFrameX = x + 6
                const progressBarFrameY = y + 6
                const progressBarWidth = (progress / 100) * maxProgressBarWidth
    
                ctx.fillStyle = "#fff"
    
                ctx.fillRect(
                    progressBarFrameX,
                    progressBarFrameY,
                    progressBarWidth,
                    progressBarHeight
                )
            }
    
            drawExternalFrame()
            drawInnerFrame()
            drawProgressBar()
        }
    
        function drawResourcesLoadingTitle() {
            const loadedResources = gameContext.getLoadedResources()
            const loadedResourcesAmount = loadedResources.length
            const lastLoadedResource = loadedResources[loadedResources.length - 1]
            const lastLoadedResourceName = lastLoadedResource.source
            const maxResourceNameLength = 30
    
            const slicedLastResourceName = (lastLoadedResourceName.length > maxResourceNameLength ?
                lastLoadedResourceName.slice(0, maxResourceNameLength) + "..." :
                lastLoadedResourceName
            )
    
            const title = `[${loadedResourcesAmount}/${gameContext.amountOfResources}] Carregando recursos: "${slicedLastResourceName}"`
    
            const x = $canvas.width / 2
            const y = $canvas.height - 165
    
            ctx.fillStyle = "#fff"
            ctx.textAlign = "center"
            ctx.letterSpacing = "2px"
            ctx.font = "15px Minecraft"
    
            ctx.fillText(
                title,
                x,
                y
            )
        }

        function drawMainMenuBackground() {
            function drawLayerOne() {
                const width = $canvas.width
                const height = $canvas.height
                const x = 0
                const y = 0

                const gradient = ctx.createLinearGradient(x, y, width, height)

                gradient.addColorStop(0, "#4B97FF")
                gradient.addColorStop(1, "#519DFF")

                ctx.fillStyle = gradient

                ctx.fillRect(
                    x,
                    y,
                    width,
                    height
                )
            }

            function drawLayerTwo() {
                if (!images.backgroundLayerTwo) return
                
                const image = images.backgroundLayerTwo

                let x = Math.round((($canvas.width - image.width) / 2) + backgroundLayerTwoOffsetX)
                const y = ($canvas.height - image.height) / 2

                x -= Math.floor(backgroundLayerTwoOffsetX / image.width) * image.width

                ctx.drawImage(
                    image,
                    x,
                    y
                )

                if (x > 0) {
                    ctx.drawImage(
                        image,
                        x - image.width,
                        y
                    )
                }
            }

            function drawLayerThree() {
                const image = images.backgroundBlur!

                const x = ($canvas.width - image.width) / 2
                const y = ($canvas.height - image.height) / 2

                ctx.drawImage(
                    image,
                    x,
                    y
                )
                   
            }

            drawLayerOne()
            drawLayerTwo()  
            drawLayerThree()          
        }

        function drawMainMenuLogoTitle() {
            const image = images.logo!

            const x = ($canvas.width - image.width) / 2
            const y = 80

            ctx.drawImage(
                image,
                x,
                y
            )
        }

        function drawMainMenuButtons() {
            function drawSinglePlayerButton() {
                const buttonWidth = 545
                const buttonHeight = Math.round(buttonWidth / 10)
                const buttonX = ($canvas.width - buttonWidth) / 2
                const buttonY = 329

                function drawButton() {
                    const buttonKey = "mainMenu.singlePlayerButton"
                    let button: CanvasButton

                    if (buttonKey in widgets) {
                        button = widgets[buttonKey]
                    } else {
                        button = new CanvasButton({
                            ctx: ctx,
                            width: buttonWidth,
                            height: buttonHeight,
                            x: buttonX,
                            y: buttonY,
                            onClick: () => { setProps({ currentScreen: "world" }) }
                        })

                        addWidget(buttonKey, button)
                    }

                    button.draw({
                        image: images.widgets,
                        imageClipping: {
                            x: 0,
                            y: 15,
                            height: 15,
                            width: 150
                        },
                        imageMouseOver: images.widgets,
                        imageMouseOverClipping: {
                            x: 0,
                            y: 30,
                            height: 15,
                            width: 150
                        }
                    })
                }

                function drawTextButton() {
                    const textX = $canvas.width / 2
                    const textY = buttonY + (buttonHeight / 2) + 7

                    const text = "Singleplayer"

                    ctx.font = `${buttonHeight / 2}px Minecraft`
                    ctx.letterSpacing = "2px"
                    ctx.textAlign = "center"

                    ctx.fillStyle = "#000"

                    ctx.fillText(
                        text,
                        textX + 2,
                        textY + 2
                    )

                    ctx.fillStyle = "#F4F2F4"

                    ctx.fillText(
                        text,
                        textX,
                        textY
                    )
                }

                drawButton()
                drawTextButton()
            }

            function drawCreditsButton() {
                const buttonWidth = 545
                const buttonHeight = Math.round(buttonWidth / 10)
                const buttonX = ($canvas.width - buttonWidth) / 2
                const buttonY = 398

                function drawButton() {
                    const buttonKey = "mainMenu.CreditsButton"
                    let button: CanvasButton

                    if (buttonKey in widgets) {
                        button = widgets[buttonKey]
                    } else {
                        button = new CanvasButton({
                            ctx: ctx,
                            width: buttonWidth,
                            height: buttonHeight,
                            x: buttonX,
                            y: buttonY,
                            onClick: () => { console.log("Clicked!") }
                        })

                        addWidget(buttonKey, button)
                    }

                    button.draw({
                        image: images.widgets,
                        imageClipping: {
                            x: 0,
                            y: 15,
                            height: 15,
                            width: 150
                        },
                        imageMouseOver: images.widgets,
                        imageMouseOverClipping: {
                            x: 0,
                            y: 30,
                            height: 15,
                            width: 150
                        }
                    })
                }

                function drawTextButton() {
                    const textX = $canvas.width / 2
                    const textY = buttonY + (buttonHeight / 2) + 7

                    const text = "Credits"

                    ctx.font = `${buttonHeight / 2}px Minecraft`
                    ctx.letterSpacing = "2px"
                    ctx.textAlign = "center"

                    ctx.fillStyle = "#000"

                    ctx.fillText(
                        text,
                        textX + 2,
                        textY + 2
                    )

                    ctx.fillStyle = "#F4F2F4"

                    ctx.fillText(
                        text,
                        textX,
                        textY
                    )
                }

                drawButton()
                drawTextButton()
            }

            function drawOptionsButton() {
                const buttonWidth = 545
                const buttonHeight = Math.round(buttonWidth / 10)
                const buttonX = ($canvas.width - buttonWidth) / 2
                const buttonY = 500

                function drawButton() {
                    const buttonKey = "mainMenu.OptionsButton"
                    let button: CanvasButton

                    if (buttonKey in widgets) {
                        button = widgets[buttonKey]
                    } else {
                        button = new CanvasButton({
                            ctx: ctx,
                            width: buttonWidth,
                            height: buttonHeight,
                            x: buttonX,
                            y: buttonY,
                            onClick: () => { console.log("Clicked!") }
                        })

                        addWidget(buttonKey, button)
                    }

                    button.draw({
                        image: images.widgets,
                        imageClipping: {
                            x: 0,
                            y: 15,
                            height: 15,
                            width: 150
                        },
                        imageMouseOver: images.widgets,
                        imageMouseOverClipping: {
                            x: 0,
                            y: 30,
                            height: 15,
                            width: 150
                        }
                    })
                }

                function drawTextButton() {
                    const textX = $canvas.width / 2
                    const textY = buttonY + (buttonHeight / 2) + 7

                    const text = "Options..."

                    ctx.font = `${buttonHeight / 2}px Minecraft`
                    ctx.letterSpacing = "2px"
                    ctx.textAlign = "center"

                    ctx.fillStyle = "#000"

                    ctx.fillText(
                        text,
                        textX + 2,
                        textY + 2
                    )

                    ctx.fillStyle = "#F4F2F4"

                    ctx.fillText(
                        text,
                        textX,
                        textY
                    )
                }

                drawButton()
                drawTextButton()
            }

            
            drawSinglePlayerButton()
            drawCreditsButton()
            drawOptionsButton()
        }

        function drawSplashMessage() {
            const splashMessage = gameContext.splashMessageManager.getCurrentMessage();
            const x = 1000;
            const y = 160;
        
            const animationDuration = 750
            const minFontSize = 22
            const maxFontSize = 3
            const rotationAngle = -17 * (Math.PI / 180)
            const currentTime = Date.now()
        
            const elapsed = (currentTime % animationDuration) / animationDuration
            const fontSize = minFontSize + Math.abs(Math.sin(elapsed * Math.PI)) * maxFontSize
        
            ctx.save()
        
            ctx.translate(x, y)
            ctx.rotate(rotationAngle)
        
            ctx.font = `${fontSize}px Minecraft`
            ctx.letterSpacing = "3px"
            ctx.textAlign = "center"
            ctx.fillStyle = "#000"
        
            ctx.fillText(
                splashMessage,
                0 + 2,
                0 + 2
            )
        
            ctx.fillStyle = "#ff0"
        
            ctx.fillText(
                splashMessage,
                0,
                0
            )
        
            ctx.restore()
        }

        function drawDefaultBackground() {
            const width = $canvas.width
            const height = $canvas.height
            const x = 0
            const y = 0

            ctx.fillStyle = "#ff2e3c"

            ctx.fillRect(
                x,
                y,
                width,
                height
            )
        }

        function drawTrademark() {
            const text = "A fan game created by Marcuth"
            const fontSize = 20

            const x = fontSize / 2
            const y = $canvas.height - (fontSize / 2)

            ctx.font = `${fontSize}px Minecraft`
            ctx.textAlign = "left"
            ctx.fillStyle = "#fff"

            ctx.fillText(
                text,
                x,
                y
            )
        }

        function drawGameVersion() {
            const text = "v0.1"
            const fontSize = 20

            const x = $canvas.width - (fontSize / 2)
            const y = $canvas.height - (fontSize / 2)

            ctx.font = `${fontSize}px Minecraft`
            ctx.textAlign = "right"
            ctx.fillStyle = "#fff"

            ctx.fillText(
                text,
                x,
                y
            )
        }
    
        clearScreen()

        switch (currentScreen) {
            case "world":
                drawBackground()
                drawChunks()
                drawPlayer()
                break
            
            case "intro":
                drawIntroLogo()
                drawResourcesLoadingBar()
                drawResourcesLoadingTitle()
                break

            case "mainMenu":
                drawMainMenuBackground()
                drawMainMenuLogoTitle()
                drawMainMenuButtons()
                drawSplashMessage()
                drawTrademark()
                drawGameVersion()
                break

            default:
                drawDefaultBackground()
        }

        this.drawFps(ctx)

        if (this.isRunning) {
            return requestAnimationFrame(() => {
                game.update()
                this.removeUnnecessaryWidgets()
                this.calculateFps(Date.now())
                this.render(this.props)
            })
        }
    }
}

export default GameRender