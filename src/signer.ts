import { CodingUtils } from '@tacoinfra/tezos-core'

/** Signs payloads if they meet criteria. */
export default class Signer {
  /**
   * Sign the given payload if it passes filter functions.
   * 
   * @param payload The payload to sign, as hex.
   * @returns A base58check encoded signature.
   */
  public sign(payload: string): string {
    console.log(`Received request to sign ${payload}`)

    if (CodingUtils.isHex(payload)) {
      throw new Error("Request was not hex.")
    }
    const _bytes = CodingUtils.hexToBytes(payload)

    return 'edsig'
  }
}
