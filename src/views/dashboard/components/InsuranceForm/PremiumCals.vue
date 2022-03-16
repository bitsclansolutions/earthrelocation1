<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-radio-group
        ref="opt"
        v-model="fd.deductible"
        label="Select Option"
        row
        @change="addDeductible();changeFields(fd.deductible,'deductible')"
      >
        <v-radio
          v-if="policy === 'TOTAL LOSS'"
          label="deductible 2.5%"
          aria-selected="true"
          :readonly="readonly"
          :value="2.5"
        />
        <v-radio
          v-if="policy !== 'TOTAL LOSS'"
          label="$250 deductible 3.5%"
          :readonly="readonly"
          :value="3.5"
        />
        <v-radio
          v-if="policy !== 'TOTAL LOSS'"
          :readonly="readonly"
          label="$500 deductible 3.0%"
          :value="3.0"
        />
      </v-radio-group>
      <b>Select Coverages :</b>
      <v-container class="d-flex custom-dflex">
        <v-checkbox
          class="custom-checkbox"
          v-model="fd.coverage.pairs"
          label="Pairs & Sets"
          :readonly="readonly"
          :value="0.25"
          dense
          @change="addDeductible()"
        />
        <v-checkbox
          class="custom-checkbox2"

          v-model="fd.coverage.mold"
          :readonly="readonly"
          label="Mold and Mildew"
          :value="0.25"
          @change="addDeductible()"
        />
        <v-checkbox
          v-model="fd.coverage.electrical"
          :readonly="readonly"
          label="Electrical and Mechanical Derangement"
          :value="0.25"
          @change="addDeductible()"
        />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      deductible: {
        type: [Number, String],
        default: '',
      },
      policy: {
        type: String,
        default: '',
      },
      coverage: {
        type: Object,
        default: () => ({ pairs: '', mold: '', electrical: '' }),
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        fd: {
          deductible: this.policy === 'TOTAL LOSS' ? 2.5 : this.deductible,
          coverage: this.coverage,
        },
      }
    },
    watch: {
      deductible (val) {
        this.fd.deductible = val
      },
      coverage: {
        deep: true,
        handler (val) { this.fd.coverage = val },
      },
    },
    methods: {
      changeFields (val, name) {
        this.$emit('updateField', val, name)
      },
      addDeductible () {
        this.$emit('deduct', this.totalDeductive())
        this.changeFields(this.fd.coverage, 'coverage')
      },
      totalDeductive () {
        const amt = Object.keys(this.fd.coverage).reduce((sum, key) => sum + parseFloat(this.fd.coverage[key] || 0), 0)
        return amt + this.fd.deductible
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
    },
  }
</script>
<style>
.custom-checkbox.v-input--checkbox.v-input--dense{
  margin-top: 16px;
  margin-right: 12px;

}
.custom-checkbox2{
  margin-right: 12px;

}
</style>