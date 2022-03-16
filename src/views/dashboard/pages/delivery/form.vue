<template>
  <v-container
    id="add-insurance"
    fluid
    tag="section"
  >
    <v-stepper
      v-model="e1"
      transition="scroll-x-transition"
    >
      <v-stepper-header>
        <div
          v-for="step in steps"
          :key="step.id"
        >
          <v-stepper-step
            editable
            :complete="e1 > step.id"
            :step="step.id"
          >
            {{ step.title }}
          </v-stepper-step>
        </div>
      </v-stepper-header>
      <v-stepper-items>
        <v-form
          ref="form"
          :disabled="isDisabled"
          @submit.stop.prevent="submitForm($event)"
        >
          <v-stepper-content step="1">
            <customer-details
              ref="moveinfo"
              :fields="fields.customer"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.moveinfo.validate() ? nextStepper(1) : 1"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="2">
            <residence-types
              ref="customerinfo"
              :fields="fields.residence"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.customerinfo.validate() ? nextStepper(2) : 2"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            <access-details
              ref="pickupinfo"
              :fields="fields.access"
              @updateField="updateFields"
            />
            <v-btn
              v-if="!isDisabled"
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="loading"
              @click="$refs.pickupinfo.validate()"
            >
              Continue
            </v-btn>
          </v-stepper-content>
        </v-form>
      </v-stepper-items>
    </v-stepper>
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
  import CustomerDetails from '../../components/Delivery/CustomerDetails'
  import ResidenceTypes from '../../components/Delivery/ResidenceType'
  import AccessDetails from '../../components/Delivery/AccessDetails'
  export default {
    components: { CustomerDetails, ResidenceTypes, AccessDetails },
    props: {
      fields: {
        type: Object,
        default: () => ({
          customer: {},
          residence: {},
          access: {},
        }),
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        e1: 1,
        menu2: false,
        steps: [
          {
            id: 1,
            title: 'CUSTOMER DETAILS',
          },
          {
            id: 2,
            title: 'TYPE OF RESIDENCE',
          },
          {
            id: 3,
            title: 'ACCESS DETAILS',
          },
        ],
        snackbar: { st: false, text: 'Updated', color: 'success' },
        savedFields: this.fields,
        loading: false,
        rules: {
          required: v => !!v || 'Required',
        },
      }
    },
    computed: {
      ...mapGetters(['deliveryAlert']),
    },
    watch: {
      deliveryAlert ({ msg, val }) {
        this.loading = false
        this.snackbar.st = true
        this.snackbar.text = msg
        if (!val) this.$router.push('/my-delivery')
      },
    },
    methods: {
      ...mapActions(['updateDelivery']),
      nextStepper (step) {
        return this.steps.find((st, i) => i + 1 > step).id
      },
      async updateFields (field, val) {
        this.savedFields[field] = val
      },
      async submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          await this.updateDelivery({ data: this.savedFields, id: this.$route.params.id || false })
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
