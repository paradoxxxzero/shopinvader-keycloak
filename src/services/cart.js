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
      this.cart.value = response.data ? response.data : INITIAL_CART
      return response
    }
  ) {
    const response = await this.fetch({
      service: 'cart',
      method,
      endpoint,
      body,
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
        this.cart.value = response.data
        this.keycloaks.guest.logout()
        return response
      }
    )
  }

  async get() {
    if (this.isBoth) {
      // We are transitioning from guest to auth
      await this.sync('GET')
      if (this.isEmpty) {
        return this.keycloaks.guest.logout()
      }
      return await this.transfert()
    }
    return await this.sync('GET')
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

  async clear() {
    return await this.sync('POST', 'clear')
  }

  get isEmpty() {
    return !this.cart.value.lines.items.length
  }
}
