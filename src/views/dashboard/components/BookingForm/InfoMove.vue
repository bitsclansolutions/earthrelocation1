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
          @input="datePicker = false;changeField(fld.value, fld.name)"
        />
      </v-menu>
      <v-select
        v-else-if="fld.type === 'select'"
        ref="select"
        id="salesrepname"
        v-model="fld.value"
        :items="fld.options"
        :rules="[rules.required]"
        :label="fld.label"
        @input="changeField(fld.value, fld.name)"
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
          repname: '',
          movedate: '',
        }),
      },
      prefix: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        datePicker: false,
        fd: this.getFields(),
        rules: {
          required: v => !!v || 'Required',
        },
        savedData: this.fields,
      }
    },
    watch: {
      fields: {
        deep: true,
        handler () { this.fd = this.getFields() },
      },
    },
    methods: {
      getFields () {
        return [
          {
            value: this.fields.repname,
            label: 'Sales Rep Name',
            name: 'repname',
            type: 'select',
            options: ['Almo', 'Crystal Kaphaem', 'David O', 'Joseph M', 'Kapil Lahoti', 'Samir Shah', 'Tania Hernandez', 'David', 'Suleikal', 'Randy Lowry', 'Jake Lowry', 'Ivan Jefferson'],
          },
          {
            value:  this.fields.movedate,
            // value: this.$route.name === 'New Booking' ? '' : this.fields.movedate,
            label: 'Desired Move Date',
            name: 'movedate',
            type: 'date',
          },
        ]
      },
      changeField (val, name) {
        this.$set(this.savedData, name, val)
        this.$emit('updateField', this.savedData, 'movedetails')
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
    },
  }
</script>
