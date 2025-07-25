import PocketBase, { ClientResponseError } from "pocketbase";

export interface PocketBaseError extends ClientResponseError {
  _y?: never;
}

class CustomPocketBase extends PocketBase {
  rememberPath() {
    window.localStorage.setItem("pr_redirect", window.location.pathname);
  }

  replaceWithRemembered(fallback = "/home") {
    const path = window.localStorage.getItem("pr_redirect");
    window.localStorage.removeItem("pr_redirect");
    window.location.replace(path || fallback);
  }

  getRememberedRoute(fallback = "/home") {
    const path = window.localStorage.getItem("pr_redirect");
    window.localStorage.removeItem("pr_redirect");
    return path || fallback;
  }

  logout() {
    this.authStore.clear();
    // if (redirect) {
    //   window.location.replace("/entrar");
    // }
  }

  handleError(err: PocketBaseError) {
    if (!err || !(err instanceof Error) || err.isAbort) return;

    const statusCode = err?.status ?? 0;
    const response = err?.response || {};

    if (response.message || err.message) {
      console.error(response || err.message);
    }

    if (statusCode === 401) {
      this.rememberPath();
      this.cancelAllRequests();
      return this.logout();
    }

    if (statusCode === 403) {
      this.rememberPath();
      this.cancelAllRequests();
      return window.location.replace("/entrar");
    }
  }
}

const pb = new CustomPocketBase(import.meta.env.VITE_POCKETBASE_URL);
pb.autoCancellation(false);

export default pb;
