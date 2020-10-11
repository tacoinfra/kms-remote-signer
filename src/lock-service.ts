/** Prefixes for operation types */
const BLOCK_LOCK_PREFIX = "BLOCK_"
const ENDORSEMENT_LOCK_PREFIX = "ENDORSEMENT_"

/**
 * Performs atomic locking for signing operations. 
 * 
 * Block operations get the form of `BLOCK_<HEIGHT>`
 * Endorsement operations get the form of `ENDORSEMENT_<HEIGHT>_<SLOT>
 */
// TODO(keefertaylor): Migrate this to be behind an interface
export default class ClassLockService {
    public constructor() { }
}