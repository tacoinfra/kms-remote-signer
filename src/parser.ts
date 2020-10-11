import { CodingUtils, Prefix, Watermark } from '@tacoinfra/tezos-core'
import Operation, { OperationType } from 'operation'

/**
 * Implements parsing of bytes.
 * 
 * This class could be a static utility function, but we implement it as a class so that it can be extended and modular in the future.
 */
export default {
    /**
     * Parses the given bytes to an {@link Operation}.
     * 
     * @param bytes The bytes to parse.
     * @returns The bytes as a {@link Operation}.
     */
    parse(bytes: Uint8Array): Operation {
        // Determine operation type.
        let operationType = OperationType.Generic
        if (this.isBlock(bytes)) {
            operationType = OperationType.Block
        } else if (this.isEndorsement(bytes)) {
            operationType = OperationType.Endorsement
        }

        return {
            operationType,
            chainId: this.parseChainId(bytes),
            blockLevel: this.parseBlockLevel(bytes, operationType)
        }
    },

    /**
     * Parses the base58check encoded chain ID from the given input bytes.
     * 
     * @param bytes The bytes to parse from.
     * @returns The block level if the operation was an `Endorsement` or a `Block` operation, otherwise undefined.
     */
    parseChainId(bytes: Uint8Array): string {
        const chainIdBytes = bytes.slice(1, 5)
        return CodingUtils.base58CheckEncode(Prefix.CHAIN_ID, chainIdBytes)
    },

    /**
     * Parses the block level from the given input bytes.
     * 
     * @param bytes The bytes to parse from.
     * @param operationType The operation type of the bytes.
     * @returns The block level if the operation was an `Endorsement` or a `Block` operation, otherwise undefined.
     */
    parseBlockLevel(bytes: Uint8Array, operationType: OperationType): BigInt | undefined {
        if (operationType === OperationType.Generic) {
            return undefined
        }

        const levelBytes = OperationType.Block ?
            bytes.slice(5, 9) :
            bytes.slice(-4)
        return CodingUtils.bytesToDecimal(levelBytes)
    },

    /**
     * Returns true if the given bytes are a `Block` operation.
     * 
     * @param bytes The bytes to check.
     * @returns `true` if the bytes were a `Block`, otherwise false.
     */
    isBlock(bytes: Uint8Array): boolean {
        return bytes.slice(0, 1) === Watermark.BLOCK
    },

    /**
     * Returns true if the given bytes are an `Endorsement`` operation.
     * 
     * @param bytes The bytes to check.
     * @returns `true` if the bytes were an `Endorsement`, otherwise false.
     */
    isEndorsement(bytes: Uint8Array): boolean {
        return bytes.slice(0, 1) === Watermark.ENDORSEMENT
    },
}
