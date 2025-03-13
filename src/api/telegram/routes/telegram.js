module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/telegram/sendMessage',
     handler: 'telegram.exampleAction',
     
     config: {
       policies: [],
       auth: false,
       middlewares: [],
     },
    },
  ],
};
