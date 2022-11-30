import server from "./server"
import { useState, useEffect } from "react"

function Keys() {
    const [generatedKeys, setGeneratedKeys] = useState("")

    async function getKeys() {
        const {
            data: { keys },
        } = await server.get("/keys")
        setGeneratedKeys(keys)
    }

    useEffect(() => {
        getKeys()
    }, [])

    return (
        <div className="container">
            <h1>Keys</h1>

            <label>
                <strong>Dan's Key</strong>
                <p>{generatedKeys[0]}</p>
            </label>
            <label>
                <strong>Al's Key</strong>
                <p>{generatedKeys[1]}</p>
            </label>
            <label>
                <strong>Ben's Key</strong>
                <p>{generatedKeys[2]}</p>
            </label>
        </div>
    )
}

export default Keys
