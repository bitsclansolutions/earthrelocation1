<template>
  <v-form @submit.stop.prevent="formSubmit($event)">
    <base-material-alert
      color="error"
      dark
      :value="alert.value"
    >
      {{ alert.text }}
    </base-material-alert>
    <v-text-field
      v-model="username"
      prepend-icon="mdi-email"
      label="Username or Email"
      required
    />
    <v-text-field
      v-model="password"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show ? 'text' : 'password'"
      prepend-icon="mdi-key-variant"
      label="Password"
      @click:append="show = !show"
    />
    <v-container class="text-right">
      <v-btn
        color="success"
        :right="true"
        class="ma-0"
        type="submit"
        :loading="loading"
        :disabled="loading"
      >
        Login
      </v-btn>
    </v-container>
  </v-form>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data: () => ({
      username: '',
      password: '',
      loading: false,
      show: false,
      tabs: 0,
      alert: {
        value: false,
        text: 'This is error',
        type: 'error',
      },
    }),
    computed: {
      ...mapGetters(['loggedin', 'error']),
    },
    watch: {
      loggedin (newValue, oldValue) {
        if (newValue === true) {
          this.loading = true
          this.$router.push({ name: 'Dashboard' })
        }
      },
      error ({ status, msg }) {
        if (status !== false) {
          this.loading = false
          this.alert.value = true
          this.alert.text = msg
        }
      },
    },
    mounted: function () {
      this.alert.value = this.error.status
      this.alert.text = this.error.msg
      this.alert.type = this.error.status ? 'error' : 'success'
    },
    methods: {
      ...mapActions(['login']),
      async formSubmit (e) {
        this.loading = true
        this.alert.value = false
        const data = {
          username: this.username,
          password: this.password,
        }
        await this.login(data)
      },
    },
  }
</script>
