import { ref } from 'vue'
import ShopinvaderService from './base'

const INITIAL_CART = { lines: { items: [] }, amount: { total: 0 } }

export default class CartService extends ShopinvaderService {
  constructor(keycloaks) {
    super(keycloaks)
    this.cart = ref(INITIAL_CART)
  }

  async sync(method, endpoint = '', body = undefined) {
    const response = await this.fetch(method, 'cart', endpoint, body, true)

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
  async removeItem(productId) {
    await this.sync(
      'POST',
      'delete_item',
      JSON.stringify({
        item_id: productId,
      })
    )
  }

  clear() {
    localStorage.removeItem(`shopinvaderCart_${this.email}`)
    this.cart.value = INITIAL_CART
  }
}
