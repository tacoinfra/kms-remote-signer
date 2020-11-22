import { APIGatewayProxyHandler } from 'aws-lambda'
import LockService from './src/lock-service'
import Signer from './src/signer'
import { TezosKmsClient } from '@tacoinfra/tezos-kms'

/** Constants */
// TODO(keefertaylor): Inject these with environment variables
// DynamoDb
const DYNAMO_DB_TABLE_NAME = ""
const DYNAMO_DB_AWS_REGION = ""
const DYNAMO_DB_AWS_ENDPOINT = ""

// KMS
const KMS_AWS_REGION = ""
const KMS_KEY_ID = ""

// Initialize services
const lockService = new LockService(DYNAMO_DB_AWS_REGION, DYNAMO_DB_AWS_ENDPOINT, DYNAMO_DB_TABLE_NAME)
const kmsSigner = new TezosKmsClient(KMS_KEY_ID, KMS_AWS_REGION)
const signer = new Signer(kmsSigner, lockService)

export const sign: APIGatewayProxyHandler = async (
  event,
  _context,
) => {
  try {
    if (event === null || event.body === null) {
      throw new Error("API params required.")
    }

    const operation = JSON.parse(event.body)
    console.log("Parsed operation as " + operation)

    const signature = await signer.sign(operation)
    const response = {
      signature
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }
  } catch (e) {
    console.log("Handler caught error: " + e.message)
    return {
      statusCode: 500,
      body: e.message
    }
  }
}


// TODO(keefertaylor): Properly implement.
export const getKey: APIGatewayProxyHandler = async (
  event,
  _context,
) => {
  const key = await kmsSigner.getPublicKey()
  return {
    statusCode: 200,
    body: JSON.stringify({
      public_key: key
    })
  }
}

// TODO(keefertaylor): Properly implement.
export const dumpKeys: APIGatewayProxyHandler = async (
  event,
  _context,
) => {
  const key = await kmsSigner.getPublicKey()
  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
}
