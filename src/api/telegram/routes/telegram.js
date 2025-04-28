module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/telegram/allert',
     handler: 'telegram.allert',
     
     config: {
       policies: [
        // "api::telegram.auth-policy"
       ],
       auth: false,
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/telegram/sendMessage',
     handler: 'telegram.sendMessage',
     
     config: {
       policies: [
        "api::telegram.auth-policy"
       ],
       auth: false,
       middlewares: [],
     },
    },
  ],
};
