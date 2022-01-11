import { ref } from 'vue'
import ShopinvaderService from './base'

const INITIAL_CART = { lines: { items: [] } }

export default class CartService extends ShopinvaderService {
  constructor(websiteKey, websiteUrl, keycloak) {
    super(websiteKey, websiteUrl, keycloak)
    this.cart = ref(INITIAL_CART)
  }

  async sync(method, endpoint = '', body = undefined) {
    const response = await this.fetch(method, 'cart', endpoint, body)

    if (response) {
      localStorage.setItem(`shopinvaderCart_${this.email}`, response.data.id)
      this.cart.value = response.data
    }
  }

  async get() {
    if (localStorage.getItem(`shopinvaderCart_${this.email}`)) {
      await this.sync('GET')
    }
  }

  async addItem({ productId, qty }) {
    await this.sync(
      'POST',
      'add_item',
      JSON.stringify({
        product_id: productId,
        item_qty: qty,
      })
    )
  }

  clear() {
    localStorage.removeItem(`shopinvaderCart_${this.email}`)
    this.cart.value = INITIAL_CART
  }
}
