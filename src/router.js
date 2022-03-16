import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '@/middleware'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
          beforeEnter: auth.logIn,
        },
        // Pages
        {
          name: 'My Profile',
          path: 'my-profile',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'My Documents',
          path: '/my-documents',
          component: () => import('@/views/dashboard/pages/documents'),
          beforeEnter: auth.logIn,
        },
        // Booking
        {
          name: 'My Bookings',
          path: '/my-bookings',
          component: () => import('@/views/dashboard/pages/booking'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'New Booking',
          path: 'my-bookings/add',
          component: () => import('@/views/dashboard/pages/booking/add'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Edit Booking',
          path: 'my-bookings/edit/:id',
          component: () => import('@/views/dashboard/pages/booking/edit'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'View Booking',
          path: 'my-bookings/:id',
          component: () => import('@/views/dashboard/pages/booking/view'),
          beforeEnter: auth.logIn,
        },
        // Insurace
        {
          name: 'My Insurance',
          path: 'my-insurance',
          component: () => import('@/views/dashboard/pages/insurance'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Add Insurance',
          path: 'my-insurance/add',
          component: () => import('@/views/dashboard/pages/insurance/add'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Edit Insurance',
          path: 'my-insurance/edit/:id',
          component: () => import('@/views/dashboard/pages/insurance/edit'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'PDF Insurance',
          path: 'my-insurance/pdf',
          component: () => import('@/views/dashboard/pages/insurance/pdf'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'View Insurance',
          path: 'my-insurance/:id',
          component: () => import('@/views/dashboard/pages/insurance/single'),
          beforeEnter: auth.logIn,
        },
        // Delivery and Access
        {
          name: 'My Delivery and Access',
          path: 'my-delivery',
          component: () => import('@/views/dashboard/pages/delivery'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'New Delivery',
          path: 'my-delivery/add',
          component: () => import('@/views/dashboard/pages/delivery/add'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Edit Delivery',
          path: 'my-delivery/edit/:id',
          component: () => import('@/views/dashboard/pages/delivery/edit'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'View Delivery',
          path: 'my-delivery/:id',
          component: () => import('@/views/dashboard/pages/delivery/single'),
          beforeEnter: auth.logIn,
        },

        // Documents
        {
          name: 'My Document',
          path: 'document',
          component: () => import('@/views/dashboard/pages/document'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'New Document',
          path: 'document/add',
          component: () => import('@/views/dashboard/pages/document/add'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Edit Document',
          path: 'document/edit/:id',
          component: () => import('@/views/dashboard/pages/document/edit'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'View Document',
          path: 'document/:id',
          component: () => import('@/views/dashboard/pages/document/single'),
          beforeEnter: auth.logIn,
        },
        // PreAlerts
        {
          name: 'Pre Alerts',
          path: 'pre-alerts',
          component: () => import('@/views/dashboard/pages/preAlerts'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'New Alert',
          path: 'pre-alerts/add',
          component: () => import('@/views/dashboard/pages/preAlerts/add'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Edit Alert',
          path: 'pre-alerts/edit/:id',
          component: () => import('@/views/dashboard/pages/preAlerts/edit'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'View Alert',
          path: 'pre-alerts/:id',
          component: () => import('@/views/dashboard/pages/preAlerts/view'),
          beforeEnter: auth.logIn,
        },

        // User List
        {
          name: 'User List',
          path: 'user',
          component: () => import('@/views/dashboard/pages/User/index'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'New User',
          path: 'user/add',
          component: () => import('@/views/dashboard/pages/User/add'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'View User',
          path: 'user/:id',
          component: () => import('@/views/dashboard/pages/User/view'),
          beforeEnter: auth.logIn,
        },
        {
          name: 'Edit User',
          path: 'user/edit/:id',
          component: () => import('@/views/dashboard/pages/UserProfile.vue'),
          beforeEnter: auth.logIn,
        },
        // Logout
        {
          name: 'Logout',
          path: 'logout',
          beforeEnter: auth.logOut,
        },
        // Login
        {
          name: 'Email Confirmation',
          path: '/login/confirm/:userId/:token',
          beforeEnter: auth.confirmation,
        },
        {
          name: 'Login',
          path: '/login',
          component: () => import('@/views/login'),
          beforeEnter: auth.logIn,
        },
      ],
    },
  ],
})
