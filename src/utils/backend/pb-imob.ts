import PocketBase, { ClientResponseError, LocalAuthStore } from "pocketbase"

export interface PocketBaseError extends ClientResponseError {
  _y?: never
}

class CustomPocketBase extends PocketBase {
  rememberPath() {
    window.localStorage.setItem("pr_redirect", window.location.pathname)
  }

  replaceWithRemembered(fallback = "/home") {
    const path = window.localStorage.getItem("pr_redirect")
    window.localStorage.removeItem("pr_redirect")
    window.location.replace(path || fallback)
  }

  getRememberedRoute(fallback = "/home") {
    const path = window.localStorage.getItem("pr_redirect")
    window.localStorage.removeItem("pr_redirect")
    return path || fallback
  }

  logout() {
    this.authStore.clear()
  }

  handleError(err: PocketBaseError) {
    if (!err || !(err instanceof Error) || (err as any).isAbort) return

    const statusCode = (err as any)?.status ?? 0
    const response = (err as any)?.response || {}

    if ((response as any).message || err.message) {
      console.error(response || err.message)
    }

    if (statusCode === 401) {
      this.rememberPath()
      this.cancelAllRequests()
      return this.logout()
    }

    if (statusCode === 403) {
      this.rememberPath()
      this.cancelAllRequests()
      return window.location.replace("/imobiliaria/entrar")
    }
  }
}

// Use a distinct LocalAuthStore key so admin and imobiliária sessions don't clash
const authStore = new LocalAuthStore("pb_auth_imob")
const pbImob = new CustomPocketBase(
  import.meta.env.VITE_POCKETBASE_URL,
  authStore
)
pbImob.autoCancellation(false)

export default pbImob
