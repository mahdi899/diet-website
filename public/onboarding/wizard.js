(function (root) {
  function hasPersian(value) {
    return typeof value === 'string' && /[\u0600-\u06FF]/.test(value);
  }

  function messageFromBody(body, fallback) {
    if (!body || typeof body !== 'object') return fallback;
    if (typeof body.messageFa === 'string' && body.messageFa.trim()) return body.messageFa.trim();
    if (hasPersian(body.detail)) return body.detail.trim();
    if (hasPersian(body.message)) return body.message.trim();
    return fallback;
  }

  async function messageFromResponse(response, fallback) {
    let body = {};
    try { body = await response.json(); } catch { /* HTML or empty error pages have no Persian body */ }
    return messageFromBody(body, fallback);
  }

  function text(error, fallback) {
    const name = error && error.name;
    if (name === 'TimeoutError' || name === 'AbortError') {
      return 'ارتباط طول کشید. اینترنت را بررسی کنید و دوباره تلاش کنید.';
    }
    const message = error && typeof error.message === 'string' ? error.message.trim() : '';
    if (hasPersian(message)) return message;
    if (/^Failed to fetch$|^Load failed$|^NetworkError|^Network request failed/i.test(message)) {
      return 'ارتباط با سرور برقرار نشد. اینترنت را بررسی کنید و دوباره تلاش کنید.';
    }
    return fallback;
  }

  /** How a wizard step should enter browser history. The loading screen is replaced by the specialist step. */
  function historyAction(previous, next) {
    if (!next || !next.stage) return 'ignore';
    if (previous && previous.stage === next.stage && previous.index === next.index) return 'ignore';
    if (!previous) return 'replace';
    if (next.stage === 'specialists' && previous.stage === 'preparing') return 'replace';
    return 'push';
  }

  root.mydietWizard = { messageFromBody, messageFromResponse, text, historyAction };
})(typeof window !== 'undefined' ? window : globalThis);
