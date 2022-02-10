import { ref, watch } from 'vue'
import ShopinvaderService from './base'
import { silentLogout, createGuestUser } from '../utils'

const ANONYMOUS_USER = Object.freeze({
  name: 'Anonymous',
  email: '',
  country: {
    id: 75, // France
  },
})

export default class CustomerService extends ShopinvaderService {
  constructor(keycloaks, registering) {
    super(keycloaks)
    this.user = ref(ANONYMOUS_USER)
    this.registering = registering
  }

  setupRegisteringUser() {
    this.user.value = {
      name: this.keycloaks.user.tokenParsed.name,
      email: this.keycloaks.user.tokenParsed.email,
      country: {
        id: 75, // France
      },
      external_id: this.keycloaks.user.tokenParsed.sub,
    }
  }

  async sync(method, endpoint = '', body = undefined, allowAnonymous = false) {
    const response = await this.fetch({
      service: 'customer',
      method,
      endpoint,
      body,
      allowAnonymous,
    })

    if (response) {
      this.user.value = response.data
    }
    return response
  }

  async get() {
    if (this.email && !this.registering) {
      await this.sync('GET')
    }
  }

  async register() {
    return await this.sync('POST', 'create', this.user.value, true)
  }

  async logout(type) {
    await silentLogout(this.keycloaks[type])

    if (this.email) {
      // If we still have an auth, refresh the user
      await this.sync('GET')
    } else {
      // If we do not have auth anymore, let's skip to guest user creation
      // This prevent an useless redirect
      createGuestUser(this.keycloaks.guest)
    }
  }
}
