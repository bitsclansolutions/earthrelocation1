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
            <info-move
              id="moveinfo"
              ref="moveinfo"
              :fields="formFields.movedetails"
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
            <info-customer
              id="customerinfo"
              ref="customerinfo"
              :fields="formFields.customerdetails"
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
            <info-pickup
              id="form-pickupinfo"
              ref="pickupinfo"
              :fields="formFields.billingdetails"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.pickupinfo.validate() ? nextStepper(3) : 3"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="4">
            <info-shipment
              id="shipmentinfo"
              ref="shipmentinfo"
              :fields="formFields.shipmentdetails"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.shipmentinfo.validate() ? nextStepper(4) : 4"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="5">
            <info-delivery
              id="deliveryinfo"
              ref="deliveryinfo"
              :fields="formFields.deliverydetails"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.deliveryinfo.validate() ? nextStepper(5) : 5"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="6">
            <comment-section
              id="comment"
              ref="comment"
              :fields="formFields.comment"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.comment.validate() ? nextStepper(6) : 6"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="7">
            <tnc
              id="tnc"
              ref="tnc"
              :inputs="formFields.tnc"
              :is-open="e1 === 7"
              @updateField="updateFields"
            />
            <v-btn
              color="primary"
              @click="e1 = $refs.tnc.validate() ? nextStepper(7) : 7"
            >
              {{ isDisabled ? 'Next' : 'Continue' }}
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="8">
            <preview
              :all-fields="formFields"
            />
            <v-btn
              v-if="!isDisabled"
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="loading"
            >
              Submit
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
  import InfoMove from '../../components/BookingForm/InfoMove'
  import infoCustomer from '../../components/BookingForm/infoCustomer'
  import infoPickup from '../../components/BookingForm/infoPickUp'
  import infoShipment from '../../components/BookingForm/infoShipment'
  import infoDelivery from '../../components/BookingForm/infoDelivery'
  import CommentSection from '../../components/BookingForm/comment'
  import Tnc from '../../components/BookingForm/tnc'
  import Preview from './preview'
  export default {
    components: { InfoMove, infoCustomer, infoPickup, infoShipment, infoDelivery, CommentSection, Tnc, Preview },
    props: {
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        e1: 1,
        steps: [
          {
            id: 1,
            title: 'Move Information',
          },
          {
            id: 2,
            title: 'CustomerInformation',
          },
          {
            id: 3,
            title: 'Pick Up Information',
          },
          {
            id: 4,
            title: 'Shipment Details',
          },
          {
            id: 5,
            title: 'Delivery',
          },
          {
            id: 6,
            title: 'Comments',
          },
          {
            id: 7,
            title: 'T&C',
          },
          {
            id: 8,
            title: 'Preview',
          },
        ],
        snackbar: { st: false, text: 'Updated', color: 'green' },
        loading: false,
        rules: {
          required: value => !!value || 'Required',
        },
      }
    },
    computed: {
      ...mapGetters(['bookAlert']),
      ...mapGetters({
        formFields: 'booking',
      }),
      // RouteName() {
      //   if(this.$route.name === 'New Booking') 
      //     this.$refs.form.reset()
      // }
    },
    mounted(){
      this.RouteName()
    },
    watch: {
      bookAlert ({ msg, val }) {
        this.loading = false
        this.snackbar.st = true
        this.snackbar.text = msg
        if (!val) this.$router.push('/my-bookings')
      },
    },
    methods: {
      ...mapActions(['updateBooking']),
      nextStepper (step) {
        return this.steps.find((st, i) => i + 1 > step).id
      },
      RouteName() {
        if(this.$route.name === 'New Booking') 
          this.$refs.form.reset()
      },
      async updateFields (val, field) {
        // console.log(val , field , '<= boat')
        const sections = this.formFields || {}
        this.$set(sections, field, val)
        this.$store.commit('BOOKING_UPDATE_SECTIONS', sections)
      },
      async submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          await this.updateBooking({ data: this.formFields, id: this.$route.params.id || false })
        }else{
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
