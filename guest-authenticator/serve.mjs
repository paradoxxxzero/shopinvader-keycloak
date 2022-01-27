import crypto from 'crypto'
import express from 'express'
import { auth, call, KEYCLOAK_CLIENT_ID } from './utils.mjs'
import cors from 'cors'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const args = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    default: 3001,
    type: 'number',
    description: 'Port to listen on',
  })
  .option('host', {
    alias: 'h',
    default: 'localhost',
    type: 'string',
    description: 'Host to listen on',
  })
  .help()
  .parse()

const app = express()

app.use(cors())

app.get('/*', async (req, res) => {
  if (!req.query.redirect_uri) {
    return res.send('Missing redirect_uri')
  }
  try {
    const access_token = await auth()

    const email = `anon-${crypto.randomBytes(32).toString('hex')}@example.com`
    console.log(`Creating anonymous user ${email}`)
    const password = crypto.randomBytes(32).toString('hex')
    await call({
      ep: 'users',
      method: 'POST',
      data: {
        email,
        enabled: true,
        groups: ['Anonyme Users'],
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      },
      access_token,
    })

    const {
      body: [{ id }],
    } = await call({
      ep: 'users',
      data: { email, exact: true },
      access_token,
    })

    // Initiate an authorize flow
    const state = crypto.randomUUID()
    const nonce = crypto.randomUUID()

    const {
      body: html,
      headers: { 'set-cookie': cookies },
    } = await call({
      ep: 'protocol/openid-connect/auth',
      method: 'POST',
      data: {
        client_id: KEYCLOAK_CLIENT_ID,
        redirect_uri: req.query.redirect_uri,
        state,
        response_mode: 'fragment',
        response_type: 'code',
        scope: 'openid',
        nonce,
      },
      type: 'form',
      admin: false,
    })
    const url = html
      .match(/<form .* action="(.+)" method="post">/)[1]
      .replace(/&amp;/g, '&')

    const rv = await call({
      url,
      method: 'POST',
      data: {
        username: email,
        password,
        credentialId: '',
      },
      type: 'form',
      admin: false,
      cookies: cookies.map(c => c.split(';')[0]).join('; '),
    })
    res.set(rv.headers)
    res.redirect(rv.headers.location)
  } catch (e) {
    console.error(e)
    res.send('Error ' + JSON.stringify(e))
  }
})

app.listen(args.port, args.host, () => {
  console.log(
    `Guest Authenticator listening at http://${args.host}:${args.port}`
  )
})
