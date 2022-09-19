import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

/**
 * Function to download authentication certificates from Auth0 that can be used to verify JWT token signatuures
 * 
 */


// URL to JSON Web Key Set for signing certificates: 
const jwksUrl = 'https://dev-5d0trjd8.eu.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)

// Token verification (see https://auth0.com/blog/navigating-rs256-and-jwks/ for more information)

  let response = await Axios.get(jwksUrl, {
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
        }
  });

  
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  logger.info('jwd.....', jwt)
  
  //extract signing key from jwks using getSigningKeys method
  const signingKey = getSigningKeys(response.data, jwt)
   
  return verify(token, signingKey.publicKey, { algorithms: ['RS256'] }) as JwtPayload

}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

//Retrieve signing key from jwks
function getSigningKeys(jwks: any, jwt: Jwt){
  const keys:any[] = jwks.keys

  const signingKeys = keys
  .filter(key => key.use === 'sig'  //set JWK for signing
              && key.kty === 'RSA'  //Only RSA signing to be supported
              && key.kid
              && key.x5c && key.x5c.length
  ).map(key => {
    return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
  });

  //extract final signing key from array of signing key according to key id (kid)
  const finalSigningkey = signingKeys.find(key => key.kid === jwt.header.kid)

  //return final signing key
  return finalSigningkey
}


// construct signing certificate
function certToPEM(cert: any){
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}