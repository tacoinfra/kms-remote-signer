import { DynamoDB } from 'aws-sdk'
import Operation, { OperationType } from 'operation'

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
export default class LockService {
  private readonly documentClient: DynamoDB.DocumentClient

  public constructor(region: string, endpoint: string, private readonly tableName: string) {
    this.documentClient = new DynamoDB.DocumentClient({
      region,
      endpoint
    });
  }

  public async lockForOperation(operation: Operation): Promise<boolean> {
    const blockLevel = operation.blockLevel
    const chainId = operation.chainId

    if (blockLevel === undefined) {
      throw new Error("Unknown block level!")
    }

    if (operation.operationType == OperationType.Block) {
      return this.lockForBlock(chainId, blockLevel)
    } else if (operation.operationType === OperationType.Endorsement) {
      return this.lockForEndorsement(chainId, blockLevel)
    } else {
      throw new Error("Bad operation type")
    }
  }

  private lockForBlock(chainId: string, blockLevel: BigInt): Promise<boolean> {
    const lockKey = `${BLOCK_LOCK_PREFIX}_${chainId}`
    return this.lockWithKey(lockKey, blockLevel)
  }

  private lockForEndorsement(chainId: string, blockLevel: BigInt): Promise<boolean> {
    const lockKey = `${ENDORSEMENT_LOCK_PREFIX}_${chainId}`
    return this.lockWithKey(lockKey, blockLevel)
  }

  private async lockWithKey(key: string, level: BigInt): Promise<boolean> {
    const params = {
      ConditionExpression: "#level < :level",
      ExpressionAttributeNames: {
        "#level": "level"
      },
      ExpressionAttributeValues: {
        ":level": level
      },
      Key: {
        type: key
      },
      TableName: this.tableName,
      UpdateExpression: "set #level = :level"
    };

    return new Promise((resolve, reject) => {
      this.documentClient.update(params, error => {
        if (error) {
          if (error.code === "ConditionalCheckFailedException") {
            console.log("Conditional check failed.", error);
            resolve(false);
          } else {
            console.log("Failed to update db, unexpected error.", error);
            reject(error);
          }
        } else {
          resolve(true);
        }
      });
    });
  }
}
