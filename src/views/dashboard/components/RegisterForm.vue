<template>
  <v-form
    ref="form"
    lazy-validation
    @submit.stop.prevent="formSubmit($event)"
  >
    <base-material-alert
      :color="alert.type"
      dark
      :value="alert.value"
    >
      {{ alert.text }}
    </base-material-alert>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="firstName"
          prepend-icon="mdi-account"
          label="First Name"
          required
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="lastName"
          prepend-icon="mdi-account"
          label="Last Name"
          required
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model="email"
      prepend-icon="mdi-email"
      :rules="rules.email"
      type="email"
      label="Email"
      required
    />
    <v-text-field
      v-model="password"
      :append-icon="psShow ? 'mdi-eye' : 'mdi-eye-off'"
      :type="psShow ? 'text' : 'password'"
      :rules="rules.password"
      prepend-icon="mdi-key-variant"
      label="Password"
      required
      @click:append="psShow = !psShow"
    />
    <v-text-field
      v-model="confirmPass"
      :append-icon="cnfShow ? 'mdi-eye' : 'mdi-eye-off'"
      :type="cnfShow ? 'text' : 'password'"
      :rules="[ v => v === password || 'Password must match' ]"
      prepend-icon="mdi-key-variant"
      label="Confirm Password"
      required
      @click:append="cnfShow = !cnfShow"
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
        Sign UP
      </v-btn>
    </v-container>
  </v-form>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data: () => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPass: '',
      loading: false,
      psShow: false,
      cnfShow: false,
      tabs: 0,
      alert: {
        value: false,
        text: 'Unable to Register',
        type: 'error',
      },
      rules: {
        email: [
          v => !!v || 'Email is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must have 8+ characters',
          v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
          v => /(?=.*\d)/.test(v) || 'Must have one number',
          v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]',
        ],
      },
    }),
    computed: mapGetters(['sendKey', 'error']),
    watch: {
      sendKey (newValue, oldValue) {
        this.loading = false
        this.alert.type = 'warning'
        this.alert.value = true
        this.alert.text = 'Please check your email for confirmation'
      },
      error ({ status, msg }) {
        if (status !== false) {
          this.loading = false
          this.alert.value = true
          this.alert.text = msg
        }
      },
    },
    methods: {
      ...mapActions(['register']),
      async formSubmit (e) {
        if (!this.$refs.form.validate()) return false
        this.loading = true
        this.alert.value = false
        const data = {
          fname: this.firstName,
          lname: this.lastName,
          email: this.email,
          password: this.password,
        }
        await this.register(data)
      },
    },
  }
</script>
