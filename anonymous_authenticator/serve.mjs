import crypto from 'crypto'
import express from 'express'
import { auth, call, KEYCLOAK_CLIENT_ID } from './utils.mjs'
import cors from 'cors'

const app = express()
const port = 3001

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

    const { body: authInfos } = await call('protocol/openid-connect/token', {
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

    res.send(JSON.stringify({ success: true, ...authInfos }))
  } catch (e) {
    console.error(e)
    res.send('Error')
  }
})

app.listen(port, () => {
  console.log(`Middleware listening at http://localhost:${port}`)
})
