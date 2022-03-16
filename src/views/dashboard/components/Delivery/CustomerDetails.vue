<template>
  <v-row>
    <v-col
      v-for="fld in fd"
      :key="fld.name"
      cols="12"
      md="6"
    >
      <v-menu
        v-if="fld.type === 'date'"
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
            v-model="fld.value"
            :label="fld.label"
            :rules="[rules.required]"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="fld.value"
          :label="fld.label"
          class="ma-0"
          @input="datePicker = false;changeField(fld.name, fld.value)"
        />
      </v-menu>
      <v-textarea
        v-else-if="fld.type === 'textarea'"
        ref="textarea"
        v-model="fld.value"
        :items="fld.options"
        :rules="[rules.required]"
        :label="fld.label"
        @input="changeField(fld.name, fld.value)"
      />
      <vuetify-google-autocomplete
        v-else-if="fld.type === 'geo'"
        id="delcustdetails"
        v-model="fld.value"
        placeholder="Enter Address"
        :label="fld.label"
        :rules="[fld.required ? rules.required : true]"
        @placechanged="setAddressData"
        @input="changeField(fld.name, fld.value)"
      />
      <v-text-field
        v-else
        ref="textfield"
        v-model="fld.value"
        :label="fld.label"
        :rules="[ fld.req === false || rules.required]"
        @input="changeField(fld.name, fld.value)"
      />
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      fields: {
        type: Object,
        default: () => ({
          firstname: '',
          lastname: '',
          address: '',
          date: '',
          phone: '',
          phone2: '',
        }),
      },
    },
    data () {
      return {
        datePicker: false,
        fd: [
          {
            value: this.fields.firstname,
            label: 'First Name',
            name: 'firstname',
          },
          {
            value: this.fields.lastname,
            label: 'Last Name',
            name: 'lastname',
          },
          {
            value: this.fields.address,
            label: 'Delivery Address',
            name: 'address',
            type: 'geo',
          },
          {
            value: this.fields.date,
            label: 'DATE AVAILABILITY',
            name: 'date',
            type: 'date',
          },
          {
            value: this.fields.phone,
            label: 'BEST DAYTIME PHONE',
            name: 'phone',
          },
          {
            value: this.fields.phone2,
            label: 'OTHER CONTACT DETAILS',
            name: 'phone2',
            req: false,
          },
        ],
        rules: {
          required: v => !!v || 'Required',
        },
        savedData: this.fields,
      }
    },
    methods: {
      changeField (val, name) {
        this.savedData[val] = name
        this.$emit('updateField', 'customer', this.savedData)
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
      setAddressData (addressData) {
        console.log(addressData)
        if (addressData.name) this.fd[2].value = addressData.name
      },
    },
  }
</script>
