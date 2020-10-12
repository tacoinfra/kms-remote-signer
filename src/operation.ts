/** The type of operation. */
export enum OperationType {
  Block = 1,
  Endorsement = 2,
  Generic = 3,
}

/**
 * A parsed operation.
 */
export default interface Operation {
  // The type of operation.
  operationType: OperationType

  // Base58Check encoded chain ID.
  chainId: string

  // The block level if operation is `Block` or `Endorsement`, otherwise undefined.
  blockLevel: BigInt | undefined
}
