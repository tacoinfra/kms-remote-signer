/**
 * An object which can store keys for signing.
 *
 * Note that this interface is implemented by `TezosKmsClient` in the `@tacoinfra/tezos-kms` library.
 */
export default interface KeyStore {
  /**
   * Sign the given bytes and return a base58check signature.
   *
   * @param buffer The bytes to sign.
   * @returns a Base58 signature.
   */
  signOperationBase58(buffer: Buffer): Promise<string>
}
