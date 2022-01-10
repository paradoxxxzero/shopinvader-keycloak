import { ref } from 'vue'

const INITIAL_CART = { lines: { items: [] } }

export default class CartService {
  constructor(websiteKey, websiteUrl, token, email) {
    this.cart = ref(INITIAL_CART)
    this.websiteKey = websiteKey
    this.websiteUrl = websiteUrl
    this.token = token
    this.email = email
  }

  async fetch(method, endpoint = '', body = undefined) {
    const response = await fetch(this.websiteUrl.value + 'cart/' + endpoint, {
      method,
      headers: {
        'Content-Type': body ? 'application/json' : undefined,
        'Website-Unique-Key': this.websiteKey.value,
        Authorization: `Bearer ${this.token}`,
        'Sess-Cart-Id':
          localStorage.getItem(`shopinvaderCart_${this.email}`) || '0',
      },
      body,
    })

    if (response.status !== 200) {
      console.error('Fail to fetch cart', response)
    } else {
      const json = await response.json()
      localStorage.setItem(`shopinvaderCart_${this.email}`, json.data.id)
      this.cart.value = json.data
    }
  }

  async get() {
    if (localStorage.getItem(`shopinvaderCart_${this.email}`)) {
      await this.fetch('GET')
    }
  }

  async addItem({ productId, qty }) {
    await this.fetch(
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
