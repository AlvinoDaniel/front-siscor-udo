// Imports
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// VARIABLE QUE CONTIENE TODAS LAS RUTAS DEL USUARIO LOGUEADO
export const dynamicRoutes = []

export const CoreRoute = {}

const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '',
      component: () => import(
        /* webpackChunkName: "layout-[request]" */
        '@/layouts/default/Index'
      ),
      redirect: { name: 'Recibidos' },
      children: [
        {
          name: 'Documento',
          path: '/documento/:id',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/VistaDocumento/index'
          ),
          beforeEnter: (to, from, next) => {
            const ALLOWED = ['enviado', 'recibido']
            if(to.query.tab && ALLOWED.includes(to.query.tab)) {
              next()
            } else {
              next({ path: '/404' })
            }
          },
        },
        {
          name: 'Recibidos',
          path: '/recibidos',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Recibidos/index'
          ),
        },
        {
          name: 'Enviados',
          path: '/enviados',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Enviados/index'
          ),
        },
        {
          name: 'Por Corregir',
          path: '/por-corregir',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/PorCorregir/index'
          ),
        },
        {
          name: 'Borradores',
          path: '/borradores',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Borradores/index'
          ),
        },
        {
          name: 'Redactar',
          path: '/redactar/:doc(\\d+)?',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Redactar/index'
          ),
        },
        {
          name: 'Error-permission',
          path: '/403',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/AccessDenied.vue'
          ),
        },
      ],
    },
    {
      name: 'Login',
      path: '/auth/login',
      meta:{
        auth: false,
      },
      component: () => import(
        /* webpackChunkName: "views-[request]" */
        '@/views/Auth/Login'
      ),
    },
    {
      name: 'Error',
      path: '/404',
      component: () => import(
        /* webpackChunkName: "views-[request]" */
        '@/views/Error.vue'
      ),
    },
    { path: '*', redirect: '/404' },
  ],
})

const router = createRouter()

export default router

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
