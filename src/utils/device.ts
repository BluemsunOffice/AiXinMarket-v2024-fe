export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any: function () {
    return isMobile.Android() || isMobile.iOS() || isMobile.Windows()
  },
}

export const getClientId = () => {
  return isMobile.any() ? import.meta.env.VITE_MOBILE_CLIENT_ID : import.meta.env.VITE_WEB_CLIENT_ID
}
