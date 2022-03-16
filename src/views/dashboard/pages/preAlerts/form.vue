<template>
  <v-container
    id="add-insurance"
    fluid
    tag="section"
  >
    <base-material-card class="px-5 py-3">
      <template #heading>
        <div class="display-2 font-weight-light">
          New Notification
        </div>
      </template>
      <v-form
        ref="form"
        @submit.stop.prevent="submitForm($event)"
      >
        <v-row>
          <v-col
            v-if="!disabled"
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="customer"
              :items="allUsers"
              item-text="name"
              item-value="Id"
              label="Select Customer"
              prepend-inner-icon="mdi-account"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeField('customer', customer)"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              ref="seaport"
              v-model="seaport"
              label="Seaport of Arrival"
              prepend-inner-icon="mdi-tag-text"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeField('seaport', seaport)"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-menu
              v-model="datePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  ref="date"
                  v-model="estarrivaldate"
                  label="Estimated Arrival Date"
                  prepend-inner-icon="mdi-calendar"
                  :rules="[rules.required]"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-if="!disabled"
                v-model="estarrivaldate"
                label="Estimated Arrival Date"
                class="ma-0"
                @input="datePicker = false;changeField('estarrivaldate', estarrivaldate)"
              />
            </v-menu>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              ref="trackingdetails"
              v-model="trackingdetails"
              label="Tracking Details"
              hint="Add Trackig Link"
              prepend-inner-icon="mdi-link-variant"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeField('trackingdetails',trackingdetails)"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              ref="container"
              v-model="container"
              prepend-inner-icon="mdi-tag-text-outline"
              label="Container #"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeField('container',container)"
            />
          </v-col>
          <v-col cols="12">
            <h2>Delivery Agent</h2>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              ref="name"
              v-model="deliveryagent.name"
              label="Name"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeDelAgent('name',deliveryagent.name)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              ref="email"
              v-model="deliveryagent.email"
              label="Email"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeDelAgent('email',deliveryagent.email)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              ref="phone"
              v-model="deliveryagent.phone"
              label="Phone"
              :readonly="disabled"
              :rules="[rules.required]"
              required
              @input="changeDelAgent('phone',deliveryagent.phone)"
            />
          </v-col>
          <v-btn
            v-if="!disabled"
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="loading"
          >
            {{ submitText }}
          </v-btn>
        </v-row>
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
  import { mapActions, mapGetters } from 'vuex'
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      fields: {
        type: Object,
        default: () => ({
          customer: '',
          seaport: '',
          estarrivaldate: '',
          trackingdetails: '',
          container: '',
          deliveryagent: {
            name: '',
            phone: '',
            email: '',
          },
        }),
      },
    },
    data () {
      return {
        e1: 1,
        datePicker: false,
        submitText: this.$route.params.id ? 'Resend' : 'Send',
        ...this.fields,
        snackbar: { st: false, text: 'Updated', color: 'success' },
        savedFields: this.fields,
        loading: false,
        rules: {
          required: v => !!v || 'Required',
        },
      }
    },
    computed: {
      ...mapGetters(['notificatioAlert', 'allUsers']),
    },
    watch: {
      notificatioAlert ({ msg, val }, old) {
        this.loading = false
        this.snackbar.st = true
        this.snackbar.text = msg
        if (!val) this.$router.push('/pre-alerts')
      },
    },
    created () {
      this.getUsers()
    },
    methods: {
      ...mapActions(['updateNotification', 'getUsers']),
      async changeDelAgent (name, val) {
        this.deliveryagent[name] = val
        this.changeField('deliveryagent', this.deliveryagent)
      },
      async changeField (field, val) {
        this.savedFields[field] = val
      },
      async submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          await this.updateNotification({ data: this.savedFields, id: this.$route.params.id || false })
        } else {
          this.snackbar.st = true
          this.snackbar.text = 'Please fill all the required field'
          this.snackbar.color = 'error'
        }
      },
    },
  }
</script>

<style lang="sass">
  .theme--light.v-label
    color: #414141
</style>
