type InventoryItem = {
    material: string
    amount: number
}

export type CanCraftItemOptions = {
    playerInventory: InventoryItem[]
    recipe: InventoryItem[]
}

function canCraftItem({
    playerInventory,
    recipe
}: CanCraftItemOptions): boolean {
    for (const ingredient of recipe) {
        const playerHasIngredient = playerInventory.some(
            (item) => item.material === ingredient.material && item.amount >= ingredient.amount
        )

        if (!playerHasIngredient) {
            return false
        }
    }

    return true
}

export { canCraftItem }