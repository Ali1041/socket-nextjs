import Link from "next/link"

const Chat = () => {
    return (
        <div>
            <h1>Chat Room</h1>
            <Link href={'/chat/1'}>Chat Room 1</Link>
            <Link href={'/chat/2'}>Chat Room 2</Link>
            <Link href={'/chat/3'}>Chat Room 3</Link>
        </div>
    )
}
export default Chat