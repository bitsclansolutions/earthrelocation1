<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-radio-group
        v-model="fd.indivisual"
        :label="`Do you have items with individual value over $${minimumPrice} ?`"
        :readonly="readonly"
        row
        @change="clearItems"
      >
        <v-radio
          label="Yes"
          value="yes"
        />
        <v-radio
          label="No"
          value="no"
        />
      </v-radio-group>
      <div v-if="fd.indivisual === 'yes'">
        <p><b>Note:</b></p>
        <p>
          All claims for high-value items will require proof of valuation in terms of purchase receipt(s) or published valuation in the public domain. If no such proof is available, a professional appraisal by a licensed appraiser is mandatory prior to pickup.
        </p>
      </div>
      <v-card v-if="fd.indivisual === 'yes'">
        <v-row>
          <v-col cols="9">
            <v-card-title>
              Items Description
              <v-btn
                v-if="!readonly && !fd.inputs.length"
                fab
                dark
                small
                color="primary"
                class="ml-4"
                @click="add"
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-card-title>
          </v-col>
        </v-row>

        <v-card-text>
          <v-row
            v-for="(item,i) in fd.inputs"
            :key="i"
          >
            <v-col cols="5">
              <v-text-field
                ref="itemname"
                v-model="item.name"
                label="Name"
                dense
                outlined
                :rules="[rules.required]"
                :readonly="readonly"
                :value="item.name"
                @input="changeField(fd.inputs, 'items')"
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                ref="repval"
                v-model="item.value"
                label="Replacement Value"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[rules.required,rules.minimum]"
                :readonly="readonly"
                type="number"
                dense
                outlined
                :value="item.value"
                @input="updateAmount"
              />
            </v-col>
            <v-col cols="2">
              <v-btn-toggle
                v-if="!readonly"
              >
                <v-btn
                  color="red"
                  small
                  @click="remove(i);updateAmount()"
                >
                  <v-icon dark>
                    mdi-minus
                  </v-icon>
                </v-btn>

                <v-btn
                  color="primary"
                  small
                  @click="add"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
              <!-- <v-btn
                v-if="!readonly"
                fab
                dark
                x-small
                color="red"
                @click="remove(i);updateAmount()"
              >
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn> -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card v-if="policy === 'VALUED INVENTORY' && fd.indivisual === 'yes'">
        <amount-calculator
          ref="amttcal"
          policy="VALUED INVENTORY"
          :coverage="fd.coverage"
          :deductible="fd.deductible"
          :readonly="readonly"
          @updateAmount="updateAmount"
          @updateField="changeField"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import AmountCalculator from './AmountCals'
  export default {
    name: 'Items',
    components: { AmountCalculator },
    props: {
      items: {
        type: Array,
        default: () => [
          {
            name: '',
            value: '',
          },
        ],
      },
      coverage: {
        type: Object,
        default: () => ({
          pairs: false,
          mold: false,
          electrical: false,
        }),
      },
      deductible: {
        type: [Number, String],
        default: '',
      },
      over2500: {
        type: [Boolean, String],
        default: 'no',
      },
      policy: {
        type: String,
        default: '',
      },
      minimumPrice: {
        type: Number,
        default: 2500,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        dialogDlt: false,
        fd: {
          indivisual: this.over2500,
          inputs: this.items,
          deductible: this.deductible,
          coverage: this.coverage,
        },
        itemsCount: 3,
        rules: {
          required: v => !!v || 'Required',
          minimum: v => this.minimumPrice <= v || `Minimum value should be greater then ${this.minimumPrice}`,
        },
      }
    },
    watch: {
      items (val) {
        this.fd.inputs = val
      },
      over2500 (v) { this.fd.indivisual = v },
    },
    mounted () {
      this.updateAmount()
    },
    methods: {
      validate () {
        return this.inpValidate(this.$refs)
      },
      clearItems () {
        if (this.fd.indivisual === 'no') {
          this.fd.inputs = [{ name: '', value: '' }]
          this.updateAmount()
        }
        this.changeField(this.fd.indivisual, 'over2500')
      },
      add () {
        this.fd.inputs.push({ name: '', value: '' })
      },
      remove (i) {
        this.fd.inputs.splice(i, 1)
      },
      updateAmount () {
        const amt = Number(this.fd.inputs.reduce((a, b) => { return Number(a) + Number(b.value) }, 0))
        this.$emit('updateAmount', amt)
        this.changeField(this.fd.inputs, 'items')
      },
      updateCoverage () {
        this.changeField(this.fd.inputs, 'items')
        this.updateAmount()
      },
      changeField (val, name) {
        this.$emit('updateField', val, name)
      },
      calDeduct () {
        return Number(this.fd.deductible + Object.values(this.fd.coverage).reduce((a, b) => { return a + b }, 0))
      },
    },
  }
</script>
