// TODO(keefertaylor): Apply same design to WaterMark
// TODO(keefertaylor): Refactor these libs to tacoinfra/tezos-core
export default {
    bytesToDecimal(bytes: Uint8Array): BigInt {
        const hex = this.bytesToHex(bytes)
        return BigInt(hex)
    },

    bytesToHex(bytes: Uint8Array): string {
        return Buffer.from(bytes).toString('hex')
    },

    /**
 * Convert the given hex string to bytes.
 */
    hexToBytes(hex: string): Uint8Array {
        if (!this.isHex(hex)) {
            throw new Error(`Invalid hex${hex}`)
        }

        return Uint8Array.from(Buffer.from(hex, 'hex'))
    },

    /**
 * Check if the given string is valid hex.
 *
 * @param input The input to check.
 * @returns true if the input is valid hex, otherwise false.
 */
    isHex(input: string): boolean {
        const hexRegEx = /([0-9]|[a-f])/gim
        return (input.match(hexRegEx) || []).length === input.length
    },
}
