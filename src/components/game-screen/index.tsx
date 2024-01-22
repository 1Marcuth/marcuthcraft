import { FC, useEffect, useRef } from "react"

import styles from "./style.module.scss"

interface Size {
    width: number
    height: number
}

type OnReady = ($canvas: HTMLCanvasElement) => any

interface IProps {
    size: Size
    onReady: OnReady
}

const GameScreen: FC<IProps> = ({ size, onReady }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const $canvas = canvasRef.current

        function configureCanvas($canvas: HTMLCanvasElement) {
            $canvas.width = size.width
            $canvas.height = size.height

            const ctx = $canvas.getContext("2d")
            
            if (ctx) ctx.imageSmoothingEnabled = false
        }

        if ($canvas) {
            configureCanvas($canvas)
            onReady($canvas)
        }
    }, [size, onReady]) 

    return (
        <canvas
            className={styles["game-screen"]}
            ref={canvasRef}
        />
    )
}

export default GameScreen