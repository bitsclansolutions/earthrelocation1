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
        input: this.inputs,
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
            value: this.inputs.color,
            label: 'Color',
            name: 'color',
          },
          {
            value: this.inputs.vin,
            label: 'VIN #',
            name: 'vin',
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
