import { useEffect, useState } from "react"

export const useCards = () => {
    const [cards, setCards] = useState()

    useEffect(() => {
        fetch('https://run.mocky.io/v3/46c90692-6a2a-4d5a-938e-7ba4c98bc201')
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setCards(data.cards)
            })
    }, [])

    return cards
}
