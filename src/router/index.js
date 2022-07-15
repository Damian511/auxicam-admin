import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from "../views/Login.vue"
import Register from "../views/Registro.vue"
import Dashboard from "../views/Dashboard.vue"

Vue.use(VueRouter)

Vue.prototype.$base = 'htpp://localhost/auxicam-back/public/index.php/api/';

const routes = [
  {
    path: '/about',
    name: 'about',
    component: function () {
      return import('../views/AboutView.vue')
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: "/nuevoUsuario",
    name: "NuevoUsuario",
    component: function () {
      return import('../views/Registro.vue')
    },
    meta: { guestOnly: true }
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { authOnly: true }
  },
  {
    path: "/usuario",
    name: "Usuario",
    component: function () {
      return import('../views/Usuario.vue')
    },
    meta: { authOnly: true }
  },
  {
    path: "/reportes",
    name: "Reportes",
    component: function () {
      return import('../views/Reportes.vue')
    },
    meta: { authOnly: true }
  },
  {
    path: "/simcard",
    name: "SimCard",
    component: function () {
      return import('../views/SimCard.vue')
    },
    meta: { authOnly: true }
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function isLoggedIn() {
  return localStorage.getItem("auth");
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!isLoggedIn()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (isLoggedIn()) {
      next({
        path: "/dashboard",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router
