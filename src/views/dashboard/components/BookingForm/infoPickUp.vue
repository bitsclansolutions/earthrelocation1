<template>
  <v-container>
    <v-row
      v-for="(info, item) in items"
      :key="item"
    >
      <pickup-form
        v-model="info.fields"
        :fields="info.fields"
        :prefix="prefix"
        :customerror="customerror"
        @updateField="info.fields = $event;updateField(info,item)"
      />
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          ref="radio"
          v-model="info.additional"
          label="Need additional pickup?"
          :rules="[rules.required]"
          row
          @change="updateField(info,item)"
        >
          <v-radio
            v-for="(radio, i) in {yes: 'Yes', no: 'No'}"
            :key="i"
            :label="radio"
            :value="i"
          />
        </v-radio-group>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          ref="radio"
          v-model="info.sameinfo"
          label="Is your billing information same as customer information?"
          :rules="[rules.required]"
          row
          @change="updateField(info,item)"
        >
          <v-radio
            v-for="(radio, i) in {yes: 'Yes', no: 'No'}"
            :key="i"
            :label="radio"
            :value="i"
          />
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import pickupForm from './pickupForm'
  export default {
    components: { pickupForm },
    props: {
      fields: {
        type: [Array, Object],
        default: () => [{ fields: {}, additional: 'no', sameinfo: 'no' }],
      },
      prefix: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        datePicker: false,
        items: this.fields,
        additional: '',
        rules: {
          required: v => !!v || 'Required',
        },
        customerror:{
          customClassstreetadd:false,
          customClasscity:false,
          customClasszip:false,
          customClasscountry:false,
          customClassstate:false,

        },
        savedData: this.fields,
      }
    },
    watch: {
      fields: {
        deep: true,
        handler (v) { this.items = v },
      },
      customerror: {
        handler(val){
          this.customerror=val
        },
        deep: true
      }
    },
    methods: {
      updatePickupCount (inc, i = 0) {
        if (!inc) {
          this.items.splice(i, 1)
        } else {
          this.items.push({ fields: {}, additional: 'no' })
        }
      },
      updateField (ind, val) {
        this.changeField(val, ind)
      },
      changeField (val, name) {
        this.$set(this.savedData, name, val)
        this.$emit('updateField', this.savedData, 'billingdetails')
      },
      validate () {
          this.customerror.customClassstreetadd=false
          this.customerror.customClasscity=false
          this.customerror.customClasszip=false
          this.customerror.customClasscountry=false
          this.customerror.customClassstate=false
        if(this.fields[0].fields.streetadd && this.fields[0].fields.city && this.fields[0].fields.country && this.fields[0].fields.state && this.fields[0].fields.zip){
          return this.inpValidate(this.$refs)
        }
        if(!this.fields[0].fields.streetadd){
          this.customerror.customClassstreetadd = true
        }else if(!this.fields[0].fields.city){
          this.customerror.customClasscity = true
        }else if(!this.fields[0].fields.state){
          this.customerror.customClassstate = true
        }else if(!this.fields[0].fields.zip){
          this.customerror.customClasszip = true
        }else if(!this.fields[0].fields.country){
          this.customerror.customClasscountry = true
        }
      },
    },
  }
</script>
