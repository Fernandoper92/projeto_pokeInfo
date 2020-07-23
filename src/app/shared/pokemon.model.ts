export class Pokemon {
    id?: number;
    name: string
    order: number
    sprites: {
        front_default: string
    }
    types?: {
      slot: number,
      type: {
        name: string,
        url?: string
      }
    }
}