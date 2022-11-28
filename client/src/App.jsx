import Wallet from "./Wallet"
import Transfer from "./Transfer"
import Addresses from "./Addresses"
import "./App.scss"
import { useState } from "react"

function App() {
    const [balance, setBalance] = useState(0)
    const [address, setAddress] = useState("")

    return (
        <div>
            <div className="app">
                <Wallet
                    balance={balance}
                    setBalance={setBalance}
                    address={address}
                    setAddress={setAddress}
                />
                <Transfer setBalance={setBalance} address={address} />
            </div>

            <Addresses />
        </div>
    )
}

export default App
