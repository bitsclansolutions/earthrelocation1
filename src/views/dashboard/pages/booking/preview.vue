<template>
  <div>
    <v-form :disabled="true">
      <h3>MOVE INFORMATION</h3>
      <info-move
        id="prev-moveinfo"
        ref="prev-moveinfo"
        prefix="preview"
        :fields="fields.movedetails"
      />
      <h3>CUSTOMER INFORMATION</h3>
      <info-customer
        id="prev-customerinfo"
        ref="prev-customerinfo"
        prefix="preview"
        :fields="fields.customerdetails"
      />
      <h3>PICK UP INFORMATION</h3>
      <info-pickup
        id="prev-pickupinfo"
        ref="prev-pickupinfo"
        prefix="preview"
        :fields="fields.billingdetails"
      />
      <h3>SHIPMENT DETAILS</h3>
      <info-shipment
        id="prev-pickupinfo"
        ref="prev-pickupinfo"
        prefix="preview"
        :fields="fields.shipmentdetails"
      />
      <h3>DELIVERY INFORMATION</h3>
      <info-delivery
        id="prevdeliveryinfo"
        ref="prev-deliveryinfo"
        prefix="preview"
        :fields="fields.deliverydetails"
      />
      <h3>Comments</h3>
      <comment-section
        id="comment"
        ref="comment"
        :fields="fields.comment"
      />
      <h3>TERM AND CONDITIONS</h3>
      <tnc
        id="prev-pickupinfo"
        ref="prev-pickupinfo"
        :scroll="false"
        :inputs="fields.tnc"
        :readonly="true"
      />
    </v-form>
  </div>
</template>

<script>
  import InfoMove from '../../components/BookingForm/InfoMove'
  import infoCustomer from '../../components/BookingForm/infoCustomer'
  import infoPickup from '../../components/BookingForm/infoPickUp'
  import infoShipment from '../../components/BookingForm/infoShipment'
  import infoDelivery from '../../components/BookingForm/infoDelivery'
  import CommentSection from '../../components/BookingForm/comment'
  import Tnc from '../../components/BookingForm/tnc'
  export default {
    components: { InfoMove, infoCustomer, infoPickup, infoShipment, infoDelivery, CommentSection, Tnc },
    props: {
      allFields: {
        type: Object,
        default: () => ({
          movedetails: {},
          customerdetails: {},
          billingdetails: [{ fields: {}, additional: 'no', sameinfo: 'no' }],
        }),
      },
    },
    data () {
      return {
        fields: this.allFields,
      }
    },
    watch: {
      allFields: {
        deep: true,
        handler (val) {
          this.fields = val
        },
      },
    },
  }
</script>
