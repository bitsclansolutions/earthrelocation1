<template>
  <div>
    <p
      v-for="(cond,i) in termCond"
      :key="i"
      cols="12"
    >
      <v-checkbox
        ref="tc"
        v-model="cond.enable"
        :rules="[rules.required]"
        :readonly="readonly"
        :label="cond.label"
        @change="checkTerms(cond.name,cond.enable)"
      />
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      tc: {
        type: [Object, Array],
        default: () => ({
          'indivisual-values': false,
          'new-residence': false,
          'shipping-container': false,
          'UNIRISC-auth': false,
        }),
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        termCond: this.agreementsData(),
        tcVal: {},
        rules: {
          required: v => !!v || 'Required',
        },
      }
    },
    watch: {
      tc: {
        deep: true,
        handler (val) { this.termCond = this.agreementsData() },
      },
    },
    methods: {
      validate () {
        return this.inpValidate(this.$refs)
      },
      agreementsData () {
        return [
          {
            name: 'indivisual-values',
            label: 'ITEM VALUES NOT DECLARED IN YOUR INSURANCE APPLICATION ARE NOT INSURED.',
            enable: this.tc['indivisual-values'],
          },
          {
            name: 'new-residence',
            label: 'TAKE INTO CONSIDERATION THE REPLACEMENT COST OF YOUR ITEMS AT DESTINATION YOU ARE MOVING TO',
            enable: this.tc['new-residence'],
          },
          {
            name: 'shipping-container',
            label: 'IF YOU\'RE SHIPPING A CAR, DO NOT LOAD ANY GOODS INSIDE THE VEHICLE.  ',
            enable: this.tc['shipping-container'],
          },
          {
            name: 'UNIRISC-auth',
            label: 'IN EVENT OF AN INSURANCE CLAIM, DO NOT DISPOSE OFF OR DISCARD ANY DAMAGED GOODS WITHOUT WRITTEN AUTHORIZATION FROM UNIRISC',
            enable: this.tc['UNIRISC-auth'],
          },
        ]
      },
      checkTerms (name, val) {
        this.$set(this.tcVal, name, val)
        this.changeField(this.tcVal, 'agreements')
      },
      changeField (val, name) {
        this.$emit('updateField', val, name)
      },
    },

  }
</script>
