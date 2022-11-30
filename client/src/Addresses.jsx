import server from "./server"
import { useState, useEffect } from "react"

function Addresses() {
    const [generatedAddresses, setGeneratedAddresses] = useState([])

    async function getAddresses() {
        const {
            data: { addresses },
        } = await server.get("/addresses")
        setGeneratedAddresses(addresses)
    }

    useEffect(() => {
        getAddresses()
    })

    return (
        <div className="container">
            <h1>Addresses</h1>

            <label>
                <strong>Dan's Wallet Address</strong>
                <p>{generatedAddresses[0]}</p>
            </label>
            <label>
                <strong>Al's Wallet Address</strong>
                <p>{generatedAddresses[1]}</p>
            </label>
            <label>
                <strong>Ben's Wallet Address</strong>
                <p>{generatedAddresses[2]}</p>
            </label>
        </div>
    )
}

export default Addresses
