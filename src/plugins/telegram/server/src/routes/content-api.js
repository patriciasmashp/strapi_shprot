export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/fileUploadStatus',
    // name of the controller file & the method.
    handler: 'controller.getFileStatus',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/handleFile',
    // name of the controller file & the method.
    handler: 'controller.handleFile',
    config: {
      policies: [],
    },
  },

];
