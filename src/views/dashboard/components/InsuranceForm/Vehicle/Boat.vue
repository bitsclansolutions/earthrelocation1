<template>
  <v-row>
    <v-col
      v-for="fields in textFields"
      :key="fields.name"
      cols="12"
      md="6"
    >
      <v-text-field
        v-model="fields.value"
        :label="fields.label"
        required
        @input="updateFields(fields.name,fields.value)"
      />
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
          },
          {
            value: this.inputs.make,
            label: 'Make',
            name: 'make',
          },
          {
            value: this.inputs.model,
            label: 'Model',
            name: 'model',
          },
          {
            value: this.inputs.trailerVin,
            label: 'Trailer VIN #',
            name: 'trailerVin',
          },
          {
            value: this.inputs.boatVin,
            label: 'Boat HULL #',
            name: 'boatVin',
          },
          {
            value: this.inputs.length,
            label: 'Length(ft)',
            name: 'length',
          },
          {
            value: this.inputs.width,
            label: 'Width(ft)',
            name: 'width',
          },
          {
            value: this.inputs.height,
            label: 'Height(ft)',
            name: 'height',
          },
          {
            value: this.inputs.weight,
            label: 'Weight',
            name: 'weight',
          },
        ]
      },
      updateFields (name, val) {
        this.$set(this.fdVals, name, val)
        this.$emit('updatefields', this.fdVals)
      },
    },
  }
</script>
