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
      <v-select
        v-if="fields.type === 'select'"
        ref="select"
        id="abc"
        v-model="fields.value"
        :items="fields.options"
        :label="fields.label"
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
            type: 'select',
            options: ['Others','1950','1951','1952','1953','1954','1955','1956','1957','1958','1959','1960','1961','1962','1963','1964','1965','1966','1967','1968','1969','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979','1980','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'],
          },
          {
            value: this.inputs.manufacturer,
            label: 'Manufacturer',
            name: 'manufacturer',
            type: 'text'
          },
          {
            value: this.inputs.make,
            label: 'Make',
            name: 'make',
            type: 'text'
          },
          {
            value: this.inputs.wheels,
            label: 'Wheels',
            name: 'wheels',
            type: 'select',
            options: ['4','6','8','10','12']
          },
          {
            value: this.inputs.color,
            label: 'Color',
            name: 'color',
            type: 'select',
            options:['Beige','Black','Blue','Brown','Gold','Green','Grey','Orange','Pink','Purple','Red','Silver','White','Yellow','Other']
          },
          {
            value: this.inputs.model,
            label: 'Model',
            name: 'model',
            type: 'text'
          },
          
          {
            value: this.inputs.vin,
            label: 'VIN #',
            name: 'vin',
            type: 'text'
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
