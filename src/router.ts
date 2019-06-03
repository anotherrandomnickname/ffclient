import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'

Vue.use(Router)

function loadView(view: any) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView('Home'),
    },
    {
      path: '/forum',
      name: 'forum',
      component: loadView('Forum'),
    },
    {
      path: '/forum/:id',
      name: 'subforum',
      component: loadView('Subforum'),
    },
    {
      path: '/forum/:fid/th-:id-:page',
      name: 'theme',
      component: loadView('Theme'),
    },
    {
      path: '/register',
      name: 'register',
      component: loadView('Register'),
    },
    {
      path: '/login',
      name: 'login',
      component: loadView('Login'),
    },
    {
      path: '/profile/users/:pk',
      name: 'profile',
      component: loadView('Profile'),
    },
    {
      path: '/profile',
      name: 'userprofile',
      component: loadView('Profile'),
    },
    {
      path: '/profile/:path',
      name: 'userprofile',
      component: loadView('Profile'),
    },
    {
      path: '/about',
      name: 'about',
      component: loadView('About'),
    },
  ],
})
