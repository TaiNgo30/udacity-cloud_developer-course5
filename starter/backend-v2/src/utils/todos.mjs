import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  const authorization = event.headers?.Authorization || event.headers?.authorization
  if (!authorization) {
    throw new Error('No authorization header')
  }
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
