const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042

const secp = require("ethereum-cryptography/secp256k1")
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils")
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

const privateKeys = {
    [wallet1.address]: wallet1.privateKey,
    [wallet2.address]: wallet2.privateKey,
    [wallet3.address]: wallet3.privateKey,
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
    const { sender, recipient, amount, signature, recoveryBit, publicKey } =
        req.body

    console.log("Sender: ", sender)
    console.log("Recipient: ", recipient)
    console.log("Amount: ", amount)
    console.log("Signature: ", signature)
    console.log("Recovery Bit: ", recoveryBit)
    console.log("Public Key: ", publicKey)

    const message = {
        from: sender,
        to: recipient,
        amount,
    }

    const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))))
    const recoverKey = secp.recoverPublicKey(
        messageHash,
        signature,
        recoveryBit
    )

    console.log("Recovery Key: ", toHex(recoverKey))

    setInitialBalance(sender)
    setInitialBalance(recipient)

    if (toHex(recoverKey) !== publicKey) {
        res.status(400).send({ message: "Wrong signature!" })
    } else if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" })
    } else {
        balances[sender] -= amount
        balances[recipient] += amount
        res.send({ balance: balances[sender] })
    }
})

app.post("/sign", async (req, res) => {
    const { sender, recipient, amount } = req.body

    if (sender && amount && recipient) {
        const privateKey = privateKeys[sender]

        const message = {
            from: sender,
            to: recipient,
            amount,
        }

        // console.log("Message : ", message)

        const messageHash = toHex(
            keccak256(utf8ToBytes(JSON.stringify(message)))
        )
        // console.log("Hashed Message : ", messageHash)

        const [signature, recoveryBit] = await secp.sign(
            messageHash,
            privateKey,
            {
                recovered: true,
            }
        )
        // console.log("Signature : ", toHex(signature))
        // console.log("Recovery Bit : ", recoveryBit)
        res.send({ signature: toHex(signature), recoveryBit: recoveryBit })
    } else {
        res.status(400).send({ message: "Missing information!" })
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
