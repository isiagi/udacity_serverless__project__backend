import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getUserTodo } from '../../businessLogic/todos'

export const handler:APIGatewayProxyHandler = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  // const result = await docClient.scan({
  //   TableName: groupsTable
  // }).promise()

  // const items = result.Items
  const userId = '04'

  const items = await getUserTodo(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}