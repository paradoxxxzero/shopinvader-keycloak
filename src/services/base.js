export default class ShopinvaderService {
  constructor(websiteKey, websiteUrl, keycloak) {
    this.websiteKey = websiteKey
    this.websiteUrl = websiteUrl
    this.keycloak = keycloak
  }

  async fetch(method, service, endpoint = '', body = undefined) {
    const response = await fetch(
      this.websiteUrl.value + [service, endpoint].join('/'),
      {
        method,
        headers: {
          'Content-Type': body ? 'application/json' : undefined,
          'Website-Unique-Key': this.websiteKey.value,
          Authorization: `Bearer ${this.token}`,
          'Sess-Cart-Id':
            localStorage.getItem(`shopinvaderCart_${this.email}`) || '0',
        },
        body,
      }
    )

    if (response.status !== 200) {
      console.error('Fail to fetch', response)
      return
    }
    return await response.json()
  }

  get email() {
    return this.keycloak.tokenParsed?.email
  }

  get token() {
    return this.keycloak.token
  }
}
