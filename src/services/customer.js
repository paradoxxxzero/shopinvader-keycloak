import { ref, watch } from 'vue'
import ShopinvaderService from './base'

const ANONYMOUS_USER = Object.freeze({
  name: 'Anonymous',
  email: '',
  is_anon: true,
})

export default class CustomerService extends ShopinvaderService {
  constructor(websiteKey, websiteUrl, keycloak, registering) {
    super(websiteKey, websiteUrl, keycloak)
    this.user = ref(
      registering
        ? {
            email: this.email,
            is_anon: false,
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
      this.user.value.is_anon = this.email === 'anonymous@example.com'
    }
  }

  async get() {
    if (this.email && !this.registering) {
      await this.sync('GET')
    }
  }
}
