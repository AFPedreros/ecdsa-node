import Wallet from "./Wallet"
import Transfer from "./Transfer"
import Addresses from "./Addresses"
import Keys from "./Keys"
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
                <Addresses />
                <Keys />
            </div>
        </div>
    )
}

export default App
