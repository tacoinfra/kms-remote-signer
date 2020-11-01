import { CodingUtils } from '@tacoinfra/tezos-core'
import Parser from './parser'
import KeyStore from './keystore'
import { OperationType } from './operation'
import LockService from './lock-service'

/** Signs payloads if they meet criteria. */
export default class Signer {
  /**
   * Construct a new Signer.
   *
   * @param keyStore An object which will store keys to sign.
   * @param lockService An object that can aquire a lock for an operation.
   */
  public constructor(private readonly keyStore: KeyStore, private readonly lockService: LockService) { }

  /**
   * Sign the given payload if it passes filter functions.
   *
   * @param payload The payload to sign, as hex.
   * @returns A base58check encoded signature.
   */
  public async sign(payload: string): Promise<string> {
    console.log(`Received request to sign ${payload}`)

    // Parse hex
    if (CodingUtils.isHex(payload)) {
      throw new Error('Request was not hex.')
    }
    const bytes = CodingUtils.hexToBytes(payload)

    // Parse bytes to an operation.
    const operation = Parser.parse(bytes)

    // Ensure the operation is a baking operation.
    if (!(operation.operationType === OperationType.Block || operation.operationType === OperationType.Endorsement)) {
      throw new Error('Attempted to sign a non-baking operation')
    }

    // Aquire a lock for signing.
    const aquiredLock = await this.lockService.lockForOperation(operation)
    if (aquiredLock === true) {
      const signature = await this.keyStore.signOperationBase58(
        Buffer.from(bytes),
      )
      return signature
    } else {
      throw new Error(`Could not aquire lock for operation type ${operation.operationType} at level ${operation.blockLevel}`)
    }
  }
}
