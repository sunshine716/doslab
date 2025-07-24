module.exports = [
  {
    method: 'get',
    path: '/',              // <--- this is the default page route
    authRequired: false
  },
  {
    method: 'get',
    path: '/account',
    authRequired: false
  },
  {
    method: 'post',
    path: '/account/login',
    authRequired: false
  },
  {
    method: 'get',
    path: '/account/logout',
    authRequired: false
  },
  {
    method: 'get',
    path: '/account/profile',
    authRequired: false
  },
  {
    method: 'post',
    path: '/account/update',
    authRequired: false
  },
  
  {
    method: 'get',
    path: '/quotes',
    authRequired: true
  }
];
