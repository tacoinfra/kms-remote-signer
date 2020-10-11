/** The type of operation. */
export enum OperationType {
    Block,
    Endorsement,
    Generic
}

/**
 * A parsed operation.
 */
// TODO(keefertaylor): `Operation` is probably a better identifier.
export default interface ParsedOperation {
    // The type of operation.
    operationType: OperationType

    // Base58Check encoded chain ID.
    chainId: string

    // The block level if operation is `Block` or `Endorsement`, otherwise undefined.
    blockLevel: BigInt | undefined
}