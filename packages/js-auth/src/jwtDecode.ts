/**
 * Decode a Commerce Layer access token.
 */
export function jwtDecode(accessToken: string): CommerceLayerJWT {
  const [header, payload] = accessToken.split('.')

  return {
    header: JSON.parse(header != null ? atob(header) : 'null'),
    payload: JSON.parse(payload != null ? atob(payload) : 'null')
  }
}

/**
 * The `atob()` function decodes a string of data
 * which has been encoded using [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) encoding.
 *
 * This method works both in Node.js and browsers.
 *
 * @link [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/atob)
 * @param encodedData A binary string (i.e., a string in which each character in the string is treated as a byte of binary data) containing base64-encoded data.
 * @returns An ASCII string containing decoded data from `encodedData`.
 */
function atob(encodedData: string): string {
  if (typeof window !== 'undefined') {
    return window.atob(encodedData)
  }

  return Buffer.from(encodedData, 'base64').toString('binary')
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
  | JWTProvisioning
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

type JWTProvisioning = JWTBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'user'
  }
  /** The user authenticating to the Provisioning API */
  user: {
    id: string
  }
}

type JWTDashboard = JWTBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'dashboard'
  }
  /** The user authenticating to the Dashboard */
  user: {
    id: string
  }
}

type JWTCoreBase = JWTBase & {
  /** The organization's unique ID. */
  organization: {
    id: string
    slug: string
    enterprise: boolean
    region: string
  }
  /** The market(s) in scope. */
  market?: {
    id: string[]
    price_list_id: string
    stock_location_ids: string[]
    geocoder_id: string | null
    allows_external_prices: boolean
  }
}

type JWTWebApp = JWTCoreBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'webapp'
  }
  /** The owner (if any) authenticating to the APIs. */
  owner: {
    id: string
    type: 'User'
  }
}

type JWTSalesChannel = JWTCoreBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'sales_channel'
  }
  /** The owner (if any) authenticating to the APIs. */
  owner?: {
    id: string
    type: 'Customer'
  }
}

type JWTIntegration = JWTCoreBase & {
  /** The type of credentials you're using to authenticate to the APIs. */
  application: {
    kind: 'integration'
  }
}

export function jwtIsProvisioning(
  payload: Payload
): payload is JWTProvisioning {
  return payload.application.kind === 'user'
}

export function jwtIsDashboard(payload: Payload): payload is JWTDashboard {
  return payload.application.kind === 'dashboard'
}

export function jwtIsIntegration(payload: Payload): payload is JWTIntegration {
  return payload.application.kind === 'integration'
}

export function jwtIsSalesChannel(
  payload: Payload
): payload is JWTSalesChannel {
  return payload.application.kind === 'sales_channel'
}

export function jwtIsWebApp(payload: Payload): payload is JWTWebApp {
  return payload.application.kind === 'webapp'
}
