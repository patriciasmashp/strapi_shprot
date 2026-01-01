
export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/vk/vkEvent',
      handler: 'token-vk.handleVkEvent',
      config: {
        auth: false,
      }
    }
  ]
}