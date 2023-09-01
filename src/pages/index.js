import { Card } from "@/components/Card";
import { useCards } from "@/hook/useCards";


function Home() {
  const cards = useCards()

  return (
    <div>
      {
        cards !== undefined ?(
          cards.map((card) => {
            return ( <Card card={card} />
            )
          })
        ) : <p>Nothing here</p>
      }
    </div>
  )
}
export default Home;