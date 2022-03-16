import store from '@/store'

const logIn = (to, from, next) => {
  if (store.getters.loggedin && to.name === 'Login') next({ name: 'Dashboard' })
  if (to.name === 'Login') return next()
  if (!store.getters.loggedin) return next({ name: 'Login' })
  next()
}

const logOut = async (to, from, next) => {
  await store.dispatch('logout')
  next({ name: 'Login' })
}

const confirmation = async ({ params }, from, next) => {
  await store.dispatch('confirmation', { user_id: params.userId, key: params.token })
  next({ name: 'Login' })
}

export default { logIn, logOut, confirmation }
