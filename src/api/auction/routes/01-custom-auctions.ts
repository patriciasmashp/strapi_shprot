
export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'PUT',
      path: '/auctions/:id/setMasterResponse',
      handler: 'auction.setMasterResponse',
    },
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/auctions/notifyMasterSelectedByClient',
      handler: 'auction.notifyMasterSelectedByClient',
    }
  ]
}