<template>
  <v-app>
    <dashboard-core-app-bar v-if="loggedin" />

    <dashboard-core-drawer v-if="loggedin" />

    <dashboard-core-view />
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data () {
      return {
        expandOnHover: false,
      }
    },
    computed: mapGetters(['loggedin']),
  }
</script>
