import { CodingUtils } from '@tacoinfra/tezos-core'
import Parser from './parser'
import KeyStore from './keystore'

/** Signs payloads if they meet criteria. */
export default class Signer {
  /** 
   * Construct a new Signer.
   * 
   * @param keyStore an object which will store keys to sign.
   */
  public constructor(private readonly keyStore: KeyStore) {
  }

  /**
   * Sign the given payload if it passes filter functions.
   * 
   * @param payload The payload to sign, as hex.
   * @returns A base58check encoded signature.
   */
  public async sign(payload: string): Promise<string> {
    console.log(`Received request to sign ${payload}`)

    if (CodingUtils.isHex(payload)) {
      throw new Error("Request was not hex.")
    }
    const bytes = CodingUtils.hexToBytes(payload)

    const operation = Parser.parse(bytes)

    // TODO(keefertaylor): Acquire Lock
    // TODO(keefertaylor): Verify filters are passed - is baking operation
    // TODO(keefertaylor): Is High water mark

    const signature = await this.keyStore.signOperationBase58(Buffer.from(bytes))
    return signature
  }
}
