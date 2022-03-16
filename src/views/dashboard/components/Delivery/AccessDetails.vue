<template>
  <v-row>
    <v-col
      v-for="fld in fd"
      :key="fld.name"
      cols="12"
    >
      <v-radio-group
        ref="radio"
        v-model="fld.value"
        :label="fld.label"
        :rules="[rules.required]"
        row
        @change="changeField(fld.name, fld.value)"
      >
        <v-radio
          v-for="(item, i) in {yes: 'Yes', no: 'No'}"
          :key="i"
          :label="item"
          :value="i"
        />
      </v-radio-group>
    </v-col>
    <v-col cols="12">
      <v-radio-group
        ref="radio"
        v-model="stairs"
        label="Do any items require delivery via stairs?"
        :rules="[rules.required]"
        row
        @change="changeField('stairs', stairs)"
      >
        <v-radio
          v-for="(item, i) in {yes: 'Yes', no: 'No'}"
          :key="i"
          :label="item"
          :value="i"
        />
      </v-radio-group>
    </v-col>
    <v-col
      v-if="stairs === 'yes'"
      cols="12"
    >
      <v-text-field
        ref="stairsdesc"
        v-model="stairsdesc"
        label="Please specify"
        @input="changeField('stairsdesc', stairsdesc)"
      />
    </v-col>
    <v-col cols="12">
      <v-radio-group
        ref="radio"
        v-model="hoa"
        label="Does your HOA have restrictions on day & time of delivery?"
        :rules="[rules.required]"
        row
        @change="changeField('hoa', hoa)"
      >
        <v-radio
          v-for="(item, i) in {yes: 'Yes', no: 'No'}"
          :key="i"
          :label="item"
          :value="i"
        />
      </v-radio-group>
    </v-col>
    <v-col
      v-if="hoa === 'yes'"
      cols="12"
    >
      <v-text-field
        ref="hoadesc"
        v-model="hoadesc"
        label="Please specify"
        @input="changeField('hoadesc', hoadesc)"
      />
    </v-col>
    <v-col
      cols="12"
    >
      <p>
        Please provide any other details on access
        difficulties to your door, especially for a
        large commercial vehicle or if house is on
        tight bend, narrow or dirt road or presence
        of low overhead cables/trees etc.
      </p>
      <v-textarea
        ref="otherdetails"
        v-model="otherdetails"
        label="Other Details"
        @input="changeField('otherdetails', otherdetails)"
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
          elevator: '',
          bulky: '',
          outside: '',
          stairs: '',
          hoa: '',
          stairsdesc: '',
          hoadesc: '',
          otherdetails: '',
        }),
      },
    },
    data () {
      return {
        publicPath: process.env.BASE_URL,
        datePicker: false,
        fd: [
          {
            value: this.fields.elevator,
            label: 'Does your building have elevator?',
            name: 'elevator',
          },
          {
            value: this.fields.bulky,
            label: 'Can the elevator accommodate bulky items?',
            name: 'bulky',
          },
          {
            value: this.fields.outside,
            label: 'Do any bulky items require outside elevator?',
            name: 'outside',
          },
        ],
        stairs: this.fields.stairs,
        hoa: this.fields.hoa,
        stairsdesc: this.fields.stairsdesc,
        hoadesc: this.fields.hoadesc,
        otherdetails: this.fields.otherdetails,
        rules: {
          required: v => !!v || 'Required',
        },
        savedData: this.fields,
      }
    },
    methods: {
      changeField (val, name) {
        this.savedData[val] = name
        this.$emit('updateField', 'access', this.savedData)
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
    },
  }
</script>
