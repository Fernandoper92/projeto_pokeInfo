export class Evolution {

    chain?: {
        evolution_details: [],
        evolves_to: [{
            evolves_to?: {
                evolves_to: string
                species: {
                    name: string
                    url: string
                }
            },
            species: {
                name: string,
                url: string
            }
        }],
        species: {
            name: string,
            url: string
        }
    }
    id: number
}