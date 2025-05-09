module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'PUT',
        path: '/masters/:id/statistic', 
        handler: 'master.updateStatistic',
        // config: {
        //   auth: (params) => {
        //     console.log(params);
            
        //     return {
        //       mode: 'optional',
        //       strategy: 'jwt',
        //     }
        //   }
        // }
      },
    ]
  }