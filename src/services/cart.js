import { ref } from 'vue'
import ShopinvaderService from './base'
import { keycloak } from 'keycloak-js'
import CustomerService from './customer'

const INITIAL_CART = { lines: { items: [] }, amount: { total: 0 } }

export default class CartService extends ShopinvaderService {
  constructor(keycloaks, customerService) {
    super(keycloaks)
    this.cart = ref(INITIAL_CART)
    this.customerService = customerService
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
      return await onSuccess(response)
    }
    return response
  }

  async transfer() {
    // This request must be done with guest token
    return await this.sync(
      'POST',
      'transfer',
      {
        token: this.keycloaks.user.token,
      },
      async response => {
        this.cart.value = response.data
        await this.customerService.logout('guest')
        return response
      }
    )
  }

  async get() {
    if (this.isBoth) {
      // We are transitioning from guest to user
      await this.sync('GET')
      if (this.isEmpty) {
        await this.customerService.logout('guest')
      } else {
        return await this.transfer()
      }
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
