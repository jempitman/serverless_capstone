import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  // console.log(`The value of decodedJwt is ${decodedJwt}`)
  return decodedJwt.sub
}

export function getToken(authHeader: string): string {
  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

export function parseUserEmail(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload

  return decodedJwt.email
}
