import { ref, watch } from 'vue'
import ShopinvaderService from './base'

const ANONYMOUS_USER = Object.freeze({
  name: 'Anonymous',
  email: '',
})

export default class CustomerService extends ShopinvaderService {
  constructor(keycloak, registering) {
    super(keycloak)
    this.user = ref(
      registering
        ? {
            email: this.email,
          }
        : ANONYMOUS_USER
    )
    this.registering = registering
    this.get()
  }

  async sync(method, endpoint = '', body = undefined) {
    const response = await this.fetch(method, 'customer', endpoint, body)

    if (response) {
      this.user.value = response.data
    }
  }

  async get() {
    if (this.email && !this.registering) {
      await this.sync('GET')
    }
  }
}
