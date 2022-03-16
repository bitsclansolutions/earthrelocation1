<template>
  <v-row>
    <v-col
      v-for="fld in flds"
      :key="fld.name"
      cols="12"
      md="6"
    >
      <v-select
        v-if="fld.type === 'select'"
        :ref="`${prefix}select`"
        v-model="fld.value"
        :class="{ pickupError : fld.class }"
        :items="fld.options"
        :rules="[rules.required]"
        :label="fld.label"
        @input="changeField(fld.value, fld.name)"
      />
      <vuetify-google-autocomplete
        v-else-if="fld.type === 'geo'"
        :id="`${prefix}pickupmap`"
        :class="{pickupError : fld.class}"
        :ref="`${prefix}pickuomap`"
        v-model="fld.value"
        placeholder="Enter Address"
        :label="fld.label"
        :rules="[fld.required ? rules.required : true]"
        @placechanged="setAddressData"
        @input="changeField(fld.value, fld.name)"
      />
      <v-text-field
        v-else
        :ref="`${prefix}textfield`"
        :class="{pickupError : fld.class}"
        v-model="fld.value"
        :label="fld.label"
        :rules="[rules.required]"
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
        type: Object,
        default: () => ({
          firstname: '',
          lastname: '',
          streetadd: '',
          address2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          phone: '',
          phone2: '',
          phone3: '',
          email: '',
          email2: '',
        }),
      },
      customerror:{
        type: Object,
        default: () => ({
          customClassstreetadd:false,
          customClasscity:false,
          customClasszip:false,
          customClasscountry:false,
          customClassstate:false,
        }),
      },
      prefix: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        datePicker: false,
        items: 1,
        flds: this.assignFields(),
        rules: {
          required: v => !!v || 'Required',
        },
        savedData: this.fields,
        puaddress:true,
        pucity:false,
        pustate:false,
        puzip:false,

        
      }
    },
    watch: {
      fields: {
        deep: true,
        handler (v) { this.flds = this.assignFields() },
      },
      customerror: {
        handler(val){
          this.customerror=val
          this.flds = this.assignFields()
        },
        deep: true
      }
    },
    methods: {
      assignFields () {
        return [
          {
            value: this.fields.streetadd,
            label: 'Street Address',
            name: 'streetadd',
            type: 'geo',
            required: true,
            class:this.customerror.customClassstreetadd

          },
          {
            value: this.fields.address2,
            label: 'Address Line 2',
            name: 'address2',
          },
          {
            value: this.fields.city,
            label: 'City',
            name: 'city',
            required: true,
            class:this.customerror.customClasscity


          },
          {
            value: this.fields.state,
            label: 'State / Province / Region',
            name: 'state',
            required: true,
            class:this.customerror.customClassstate
          },
          {
            value: this.fields.zip,
            label: 'Zip / Postal Code',
            name: 'zip',
            required: true,
            class:this.customerror.customClasszip
          },
          {
            value: this.fields.country,
            label: 'Country',
            name: 'country',
            type: 'select',
            required: true,
            options: locals.countries,
            class:this.customerror.customClasscountry
          },
        ]
      },
      changeField (val, name) {
        this.$set(this.savedData, name, val)
        this.$emit('updateField', this.savedData)
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
      setAddressData (addressData) {
        if (addressData.postal_code) this.$set(this.savedData, 'zip', addressData.postal_code)
        if (addressData.country) this.$set(this.savedData, 'country', addressData.country)
        if (addressData.administrative_area_level_1) this.$set(this.savedData, 'state', addressData.administrative_area_level_1)
        if (addressData.locality) this.$set(this.savedData, 'city', addressData.locality)
        if (addressData.name) this.$set(this.savedData, 'address2', addressData.name)
      },
    },
  }
</script>
<style >
.pickupError div div div label{
  color: red !important;
}
</style>