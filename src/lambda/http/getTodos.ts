import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getUserTodo } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'

export const handler = middy(async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  // const result = await docClient.scan({
  //   TableName: groupsTable
  // }).promise()

  // const items = result.Items
  const userId = getUserId(event)

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
})

handler.use(
  cors({
    credentials: true
  })
)