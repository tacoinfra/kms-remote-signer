/** Prefixes for operation types */
const BLOCK_LOCK_PREFIX = 'BLOCK_'
const ENDORSEMENT_LOCK_PREFIX = 'ENDORSEMENT_'

/**
 * Performs atomic locking for signing operations.
 *
 * Block operations get the form of `BLOCK_<CHAIN ID>_<HEIGHT>`
 * Endorsement operations get the form of `ENDORSEMENT_<CHAIN ID>_<HEIGHT>
 */
// TODO(keefertaylor): Migrate this to be behind an interface
export default class ClassLockService {
  public lockForBlock(chainId: string, blockLevel: BigInt): boolean {
    const lockKey = `${BLOCK_LOCK_PREFIX}_${chainId}_${blockLevel.toString()}`
    this.lockWithKey(lockKey)
    return true
  }

  public lockForEndorsement(chainId: string, blockLevel: BigInt): boolean {
    const lockKey = `${ENDORSEMENT_LOCK_PREFIX}_${chainId}_${blockLevel.toString()}`
    this.lockWithKey(lockKey)
    return true
  }

  private lockWithKey(key: string): boolean {
    console.log('Locked with ' + key)
    return true
  }
}
