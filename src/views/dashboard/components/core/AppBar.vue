<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-menu
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />
    <v-btn
      class="ml-2"
      min-width="0"
      text
      @click="$vuetify.theme.dark = !$store.state.darkMode;$store.commit('SET_THEME',!$store.state.darkMode)"
    >
      <v-icon>mdi-brightness-6</v-icon>
    </v-btn>
    <v-btn
      v-if="user.role !== 'admin'"
      class="ml-2"
      min-width="0"
      to="/pre-alerts"
      text
    >
      <v-badge
        color="red"
        overlap
        bordered
      >
        <template #badge>
          <span>{{ allNotifications.filter( k => k.opened !== 'yes').length }}</span>
        </template>

        <v-icon>mdi-bell</v-icon>
      </v-badge>
    </v-btn>
    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/my-profile"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  // Utilities
  import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      notifications: [],
    }),

    computed: {
      ...mapState(['drawer']),
      ...mapGetters(['user', 'allNotifications']),
    },

    created () {
      this.$vuetify.theme.dark = this.$store.state.darkMode
      this.getNotification({ id: false })
    },

    methods: {
      darkMode () {
      },
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      ...mapActions(['getNotification']),
    },
  }
</script>
