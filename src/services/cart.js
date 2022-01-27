import { ref } from 'vue'
import ShopinvaderService from './base'
import { keycloak } from 'keycloak-js'

const INITIAL_CART = { lines: { items: [] }, amount: { total: 0 } }

export default class CartService extends ShopinvaderService {
  constructor(keycloaks) {
    super(keycloaks)
    this.cart = ref(INITIAL_CART)
  }

  async sync(
    method,
    endpoint = '',
    body = undefined,
    onSuccess = response => {
      localStorage.setItem(`shopinvaderCart_${this.email}`, response.data.id)
      this.cart.value = response.data
      return response
    }
  ) {
    const response = await this.fetch({
      service: 'cart',
      method,
      endpoint,
      body,

      headers: {
        'Sess-Cart-Id':
          localStorage.getItem(`shopinvaderCart_${this.email}`) || '0',
      },
      allowAnonymous: true,
    })

    if (response) {
      return onSuccess(response)
    }
    return response
  }
  async transfert() {
    return await this.sync(
      'POST',
      'transfert',
      {
        token: this.keycloaks.auth.token,
      },
      response => {
        localStorage.removeItem(`shopinvaderCart_${this.email}`)
        localStorage.setItem(
          `shopinvaderCart_${this.keycloaks.auth.tokenParsed.email}`,
          response.data.id
        )
        this.cart.value = response.data
        this.keycloaks.guest.logout()
        return response
      }
    )
  }

  async get() {
    if (this.isBoth) {
      // We are transitioning from guest to auth
      return await this.transfert()
    }
    if (localStorage.getItem(`shopinvaderCart_${this.email}`)) {
      return await this.sync('GET')
    }
  }

  async addItem({ productId, qty }) {
    return await this.sync('POST', 'add_item', {
      product_id: productId,
      item_qty: qty,
    })
  }
  async removeItem(productId) {
    return await this.sync('POST', 'delete_item', {
      item_id: productId,
    })
  }

  clear() {
    localStorage.removeItem(`shopinvaderCart_${this.email}`)
    this.cart.value = INITIAL_CART
  }
}
