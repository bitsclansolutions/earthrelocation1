<template>
  <v-row>
    <v-col
      v-for="fields in textFields"
      :key="fields.name"
      cols="12"
      md="6"
    >
      <v-text-field
      v-if="fields.type === 'text'"
        v-model="fields.value"
        :label="fields.label"
        required
        @input="updateFields(fields.name,fields.value)"
      />
      <v-radio-group
      v-if="fields.type === 'radio'"
        ref="isDeliverAdd"
        v-model="fields.value"
        :label="fields.label"
        required
        row
        @change="updateFields(fields.name, fields.value)"
      >
        <v-radio
          label="On a Trailer"
          value="trailer"
        />
        <v-radio
          label="On a Cradle"
          value="cradle"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      inputs: {
        type: [Object, Array],
        default: () => {},
      },
    },
    data () {
      return {
        menu2: false,
        date: '',
        aaa:'',
        fdVals: {},
        textFields: this.getTextFields(),
      }
    },
    watch: {
      inputs: {
        deep: true,
        handler () {
          this.textFields = this.getTextFields()
        },
      },
    },
    methods: {
      getTextFields () {
        return [
          {
            value: this.inputs.year,
            label: 'Year',
            name: 'year',
            type: 'text'
          },
          {
            value: this.inputs.make,
            label: 'Make',
            name: 'make',
            type: 'text'
          },
          {
            value: this.inputs.model,
            label: 'Model',
            name: 'model',
            type: 'text'
          },
          {
            value: this.inputs.trailerVin,
            label: 'Trailer VIN #',
            name: 'trailerVin',
            type: 'text'
          },
          {
            value: this.inputs.boatVin,
            label: 'Boat HULL #',
            name: 'boatVin',
            type: 'text'
          },
          {
            value: this.inputs.length,
            label: 'Length(ft)',
            name: 'length',
            type: 'text'
          },
          {
            value: this.inputs.width,
            label: 'Width(ft)',
            name: 'width',
            type: 'text'
          },
          {
            value: this.inputs.height,
            label: 'Height(ft)',
            name: 'height',
            type: 'text'
          },
          {
            value: this.inputs.weight,
            label: 'Weight',
            name: 'weight',
            type: 'text'
          },
          {
            value: this.inputs.boatPresented,
            label: 'How is Boat presented :',
            name: 'boatPresented',
            type: 'radio'
          },
        ]
      },
      updateFields (name, val) {
        // console.log(name , val)
        this.$set(this.fdVals, name, val)
        this.$emit('updatefields', this.fdVals)
      },
    },
  }
</script>
