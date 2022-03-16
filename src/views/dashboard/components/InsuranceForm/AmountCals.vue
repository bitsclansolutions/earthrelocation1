<template>
  <v-row>
    <v-col
      v-if="policy === 'LUMPSUM POLICY'"
      cols="12"
      md="4"
    >
      <v-text-field
        ref="volume"
        v-model="fd.volume"
        label="Enter Volume"
        :rules="[rules.required]"
        :readonly="readonly"
        required
        suffix="Cubic Feet (CFT) × 7 ="
        @input="fd.amount = (fd.volume*(fd.unit*12)).toFixed(2);changePrm();fd.weight = fd.volume * fd.unit;changeField(fd.volume,'volume');changeField(fd.amount,'amount')"
      />
    </v-col>
    <v-col
      v-if="policy === 'LUMPSUM POLICY'"
      cols="12"
      md="4"
    >
      <v-text-field
        ref="weight"
        v-model="fd.weight"
        label="Estimated weight"
        suffix="× $12/lb = "
        :value="fd.volume * 7"
        disabled
      />
    </v-col>
    <v-col
      v-if="policy !== 'VALUED INVENTORY'"
      cols="12"
      md="4"
    >
      <v-text-field
        ref="amount"
        v-model="fd.amount"
        label="Enter Amount"
        :rules="[rules.required,rules.minimum]"
        :readonly="readonly"
        required
        @input="fd.volume = Number((fd.amount/(fd.unit*12)).toFixed(2));changePrm();changeField(fd.amount,'amount');fd.weight = fd.volume * fd.unit;changeField(fd.volume,'volume')"
      />
      <p v-if="policy === 'TOTAL LOSS'">
        Do not include vehicle amount
      </p>
    </v-col>
    <v-col
      v-if="policy === 'LUMPSUM POLICY'"
      cols="12"
    >
      <p>This is only an estimated premium, Actual amount wil be billed as per actual weight upon pickup</p>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      volume: {
        type: [Number, String],
        default: 0,
      },
      amount: {
        type: [Number, String],
        default: 0,
      },
      mulamount: {
        type: [Number, String],
        default: 1,
      },
      deductible: {
        type: [Number, String],
        default: '',
      },
      unit: {
        type: Number,
        default: 7,
      },
      coverage: {
        type: Object,
        default: () => ({
          pairs: '',
          mold: '',
          electrical: '',
        }),
      },
      policy: {
        type: String,
        default: '',
      },
      update: {
        type: [String, Number],
        default: '',
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        fd: this.loadData(),
        rules: {
          required: v => !!v || 'Required',
          minimum: () => true,
        },
      }
    },
    watch: {
      mulamount (val) {
        this.fd.amount = this.fd.volume * val
        this.changePrm()
      },
      amount (val) {
        this.fd.amount = val
      },
      volume (val) {
        this.fd.volume = val
        this.fd.weight = val * 7
      },
      update (v) {
        this.fd = this.volume
      },
    },
    // mounted () {
    //   this.addDeductible()
    // },
    methods: {
      changePrm () {
        this.updateAmnt()
      },
      addDeductible () {
        this.$store.commit('ADD_DEDUCTIBLE', this.calDeduct())
        this.updateAmnt()
      },
      updateAmnt () {
        if (this.policy === 'TOTAL LOSS') {
          this.$emit('deduct', Number(this.fd.deductible))
        }
        this.$emit('updateAmount', Number(this.fd.amount))
      },
      changeField (val, name) {
        this.$emit('updateField', val, name)
      },
      calDeduct () {
        return Number(this.fd.deductible + Object.values(this.fd.coverage).reduce((a, b) => { return Number(a + b) }, 0))
      },
      loadData () {
        return {
          volume: this.volume,
          amount: this.amount,
          mulamount: this.mulamount,
          deductible: this.policy === 'TOTAL LOSS' ? 2.5 : this.deductible,
          unit: this.unit,
          coverage: this.coverage,
          weight: this.volume * this.unit,
        }
      },
      validate () {
        for (var f in this.$refs) {
          if (!this.$refs[f].validate(true)) return false
        }
        return true
      },
    },
  }
</script>
