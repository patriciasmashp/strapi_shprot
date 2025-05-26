
export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/admin/frontendError',
      handler: 'admin.logFrontendError',
    }
  ]
}