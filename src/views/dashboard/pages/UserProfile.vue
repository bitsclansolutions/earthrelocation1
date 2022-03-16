<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <base-material-card>
      <template #heading>
        <div
          class="display-2 font-weight-light"
        >
          {{ $route.name }}
        </div>

        <div class="subtitle-1 font-weight-light">
          Fill all required fields
        </div>
      </template>
      <v-skeleton-loader
        v-if="!userDetails.username && this.$route.name !== 'New User'"
        class="mx-auto"
        type="table"
      />
      <v-form
        v-else
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
                v-model="userDetails.first_name"
                label="First Name"
                @input="changeField('first_name', userDetails.first_name)"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="userDetails.last_name"
                label="Last Name"
                @input="changeField('last_name', userDetails.last_name)"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="userDetails.email"
                label="Email Address"
                :readonly="this.$route.name !== 'New User'"
                @input="changeField('email', userDetails.email)"
              />
            </v-col>
            <v-col
              v-if="this.$route.name === 'New User' || this.$route.name === 'Edit User'"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="password"
                append-icon="mdi-form-textbox-password"
                type="passwor'"
                label="Password"
                @click:append="generatePassword"
                @input="changeField('password', password)"
              />
            </v-col>

            <v-col
              v-else
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="userDetails.username"
                label="User Name"
                :readonly="this.$route.name !== 'New User'"
              />
            </v-col>

            <v-col cols="12">
              <vuetify-google-autocomplete
                id="map"
                v-model="userDetails.address"
                placeholder="Enter Address"
                label="Adress"
                @placechanged="getAddressData"
                @input="changeField('address', userDetails.address)"
              />
              <!-- <v-text-field
                v-model="userDetails.address"
                label="Adress"
                @input="changeField('address', userDetails.address)"
              /> -->
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="userDetails.city"
                label="City"
                @input="changeField('city', userDetails.city)"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-select
                v-model="userDetails.country"
                :items="countries"
                label="Country"
                @input="changeField('country', userDetails.country)"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="userDetails.zip"
                label="Postal Code"
                type="number"
                @input="changeField('zip', userDetails.zip)"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="userDetails.description"
                label="About Me"
                @input="changeField('description', userDetails.description)"
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
                Update Profile
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </base-material-card>
    <base-material-snackbar
      v-model="snackbar.st"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
    </base-material-snackbar>
  </v-container>
</template>

<script>
  import locals from '../../../plugins/locals'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        fname: '',
        lname: '',
        username: '',
        email: '',
        address: '',
        city: '',
        country: '',
        zip: '',
        bio: '',
        countries: locals.countries,
        snackbar: { st: false, text: 'Updated', color: 'success' },
        savedFields: {},
        loading: false,
        password: '',
        show: false,
        rules: {
          required: value => !!value || 'Required',
        },
      }
    },
    computed: {
      ...mapGetters(['userAlert', 'userDetails', 'error']),
    },
    watch: {
      userAlert ({ msg, val }, old) {
        this.loading = false
        this.snackbar.st = true
        this.snackbar.text = msg
      },
      error ({ msg, status }, old) {
        this.loading = false
        this.snackbar.st = true
        this.snackbar.text = msg
        this.snackbar.color = status ? 'error' : 'success'
      },
    },
    created () {
      if (this.$route.params.id) this.userDetail(this.$route.params.id)
      else if (this.$route.name === 'My Profile') this.myProfile()
    },
    methods: {
      ...mapActions(['updateUser', 'myProfile', 'userDetail']),
      async changeField (field, val) {
        this.savedFields[field] = val
      },
      async submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          let data = this.userDetails
          if (this.password) data = { ...data, password: this.password }
          await this.updateUser({ data, id: this.userDetails.id })
        }
      },
      getAddressData (addressData) {
        if (addressData.postal_code) this.userDetails.zip = addressData.postal_code
        if (addressData.locality) this.userDetails.city = addressData.locality
        if (addressData.country) this.userDetails.country = addressData.country
        if (addressData.country) this.userDetails.address = addressData.name
      },
      generatePassword () {
        this.password = this.createString()
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
