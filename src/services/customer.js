import { ref, watch } from 'vue'
import ShopinvaderService from './base'

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
    this.user = ref(
      registering
        ? {
            email: this.keycloaks.auth.tokenParsed.email,
            country: {
              id: 75, // France
            },
            external_id: this.keycloaks.auth.tokenParsed.sub,
          }
        : ANONYMOUS_USER
    )
    this.registering = registering
    this.get()
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
}
