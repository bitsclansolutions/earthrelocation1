<template>
  <v-container
    id="prealerts"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="4"
      >
        <base-material-stats-card
          color="success"
          icon="mdi-file-document"
          title="Total Pre Alerts"
          :value="allNotifications.length"
        />
      </v-col>
      <v-col
        v-if="user.role !== 'admin'"
        cols="12"
        sm="6"
        lg="4"
      >
        <base-material-stats-card
          color="success"
          icon="mdi-file-document"
          title="Unread Alerts"
          :value="allNotifications.filter( k => k.opened !== 'yes').length"
        />
      </v-col>
      <v-col
        v-if="user.role === 'admin'"
        cols="12"
        sm="6"
        lg="4"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-plus"
          title="New Alert"
          :btn="true"
          :to="`${this.$route.fullPath}/add`"
        />
      </v-col>
    </v-row>

    <base-data-table
      title="Notifications"
      :head="user.role === 'admin' ? thead.admin : thead.customer"
      :body="allNotifications"
      :view="true"
      :edit="user.role === 'admin'"
      action-title="Alert"
      @deleteitem="deleteNotification"
    />
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        thead: {
          admin: [
            { text: 'ID', value: 'Id' },
            { text: 'Customer', value: 'title' },
            { text: 'Date', value: 'date' },
            { text: 'Action', value: 'actions', align: 'center' },
          ],
          customer: [
            { text: 'Alert', value: 'name', align: 'start', width: this.$vuetify.breakpoint.sm && this.$vuetify.breakpoint.xs ? '' : '70%' },
            { text: 'Date', value: 'date' },
            { text: 'Open', value: 'actions', align: 'center' },
          ],
        },
      }
    },
    computed: mapGetters(['allNotifications', 'user']),
    watch: {
      allNotifications (n) {
        this.progress = false
      },
    },
    created () {
      this.getNotification({ id: false })
    },
    methods: {
      ...mapActions(['getNotification', 'deleteNotification']),
    },
  }
</script>
