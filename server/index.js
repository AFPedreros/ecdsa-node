const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042

const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")

let counter = 0
let wallet = {}

app.use(cors())
app.use(express.json())

const wallet1 = generate()
const wallet2 = generate()
const wallet3 = generate()

const balances = {
    [wallet1.address]: 100,
    [wallet2.address]: 50,
    [wallet3.address]: 75,
}

app.get("/balance/:address", (req, res) => {
    const { address } = req.params
    const balance = balances[address] || 0
    res.send({ balance })
})

app.get("/wallets", (req, res) => {
    const wallets = [wallet1, wallet2, wallet3]
    res.send({ wallets })
})

app.post("/send", (req, res) => {
    const { sender, recipient, amount, publicKey, signature, recoveryBit } =
        req.body

    console.log("Sender : ", sender)
    console.log("Recipient : ", recipient)
    console.log("Amount : ", amount)
    console.log("Signature : ", signature)
    console.log("Recovery Bit : ", recoveryBit)

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
    counter++

    console.log(counter)
    console.log("Private key:", toHex(privateKey))
    console.log("Public key:", toHex(publicKey))
    console.log("Address:", toHex(address))

    wallet = {
        privateKey: toHex(privateKey),
        publicKey: toHex(publicKey),
        address: toHex(address),
    }

    return wallet
}
