<template>
  <v-row>
    <v-col
      v-for="fld in fd"
      :key="fld.name"
      cols="12"
      :md="fld.md || 6"
    >
      <v-select
        v-if="fld.type === 'select'"
        ref="select"
        :class="{commentError : fld.class}"
        v-model="fld.value"
        :items="fld.options"
        :label="fld.label"
        @input="changeField(fld.value, fld.name)"
      />
      <v-textarea
        v-else-if="fld.type === 'textarea'"
        :class="{commentError : fld.class }"
        v-model="fld.value"
        :items="fld.options"
        :label="fld.label"
        @input="changeField(fld.value, fld.name)"
      />
      <v-radio-group
        v-else-if="fld.type === 'radio'"
        v-model="fld.value"
        :class="{commentError : fld.class}"
        :items="fld.options"
        :label="fld.label"
        row
        @change="changeField(fld.value, fld.name)"
      >
        <v-radio
          v-for="(label, key) in { yes: 'Yes', no: 'No' }"
          :key="key"
          :label="label"
          :value="key"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      fields: {
        type: Object,
        default: () => ({
          comment: '',
          findUs: '',
          military: 'no',
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
        commentError:false,
        findusError:false,
        militaryError:false,
        savedData: this.fields,
      }
    },
    watch: {
      fields: {
        deep: true,
        handler () { this.fd = this.getFields() },
      },
      commentError:{
        handler(val) {
          this.commentError = val
          this.fd = this.getFields()
        }
      },
      findusError:{
        handler(val) {
          this.findusError = val
          this.fd = this.getFields()
        }
      }
    },
    methods: {
      getFields () {
        return [
          {
            value: this.fields.comment,
            label: 'Comments/Special Instructions (If any):',
            name: 'comment',
            type: 'textarea',
            md: 12,
            class:this.commentError
          },
          {
            value: this.fields.findUs,
            label: 'How did you hear about us?',
            name: 'findUs',
            type: 'select',
            options: ['Friend', 'Google', 'Bing', 'Facebook', 'LinkedIn', 'Quora', 'Offical Website', 'Forum/Blog', 'Yelp', 'Review Website', 'Other'],
            class:this.findusError

          },
          {
            value: this.fields.military,
            label: 'Are you a military Personnel?',
            name: 'military',
            type: 'radio',
            class:this.militaryError
          },
        ]
      },
      changeField (val, name) {
        this.$set(this.savedData, name, val)
        this.$emit('updateField', this.savedData, 'comment')
      },
      validate () {
          this.findusError = false
          this.commentError = false

        if (!this.fields.comment) {
          this.commentError = true
        }
        else if (!this.fields.findUs) {
          this.findusError = true
        }
        // else if (!this.fields.military) {
        //   this.militaryError = true
        // }
        else{
        return this.inpValidate(this.$refs)

        }
      },
    },
  }
</script>
<style >
.commentError div div div label{
  color: red !important;
}
</style>