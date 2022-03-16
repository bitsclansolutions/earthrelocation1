<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-row>
        <v-col
          v-for="fld in fd"
          :key="fld.name"
          cols="12"
        >
          <v-radio-group
            v-if="fld.type === 'radio'"
            ref="radio"
            v-model="fld.value"
            :label="fld.label"
            :rules="[rules.required]"
            row
            @change="changeField(fld.name, fld.value)"
          >
            <v-radio
              v-for="(item, i) in fld.options"
              :key="i"
              :label="item"
              :value="i"
            />
          </v-radio-group>
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
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <img :src="`${publicPath}floor-species.JPG`">
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      fields: {
        type: Object,
        default: () => ({
          residencetype: '',
          floor: '',
          walkingdistance: '',
        }),
      },
    },
    data () {
      return {
        publicPath: process.env.BASE_URL,
        datePicker: false,
        fd: [
          {
            value: this.fields.residencetype,
            label: 'Residence Type',
            name: 'residencetype',
            type: 'radio',
            options: { house: 'House', bungalow: 'Bungalow', apartment: 'Apartment', other: 'Other' },
          },
          {
            value: this.fields.floor,
            label: 'Specify which American Floor',
            name: 'floor',
            req: false,
          },
          {
            value: this.fields.walkingdistance,
            label: 'Specify walking distance',
            name: 'walkingdistance',
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
        this.$emit('updateField', 'residence', this.savedData)
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
    },
  }
</script>
