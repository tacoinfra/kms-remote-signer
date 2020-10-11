import LockService from './lock-service'
import Parser from './parser'

export default class Signer {
    public constructor(
        private readonly lockService: LockService,
    ) { }

    public sign(bytes: Uint8Array) {
        console.log("Received request.")
    }
}
