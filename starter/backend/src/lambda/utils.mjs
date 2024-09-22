import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  const authorization = event.headers?.Authorization || event.headers?.authorization; // kiểm tra cả hai loại header viết hoa và không viết hoa
  if (!authorization) {
    throw new Error('No authorization header');
  }
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
