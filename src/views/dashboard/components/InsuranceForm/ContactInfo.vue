<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        ref="firstName"
        v-model="field.firstName"
        label="First name"
        :readonly="disable"
        :rules="[rules.required]"
        required
        @input="changeField(field.firstName,'firstName')"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        ref="lastName"
        v-model="field.lastName"
        label="Last name"
        :readonly="disable"
        :rules="[rules.required]"
        required
        @input="changeField(field.lastName,'lastName')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <vuetify-google-autocomplete
        id="insuranceoriginadd"
        v-model="field.origAdd"
        placeholder="Enter Address"
        :readonly="disable"
        label="Origin Address"
        :rules="[rules.required]"
        @input="changeField(field.origAdd,'origAdd')"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <vuetify-google-autocomplete
        id="insurancedestadd"
        v-model="field.destAdd"
        placeholder="Enter Address"
        :readonly="disable"
        label="Destination Address"
        :rules="[rules.required]"
        @input="changeField(field.destAdd,'destAdd')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        ref="email"
        v-model="field.email"
        :readonly="disable"
        label="Email"
        :rules="[rules.required, rules.email]"
        required
        @input="changeField(field.email,'email')"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-radio-group
        ref="movingby"
        v-model="field.movingBy"
        :readonly="disable"
        label="Moving By"
        :rules="[rules.required]"
        row
        @change="changeField(field.movingBy,'movingBy')"
      >
        <v-radio
          label="Sea"
          value="sea"
        />
        <v-radio
          label="Road"
          value="road"
        />
        <v-radio
          label="Air"
          value="air"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      userData: {
        type: Object,
        default: () => ({
          firstName: '',
          lastName: '',
          email: '',
          origAdd: '',
          destAdd: '',
          movingBy: '',
        }),
      },
      firstName: {
        type: String,
        default: '',
      },
      lastName: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      origAdd: {
        type: String,
        default: '',
      },
      destAdd: {
        type: String,
        default: '',
      },
      movingBy: {
        type: String,
        default: '',
      },
      disable: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        fd: {
          fname: this.firstName,
          lname: this.lastName,
          email: this.email,
          origAdd: this.origAdd,
          destAdd: this.destAdd,
          movingBy: this.movingBy,
        },
        field: this.userData,
        rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
      }
    },
    watch: {
      userData (v) { this.field = v },
    },
    mounted(){
    },
    methods: {
      runOneTime () {
        if (this.oneTime === false) {
          if(this.$route.name === 'Add Insurance') 
          {
            setTimeout(() => this.userData.destAdd = "", 1500);
            setTimeout(() => this.userData.origAdd = "", 1500);
            
            return !this.oneTime
          }
        }
      },
      validate () {
        for (var f in this.$refs) {
          if (!this.$refs[f].validate(true)) return false
        }
        return true
      },
      changeField (val, name) {
        this.$emit('updateField', this.field, 'contact')
      },
    },
  }
</script>
