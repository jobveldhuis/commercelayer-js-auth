import { decodeBase64URLSafe } from './utils/base64.js'

/**
 * Decode a Commerce Layer access token.
 */
export function jwtDecode(accessToken: string): CommerceLayerJWT {
  const [header, payload] = accessToken.split('.')

  return {
    header: JSON.parse(header != null ? decodeBase64URLSafe(header) : 'null'),
    payload: JSON.parse(payload != null ? decodeBase64URLSafe(payload) : 'null')
  }
}

interface CommerceLayerJWT {
  /** The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA. */
  header: {
    /** Signing algorithm being used (e.g. `HMAC`, `SHA256`, `RSA`, `RS512`). */
    alg: string
    /** Type of the token (usually `JWT`). */
    typ?: string
    /** Key ID */
    kid?: string
  }

  payload: Payload
}

type Payload =
  | JWTUser
  | JWTDashboard
  | JWTIntegration
  | JWTSalesChannel
  | JWTWebApp

interface JWTBase {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    id: string
    public: boolean
  }

  /** Scope used to restrict access to a specific active market and/or stock location. */
  scope: string
  /** The token expiration time, expressed as an [epoch](https://www.epoch101.com/). */
  exp: number
  /** The environment type (true for test mode, false for live mode). */
  test: boolean
  /** A randomly generated number, less than one. */
  rand: number
  /** Issued at (seconds since Unix epoch). */
  iat: number
  /** Who created and signed this token (e.g. `"https://commercelayer.io"`). */
  iss: string
}

/**
 * A JWT payload that represents a `user`.
 */
export type JWTUser = JWTBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'user'
  }
  /** The authenticated user. */
  user: {
    id: string
  }
}

/**
 * A JWT payload that represents a `dashboard`.
 */
export type JWTDashboard = JWTBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'dashboard'
  }
  /** The authenticated user. */
  user: {
    id: string
  }
}

type JWTOrganizationBase = JWTBase & {
  /** The organization in scope. */
  organization: {
    id: string
    slug: string
    enterprise: boolean
    region: string
  }
  /** The owner (if any) authenticating to the APIs. */
  owner?: {
    id: string
    type: 'Customer' | 'User'
  }
  /**
   * Any other information (key/value pairs) you want to enrich the token with,
   * when using the [JWT Bearer flow](https://docs.commercelayer.io/core/authentication/jwt-bearer).
   */
  custom_claim?: Record<string, string>
  /**
   * The market(s) in scope.
   * This is available only when the scope is defined in the request.
   */
  market?: {
    id: string[]
    price_list_id: string
    stock_location_ids: string[]
    geocoder_id: string | null
    allows_external_prices: boolean
  }
}

/**
 * A JWT payload that represents a `webapp`.
 */
export type JWTWebApp = SetRequired<JWTOrganizationBase, 'owner'> & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'webapp'
  }
}

/** Create a type that makes the given keys required. The remaining keys are kept as is. */
type SetRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * A JWT payload that represents a `sales_channel`.
 */
export type JWTSalesChannel = JWTOrganizationBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'sales_channel'
  }
}

/**
 * A JWT payload that represents an `integration`.
 */
export type JWTIntegration = JWTOrganizationBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'integration'
  }
}

/**
 * Checks if the provided payload represents a `user`.
 * @param payload The payload to be checked.
 * @returns
 */
export function jwtIsUser(payload: Payload): payload is JWTUser {
  return payload.application.kind === 'user'
}

/**
 * Checks if the provided payload represents a `dashboard`.
 * @param payload The payload to be checked.
 * @returns
 */
export function jwtIsDashboard(payload: Payload): payload is JWTDashboard {
  return payload.application.kind === 'dashboard'
}

/**
 * Checks if the provided payload represents an `integration`.
 * @param payload The payload to be checked.
 * @returns
 */
export function jwtIsIntegration(payload: Payload): payload is JWTIntegration {
  return payload.application.kind === 'integration'
}

/**
 * Checks if the provided payload represents a `sales_channel`.
 * @param payload The payload to be checked.
 * @returns
 */
export function jwtIsSalesChannel(
  payload: Payload
): payload is JWTSalesChannel {
  return payload.application.kind === 'sales_channel'
}

/**
 * Checks if the provided payload represents a `webapp`.
 * @param payload The payload to be checked.
 * @returns
 */
export function jwtIsWebApp(payload: Payload): payload is JWTWebApp {
  return payload.application.kind === 'webapp'
}
