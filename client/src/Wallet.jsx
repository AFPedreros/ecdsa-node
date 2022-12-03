import server from "./server"

function Wallet({
    address,
    setAddress,
    balance,
    setBalance,
    recipient,
    sendAmount,
}) {
    async function onChange(evt) {
        const address = evt.target.value
        setAddress(address)
        if (address) {
            const {
                data: { balance },
            } = await server.get(`balance/${address}`)
            setBalance(balance)
        } else {
            setBalance(0)
        }
    }

    async function sign(evt) {
        evt.preventDefault()

        try {
            const {
                data: { signature, recoveryBit },
            } = await server.post(`sign`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
            })
            console.log(signature)
            console.log(recoveryBit)
        } catch (ex) {
            alert(ex.response.data.message)
        }
    }

    return (
        <form className="container wallet" onSubmit={sign}>
            <h1>Your Wallet</h1>

            <label>
                Wallet Address
                <input
                    placeholder="Type an address, for example: 0x1"
                    value={address}
                    onChange={onChange}
                ></input>
            </label>

            <div className="balance">Balance: {balance}</div>
            <input type="submit" className="button" value="Sign" />
        </form>
    )
}

export default Wallet
