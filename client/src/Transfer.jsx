import { useState, useEffect } from "react"
import server from "./server"

function Transfer({
    address,
    setBalance,
    sendAmount,
    setSendAmount,
    recipient,
    setRecipient,
    signature,
    setSignature,
    recoveryBit,
    setRecoveryBit,
    publicKey,
    setPublicKey,
}) {
    const setValue = (setter) => (evt) => setter(evt.target.value)

    async function getWallets() {
        const {
            data: { wallets },
        } = await server.get("/wallets")
    }

    useEffect(() => {
        getWallets()
    }, [])

    async function transfer(evt) {
        evt.preventDefault()

        try {
            const {
                data: { balance },
            } = await server.post(`send`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
                signature,
                recoveryBit: parseInt(recoveryBit),
                publicKey,
            })
            setBalance(balance)
        } catch (ex) {
            alert(ex.response.data.message)
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            <label>
                Signature
                <input
                    placeholder="Type the signature"
                    value={signature}
                    onChange={setValue(setSignature)}
                ></input>
            </label>

            <label>
                Recovery Bit
                <input
                    placeholder="0"
                    value={recoveryBit}
                    onChange={setValue(setRecoveryBit)}
                ></input>
            </label>

            <label>
                Public Key (verify signature)
                <input
                    placeholder="0x"
                    value={publicKey}
                    onChange={setValue(setPublicKey)}
                ></input>
            </label>

            <input type="submit" className="button" value="Transfer" />
        </form>
    )
}

export default Transfer
