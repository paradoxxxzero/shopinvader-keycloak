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

app.get('/auth', async (req, res) => {
  try {
    const access_token = await auth()

    const email = `anon-${crypto.randomBytes(32).toString('hex')}@example.com`
    console.log(`Creating anonymous user ${email}`)
    const password = crypto.randomBytes(32).toString('hex')
    await call('users', {
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
    } = await call('users', {
      data: { email, exact: true },
      access_token,
    })

    const { headers } = await call('protocol/openid-connect/token', {
      method: 'POST',
      data: {
        grant_type: 'password',
        username: email,
        password,
        client_id: KEYCLOAK_CLIENT_ID,
      },
      type: 'form',
      admin: false,
    })

    res.set(headers)
    res.redirect(req.query.redirect_uri)
  } catch (e) {
    console.error(e)
    res.send('Error')
  }
})

app.listen(args.port, args.host, () => {
  console.log(`Middleware listening at http://${args.host}:${args.port}`)
})
