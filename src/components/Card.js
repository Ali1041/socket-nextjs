export const Card = ({card}) => {
    return (
        <div key={card.id}>
            <h1>{card.type}</h1>
            <p>{card.ending}</p>
        </div>
    )
}