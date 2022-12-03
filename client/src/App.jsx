import Wallet from "./Wallet"
import Transfer from "./Transfer"
import "./App.scss"
import { useState } from "react"

function App() {
    // Wallet inputs
    const [balance, setBalance] = useState(0)
    const [address, setAddress] = useState("")

    // Transfer inputs
    const [sendAmount, setSendAmount] = useState("")
    const [recipient, setRecipient] = useState("")
    const [signature, setSignature] = useState("")
    const [recoveryBit, setRecoveryBit] = useState("")
    const [publicKey, setPublicKey] = useState("")

    // console.log(address, sendAmount, recipient)

    return (
        <div>
            <div className="app">
                <Wallet
                    balance={balance}
                    setBalance={setBalance}
                    address={address}
                    recipient={recipient}
                    sendAmount={sendAmount}
                    setAddress={setAddress}
                />
                <Transfer
                    setBalance={setBalance}
                    address={address}
                    sendAmount={sendAmount}
                    setSendAmount={setSendAmount}
                    recipient={recipient}
                    setRecipient={setRecipient}
                    signature={signature}
                    setSignature={setSignature}
                    recoveryBit={recoveryBit}
                    setRecoveryBit={setRecoveryBit}
                    publicKey={publicKey}
                    setPublicKey={setPublicKey}
                />
            </div>
        </div>
    )
}

export default App
