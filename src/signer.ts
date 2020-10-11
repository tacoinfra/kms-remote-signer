import LockService from './lock-service'
import Parser from './parser'

export default class Signer {
    public constructor(
        private readonly lockService: LockService,
        private readonly parser: Parser
    ) { }

    public sign(bytes: Uint8Array) {
        console.log(`Received request to sign ${bytes}`)

        // TODO(keefertaylor): Ensure that the input was hex.

        // Retrieve the chain id.
        const parser = new Parser(bytes)
        const chainId = parser.getChainId()


        // Only sign baking operations.
        if (parser.isBlock()) {
            console.log("Block detected")
            this.signBlock(bytes)
        } else if (parser.isEndorsement()) {
            console.log("Endorsement detected")
            this.signEndorsement(bytes)
        } else {
            const message = "Bytes were not a baking operation!"
            console.log(message)
            throw new Error(message)
        }
    }

    private signEndorsement(bytes: Uint8Array) {

    }

    private signBlock(bytes: Uint8Array) {

    }
}
