<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-radio-group
        ref="isDeliverAdd"
        v-model="isDelivery"
        label="Do you have a delivery address available?"
        row
        @change="updateField(isDelivery, 'isDelivery')"
      >
        <v-radio
          label="Yes"
          value="yes"
        />
        <v-radio
          label="No"
          value="no"
        />
      </v-radio-group>
    </v-col>
    <v-col
      v-for="fld in fd.filter( i => 'yes' === isDelivery)"
      :key="fld.name"
      cols="12"
      md="6"
    >
      <v-select
        v-if="fld.type && (fld.type === 'select')"
        ref="select"
        v-model="fld.value"
        :items="fld.options"
        :rules="[fld.required === true ? rules.required : true]"
        :label="fld.label"
        @input="changeField(fld.value, fld.name)"
      />
      <vuetify-google-autocomplete
        v-else-if="fld.type === 'geo'"
        :id="`${prefix}delivery`"
        v-model="fld.value"
        placeholder="Enter Address"
        :label="fld.label"
        :rules="[fld.required === true ? rules.required : true]"
        @placechanged="getAddressData"
        @input="changeField(fld.value, fld.name)"
      />
      <v-text-field
        v-else
        ref="text"
        v-model="fld.value"
        :label="fld.label"
        :rules="[fld.required === true ? rules.required : true]"
        @input="changeField(fld.value, fld.name)"
      />
    </v-col>
  </v-row>
</template>

<script>
  import locals from '../../../../plugins/locals'
  export default {
    props: {
      fields: {
        default: () => ({
          isDelivery: 'no',
          deliveryAddress: {},
        }),
      },
      prefix: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        fd: this.setFields(),
        isDelivery: this.fields.isDelivery==='yes' ? 'yes' : 'no',
        rules: {
          required: v => !!v || 'Required',
        },
        savedData: this.fields,
      }
    },
    watch: {
      fields: {
        deep: true,
        handler (v) {
          this.isDelivery = v.isDelivery
          this.fd = this.setFields()
        },
      },
    },
    methods: {
      setFields () {
        return [
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.type : '',
            label: 'Types of Delivery Location',
            name: 'type',
            type: 'select',
            required: true,
            options: ['Residential', 'Commercial'],
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.firstName : '',
            label: 'First Name',
            name: 'firstName',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.lastName : '',
            label: 'Last Name',
            name: 'lastName',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.address : '',
            label: 'Street Address',
            type: 'geo',
            name: 'address',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.address2 : '',
            label: 'Address Line 2',
            name: 'address2',
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.city : '',
            label: 'City',
            name: 'city',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.state : '',
            label: 'State / Province / Region',
            name: 'state',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.zip : '',
            label: 'ZIP / Postal Code',
            name: 'zip',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.country : '',
            label: 'Country',
            name: 'country',
            type: 'select',
            options: locals.countries,
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.phone : '',
            label: 'Phone 1 (Mobile)',
            name: 'phone',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.phoneWork : '',
            label: 'Phone 1 (Work)',
            name: 'phoneWork',
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.phoneHome : '',
            label: 'Phone 1 (Home)',
            name: 'phoneHome',
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.email : '',
            label: 'Primary Email ID',
            name: 'email',
            required: true,
          },
          {
            value: this.fields.deliveryAddress ? this.fields.deliveryAddress.secondaryEmail : '',
            label: 'Secondary Email ID',
            name: 'secondaryEmail',
          },
        ]
      },
      changeField (val, name) {
        this.$set(this.fields.deliveryAddress, name, val)
        this.updateField(this.fields.deliveryAddress, 'deliveryAddress')
      },
      updateField (val, name) {
        this.$set(this.savedData, name, val)
        this.$emit('updateField', this.savedData, 'deliverydetails')
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
      getAddressData (addressData) {
        if (addressData.postal_code) this.$set(this.fields.deliveryAddress, 'zip', addressData.postal_code)
        if (addressData.country) this.$set(this.fields.deliveryAddress, 'country', addressData.country)
        if (addressData.administrative_area_level_1) this.$set(this.fields.deliveryAddress, 'state', addressData.administrative_area_level_1)
        if (addressData.locality) this.$set(this.fields.deliveryAddress, 'city', addressData.locality)
        if (addressData.name) this.$set(this.fields.deliveryAddress, 'address2', addressData.name)
      },
    },
  }
</script>
