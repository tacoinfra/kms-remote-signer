import { BytesRange } from 'bytes-range'
import * as Watermark from './watermark'
import Encoder from './encoder'
import ParsedOperation, { OperationType } from 'parsed-operation'
const base58Check = require('bs58check')

/** Ranges for bytes. */

// Range for watermark bytes
const WATERMARK_RANGE: BytesRange = { start: 0, end: 1 }

// Range for the chain ID.
const CHAIN_ID_RANGE: BytesRange = { start: 1, end: 5 }

// Range for the block level of a block operation. 
const BLOCK_LEVEL_BLOCK_RANGE: BytesRange = { start: 5, end: 9 }

// Range for the block level of an endorsement operation. 
// TODO(keefertaylor): Are all endorsements always the same length? 
const BLOCK_LEVEL_ENDORSEMENT_RANGE: BytesRange = { start: 38, end: 42 }

// Prefixes
// TODO(keefertaylor): Refactor to tacoinfra/tezos-core
const chainIDPrefix = "575200"

// TODO(keefertaylor): Refactor to tacoinfra/tezos-core
function mergeBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
    const merged = new Uint8Array(a.length + b.length)
    merged.set(a)
    merged.set(b, a.length)

    return merged
}

// Note: This switches order from harbinger lib.
function base58CheckEncode(prefix: Uint8Array, bytes: Uint8Array): string {
    const prefixedBytes = mergeBytes(prefix, bytes)
    return base58Check.encode(prefixedBytes)
}

/**
 * Implements parsing of bytes.
 * 
 * This class could be a static utility function, but we implement it as a class so that it can be extended and modular in the future.
 * TODO(KeeferTaylor): Is this a good idea - or do we make another class for signing? 
 */
export default {
    /**
     * Parses the given bytes to an {@link ParsedOperation}.
     * 
     * @param bytes The bytes to parse.
     * @returns The bytes as a {@link ParsedOperation}.
     */
    parse(bytes: Uint8Array): ParsedOperation {
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
        const chainIdBytes = this.extractBytesInRange(bytes, CHAIN_ID_RANGE)
        const prefix = Encoder.hexToBytes(chainIDPrefix)
        return base58Check(prefix, chainIdBytes)
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

        const levelBytesRange = operationType === OperationType.Block ? BLOCK_LEVEL_BLOCK_RANGE : BLOCK_LEVEL_ENDORSEMENT_RANGE
        const levelBytes = this.extractBytesInRange(bytes, levelBytesRange)
        return Encoder.bytesToDecimal(levelBytes)
    },

    /**
     * Returns true if the given bytes are a `Block` operation.
     * 
     * @param bytes The bytes to check.
     * @returns `true` if the bytes were a `Block`, otherwise false.
     */
    isBlock(bytes: Uint8Array): boolean {
        return this.extractBytesInRange(bytes, WATERMARK_RANGE) === Watermark.BLOCK
    },

    /**
     * Returns true if the given bytes are an `Endorsement`` operation.
     * 
     * @param bytes The bytes to check.
     * @returns `true` if the bytes were an `Endorsement`, otherwise false.
     */
    isEndorsement(bytes: Uint8Array): boolean {
        return this.extractBytesInRange(bytes, WATERMARK_RANGE) === Watermark.ENDORSEMENT
    },

    /**
     * Extract the bytes at the given range from the input bytes.
     * 
     * @param bytes The input bytes.
     * @param range The range of bytes to extract.
     * @returns The extracted bytes.
     */
    extractBytesInRange(bytes: Uint8Array, range: BytesRange): Uint8Array {
        return bytes.slice(range.start, range.end)
    }
}
