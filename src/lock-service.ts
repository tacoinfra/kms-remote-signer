/** Prefixes for operation types */
const BLOCK_LOCK_PREFIX = "BLOCK_"
const ENDORSEMENT_LOCK_PREFIX = "ENDORSEMENT_"

/**
 * Performs atomic locking for signing operations. 
 * 
 * Block operations get the form of `BLOCK_<HEIGHT>`
 * Endorsement operations get the form of `ENDORSEMENT_<HEIGHT>_<SLOT>
 */
// TODO(keefertaylor): Make all these aux services behind interfaces
export default class ClassLockService {
    public constructor() { }

    public lockEndorsement(height: number, slot: number): boolean {
        const lockKey = `${ENDORSEMENT_LOCK_PREFIX}_${height}_${slot}`
        return true
    }

    public lockEndorsement(height: number, slot: number): boolean {
        const lockKey = `${ENDORSEMENT_LOCK_PREFIX}_${height}_${slot}`
        return true
    }
}