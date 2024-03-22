import { authenticate, AuthenticateOptions, GrantType, jwtDecode, jwtIsSalesChannel } from '@commercelayer/js-auth'

const grantType: GrantType = 'client_credentials'

const options: AuthenticateOptions<'client_credentials'> = {
  clientId: 'BISG8bb3GWpC8_D7Nt1SuWWdieS5bJq831A50LgB_Ig',
  scope: 'market:id:KoaJYhMVVj'
}

const auth = await authenticate(grantType, options)

console.log(auth)

const decodedJWT = jwtDecode(auth.accessToken)

if (jwtIsSalesChannel(decodedJWT.payload)) {
  console.log('organization slug is', decodedJWT.payload.organization.slug)
}
