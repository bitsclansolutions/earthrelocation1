<template>
  <v-container
    id="user-profile"
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
      />
      <base-material-card>
        <template #heading>
          <div class="display-2 font-weight-light">
            {{ $route.name }}
          </div>
        </template>
        <v-form
          ref="form"
          @submit.stop.prevent="submitForm($event)"
        >
          <v-container class="py-0">
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="fd.first_name"
                  label="First Name"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="fd.last_name"
                  label="Last Name"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="fd.email"
                  label="Email Address"
                  :rules="rules.email"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="fd.password"
                  label="Password"
                  :rules="rules.password"
                >
                  <template #append-outer>
                    <v-icon @click="generatePassword">
                      mdi-form-textbox-password
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="fd.erb"
                  label="Enter ERB"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="fd.role"
                  label="Assign Role"
                  :items="roles"
                />
              </v-col>
              <v-col
                cols="12"
                class="text-right"
              >
                <v-btn
                  color="success"
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
                  class="mr-0"
                >
                  Create User
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </base-material-card>
    </v-row>
    <base-material-snackbar
      v-model="snackbar.st"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
    </base-material-snackbar>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        fd: {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          erb: '',
          role: 'subscriber',
        },
        roles: [{ text: 'Customer', value: 'subscriber' }, { text: 'Admin', value: 'administrator' }],
        loading: false,
        snackbar: { st: false, text: 'Updated', color: 'success' },
        rules: {
          required: v => !!v || 'Required',
          email: [
            v => !!v || 'Required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
          ],
          password: [
            v => !!v || 'Required',
            v => (v && v.length >= 8) || 'Password must have 8+ characters',
            v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
            v => /(?=.*\d)/.test(v) || 'Must have one number',
            v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]',
          ],
        },
      }
    },
    computed: {
      ...mapGetters(['apiResponse']),
    },
    watch: {
      apiResponse ({ status, msg }) {
        if (status) {
          this.$router.push('/user')
        } else {
          this.snackbar.st = true
          this.snackbar.text = msg
          this.snackbar.color = 'error'
        }
        this.loading = false
      },
    },
    methods: {
      ...mapActions(['updateUser']),
      submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.updateUser({ data: this.fd })
        } else {
          this.snackbar.st = true
          this.snackbar.text = 'Please fill all the required field'
          this.snackbar.color = 'error'
        }
      },
      generatePassword () {
        this.fd.password = this.createString()
      },
      createString (upperCase = 5, numbers = 3, characters = 3, lowerCases = 5) {
        var chars = [
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // letters
          'abcdefghijklmnopqrstuvwxyz', // lowerCases
          '0123456789', // numbers
          '!@$%', // characters
        ]

        return [upperCase, numbers, characters, lowerCases].map(function (len, i) {
          return Array(len).fill(chars[i]).map(function (x) {
            return x[Math.floor(Math.random() * x.length)]
          }).join('')
        }).concat().join('').split('').sort(function () {
          return 0.5 - Math.random()
        }).join('')
      },
    },
  }
</script>
