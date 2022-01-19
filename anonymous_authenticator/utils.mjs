import https from 'https'
import { readFile } from 'fs/promises'

export const {
  KEYCLOAK_API,
  KEYCLOAK_ADMIN_SECRET,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
} = JSON.parse(await readFile(new URL('../secrets.json', import.meta.url)))

export const auth = async () =>
  (
    await call({
      ep: 'protocol/openid-connect/token',
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: 'admin-cli',
        client_secret: KEYCLOAK_ADMIN_SECRET,
      },
      type: 'form',
      admin: false,
      realm: 'master',
    })
  ).body.access_token

export const call = ({
  ep,
  url,
  method = 'GET',
  data = {},
  type = 'json',
  access_token,
  admin = true,
  realm = 'shopinvader-keycloak-test',
  cookies = null,
  debug = false,
}) =>
  new Promise((resolve, reject) => {
    url = new URL(
      url ||
        `${KEYCLOAK_API}/auth/${admin ? 'admin/' : ''}realms/${realm}/${ep}`
    )
    const body =
      type === 'json' && method !== 'GET'
        ? JSON.stringify(data)
        : Object.entries(data)
            .map(([k, v]) => `${encodeURI(k)}=${encodeURI(v)}`)
            .join('&')
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + (method === 'GET' && body ? `?${body}` : url.search),
      method,
      headers: {
        ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
        ...(method === 'GET'
          ? {}
          : {
              'Content-Type':
                type === 'form'
                  ? 'application/x-www-form-urlencoded'
                  : 'application/json',
              'Content-Length': body.length,
            }),
        ...(cookies ? { Cookie: cookies } : {}),
      },
    }
    debug && console.log(options, body)
    const req = https.request(options, res => {
      res.setEncoding('utf8')

      let responseBody = ''

      res.on('data', chunk => (responseBody = responseBody + chunk))
      res.on('end', function () {
        debug && console.log(res.headers, responseBody)
        const parsedBody =
          res.headers['content-type']?.startsWith('application/json') &&
          responseBody
            ? JSON.parse(responseBody + '')
            : responseBody

        res.statusCode < 200 || res.statusCode >= 400
          ? reject({
              status: res.statusCode,
              body: parsedBody,
              headers: res.headers,
            })
          : resolve({
              status: res.statusCode,
              body: parsedBody,
              headers: res.headers,
            })
      })
    })

    req.on('error', error => {
      reject(error)
    })

    req.write(body)
    req.end()
  })
