<template>
  <div>
    <v-form :disabled="true">
      <div v-if="allField.contact">
        <h3>Contact Information</h3>
        <contact-info
          ref="contact-info"
          :user-data="allField.contact"
          :disable="true"
        />
      </div>
      <div v-if="allField.noInsurance">
        <v-divider />
        <waiver
          ref="waiver"
          :readonly="true"
          :inputs="allField.waiver"
        />
        <!-- <h1>{{allField.waiver}}</h1> -->
      </div>
      <div v-if="policyName && policyName !== 'VALUED INVENTORY' && !allField.noInsurance">
        <v-divider />
        <h3>Amount Calculator</h3>
        <amount-calculator
          ref="amtcal"
          :volume="allField.volume"
          :amount="allField.amount"
          :deductible="allField.deductible"
          :readonly="true"
          :policy="policyName"
          :mulamount="policyName === 'LUPSUM POLICY' ? 84 : 1"
        />
      </div>
      <div v-if="policyName === 'VALUED INVENTORY' && !allField.noInsurance">
        <v-divider />
        <h3>Agreements</h3>
        <article-agreement
          ref="articleAgreement"
          :readonly="true"
          :tc="allField.agreements"
        />
      </div>
      <div v-if="policyName === 'VALUED INVENTORY' && !allField.noInsurance">
        <v-divider />
        <article-items
          ref="articleItems"
          :disable="true"
          :items="allField.article"
        />
      </div>
      <div v-if="policyName === 'LUMPSUM POLICY' && !allField.noInsurance">
        <v-divider />
        <h3>Extra Items</h3>
        <extra-items
          ref="extraitems"
          :items="allField.items"
          :policy="policyName"
          :readonly="true"
          :over2500="allField.over2500"
          :deductible="allField.deductible"
          :coverage="allField.coverage"
        />
      </div>
      <div v-if="!allField.noInsurance && policyName">
        <v-divider />
        <h3>Vehicles</h3>
        <vehicle
          ref="vehicle"
          :readonly="true"
          :vehicles="allField.vehicle"
          :is-insure="allField.isVehicleInsurance"
          :policy="policyName"
        />
      </div>
      <div v-if="policyName && policyName !== 'TOTAL LOSS' && !allField.noInsurance">
        <v-divider />
        <premium-calculator
          ref="premiumcals"
          :readonly="true"
          :deductible="allField.deductible"
          :coverage="allField.coverage"
          :policy="policyName"
        />
      </div>
      <div v-if="policyName && !allField.noInsurance">
        <v-divider />
        <h3>Term & Conditions</h3>
        <tnc
          :scroll="false"
          :inputs="allField.tnc"
          :readonly="true"
          :is-open="true"
        />
      </div>
    </v-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import ContactInfo from '../../components/InsuranceForm/ContactInfo'
  import Waiver from '../../components/InsuranceForm/insuranceWaiver'
  import AmountCalculator from '../../components/InsuranceForm/AmountCals'
  import ArticleAgreement from '../../components/InsuranceForm/ArticleAgreement'
  import ArticleItems from '../../components/InsuranceForm/ArticleItems'
  import ExtraItems from '../../components/InsuranceForm/Items'
  import Vehicle from '../../components/InsuranceForm/Vehicle/'
  import PremiumCalculator from '../../components/InsuranceForm/PremiumCals'
  import Tnc from '../../components/InsuranceForm/tnc'
  export default {
    components: { AmountCalculator, Waiver, ContactInfo, ArticleAgreement, ArticleItems, ExtraItems, Vehicle, PremiumCalculator, Tnc },
    props: {
      waiver : {},
      allFields: {
        type: Object,
        default: () => {},
      },
      policyName: {
        type: String,
        default: '',
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    watch:{
      waiver(val){
        this.allField.waiver = val
      }
    },
    computed: {
      ...mapGetters({
        allField: 'insuranceSections',
      }),
    },
    methods: {
      repeatM () {

        var repeat = setInterval(() => {
          this.waiver = this.allField.waiver
        }, 5000)
      }
    },
    created () {
      this.repeatM()
    }
  }
</script>
