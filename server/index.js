const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042

const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")

app.use(cors())
app.use(express.json())

const address1 = generate().address.toString()
const address2 = generate().address.toString()
const address3 = generate().address.toString()

const key1 = generate().privateKey.toString()
const key2 = generate().privateKey.toString()
const key3 = generate().privateKey.toString()

console.log("Address 1: ", address1)
console.log("Address 2: ", address2)
console.log("Address 3: ", address3)

const balances = {
    [address1]: 100,
    [address2]: 50,
    [address3]: 75,
}

app.get("/balance/:address", (req, res) => {
    const { address } = req.params
    const balance = balances[address] || 0
    res.send({ balance })
})

app.get("/addresses", (req, res) => {
    const addresses = [address1, address2, address3]
    res.send({ addresses })
})

app.get("/keys", (req, res) => {
    const keys = [key1, key2, key3]
    res.send({ keys })
})

app.post("/send", (req, res) => {
    const { sender, recipient, amount } = req.body

    setInitialBalance(sender)
    setInitialBalance(recipient)

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" })
    } else {
        balances[sender] -= amount
        balances[recipient] += amount
        res.send({ balance: balances[sender] })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0
    }
}

function generate() {
    const privateKey = secp.utils.randomPrivateKey()
    const publicKey = secp.getPublicKey(privateKey)
    const address = keccak256(publicKey.slice(1)).slice(-20)

    // console.log("Private key:", toHex(privateKey))
    // console.log("Public key:", toHex(publicKey))
    // console.log("Address:", toHex(address))

    const wallet = {
        privateKey: toHex(privateKey),
        publicKey: toHex(publicKey),
        address: toHex(address),
    }

    return wallet
}
