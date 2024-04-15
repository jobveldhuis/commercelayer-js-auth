import type { TBaseOptions } from './base.js'
import type { TPasswordReturn } from './password.js'

/**
 * The authorization code grant type is used by clients to exchange an authorization code for an access token.
 * @see https://docs.commercelayer.io/core/authentication/authorization-code#getting-an-access-token
 */
export interface TAuthorizationCodeOptions extends TBaseOptions {
  code: string
  redirectUri: string
  clientSecret: string
}

export interface TAuthorizationCodeReturn
  extends Omit<TPasswordReturn, 'ownerType'> {
  ownerType: 'user'
}
