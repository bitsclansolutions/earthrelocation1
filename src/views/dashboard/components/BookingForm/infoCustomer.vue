<template>
  <v-row>
    <v-col
      v-for="fld in fd"
      :key="fld.name"
      cols="12"
      md="6"
    >
      <v-select
        v-if="fld.type === 'select'"
        :ref="`${prefix}select`"
        v-model="fld.value"
        :items="fld.options"
        :rules="[fld.required ? rules.required : true]"
        :label="fld.label"
        @input="changeField(fld.value, fld.name)"
        @change="changeField(fld.value, fld.name)"
      />
      <vuetify-google-autocomplete
        v-else-if="fld.type === 'geo'"
        :id="`${prefix}customermap`"
        v-model="fld.value"
        :class="{customerror : customClass}"
        placeholder="Enter Address"
        :label="fld.label"
        :rules="[fld.required ? rules.required : true]"
        @placechanged="getAddressData"
        @input="changeField(fld.value, fld.name)"
      />
      <v-text-field
        v-else
        :ref="`${prefix}textfield`"
        v-model="fld.value"
        :label="fld.label"
        :rules="[fld.required ? rules.required : true]"
        @input="changeField(fld.value, fld.name)"
        @change="changeField(fld.value, fld.name)"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        ref="phone1"
        v-model="phone"
        label="Phone 1"
        :rules="[rules.required]"
        @input="changeField(phone, 'phone')"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        ref="phone2"
        v-model="phone2"
        label="Phone 2"
        @input="changeField(phone2, 'phone2')"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        ref="phone3"
        v-model="phone3"
        label="Phone 3"
        @input="changeField(phone3, 'phone3')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        ref="email"
        v-model="email"
        label="Primary Email ID"
        :rules="[rules.required]"
        @input="changeField(email, 'email')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        ref="email2"
        v-model="email2"
        label="Secondary Email ID"
        @input="changeField(email2, 'email2')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-select
        ref="officialid"
        v-model="officialid"
        :items="officalId"
        :rules="[rules.required]"
        label="Official ID"
        @input="changeField(officialid, 'officialid')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        v-if="officialid === 'EIN Tax ID'"
        ref="taxid"
        v-model="taxid"
        label="EIN Tax ID"
        :rules="[rules.required]"
        @input="changeField(taxid, 'taxid')"
      />
      <v-text-field
        v-if="officialid === 'Passport Number'"
        ref="passport"
        v-model="passport"
        label="Passport Number"
        :rules="[rules.required]"
        @input="changeField(passport, 'passport')"
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
          officalid: '',
          taxid: '',
          passport: '',
        }),
      },
      prefix: {
        type: String,
        default: '',
      },
      update: {
        type: [Number, String, Boolean],
        default: '',
      },
    },
    data () {
      return {
        datePicker: false,
        test: 'as',
        fd: this.assignFields(),
        phone: this.fields.phone,
        phone2: this.fields.phone2,
        phone3: this.fields.phone3,
        email: this.fields.email,
        email2: this.fields.email2,
        officialid: this.fields.officialid,
        taxid: this.fields.taxid,
        passport: this.fields.passport,
        officalId: ['EIN Tax ID', 'Passport Number'],
        rules: {
          required: v => !!v || 'Required',
        },
        savedData: this.fields,
        customClass:false
      }
    },
    watch: {
      fields: {
        deep: true,
        handler (v) {
          this.fd = this.assignFields()
          this.phone = v.phone
          this.phone2 = v.phone2
          this.phone3 = v.phone3
          this.email = v.email
          this.email2 = v.email2
          this.officialid = v.officialid
          this.taxid = v.taxid
          this.passport = v.passport
        },
      },
    },
    methods: {
      assignFields () {
        return [
          {
            value: this.fields.firstname,
            label: 'First Name',
            name: 'firstname',
            required: true,
          },
          {
            value: this.fields.lastname,
            label: 'Last Name',
            name: 'lastname',
            required: true,
          },
          {
            value: this.fields.streetadd,
            label: 'Street Address',
            type: 'geo',
            name: 'streetadd',
            required: true,
          },
          {
            value: this.fields.address2,
            label: 'Address Line 2',
            required: false,
            name: 'address2',
          },
          {
            value: this.fields.city,
            label: 'City',
            name: 'city',
            required: true,
          },
          {
            value: this.fields.state,
            label: 'State / Province / Region',
            name: 'state',
            required: true,
          },
          {
            value: this.fields.zip,
            label: 'Zip / Postal Code',
            name: 'zip',
            required: true,
          },
          {
            value: this.fields.country,
            label: 'Country',
            name: 'country',
            type: 'select',
            required: true,
            options: locals.countries,
          },
        ]
      },
      changeField (val, name) {
        this.$set(this.savedData, name, val)
        this.$emit('updateField', this.savedData, 'customerdetails')
      },
      updateFields () {
      },
      validate () {
        this.customClass = false
        if(this.fields.firstname && this.fields.lastname){
          if(this.fields.streetadd === ''){
            this.customClass = true
          }
        }
        if(this.customClass === false){
        return this.inpValidate(this.$refs)
        }
      },
      fieldData () {
      },
      getAddressData (addressData) {
        if (addressData.postal_code) this.$set(this.savedData, 'zip', addressData.postal_code)
        if (addressData.country) this.$set(this.savedData, 'country', addressData.country)
        if (addressData.administrative_area_level_1) this.$set(this.savedData, 'state', addressData.administrative_area_level_1)
        if (addressData.locality) this.$set(this.savedData, 'city', addressData.locality)
        if (addressData.name) this.$set(this.savedData, 'address2', addressData.name)
      },
    },
  }
</script>
<style>
.customerror div div div label{
  color: red !important;
}

</style>