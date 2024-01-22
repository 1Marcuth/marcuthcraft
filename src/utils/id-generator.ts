import ShortUniqueId from "short-unique-id"

const idLength = 16

const { randomUUID } = new ShortUniqueId({ length: idLength })

export default randomUUID