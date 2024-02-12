export type CalculateJumpSpeedOptions = {
    gravity: number
    height: number
}

function calculateJumpSpeed({
    gravity,
    height
}: CalculateJumpSpeedOptions): number {
    const jumpSpeed = -(Math.sqrt(2 * gravity * height))
    return jumpSpeed
}

export { calculateJumpSpeed }