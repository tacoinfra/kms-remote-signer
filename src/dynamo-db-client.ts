import { DynamoDB } from "aws-sdk"

const TABLE = "HIGH_WATER_MARK"


export default class DynamoDbClient {
  public constructor() {
    const dynamoDb = new DynamoDB()
  }

  public update() {
    var params = {
      TableName: TABLE,
      Key: {
        "year": year,
        "title": title
      },
      UpdateExpression: "remove info.actors[0]",
      ConditionExpression: "size(info.actors) > :num",
      ExpressionAttributeValues: {
        ":num": 3
      },
      ReturnValues: "UPDATED_NEW"
    };
  }
}