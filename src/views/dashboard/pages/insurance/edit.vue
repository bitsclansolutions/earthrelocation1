<template>
  <div>
    <v-container
      v-if="loader"
      id="add-insurance"
      fluid
      tag="section"
    >
      <v-skeleton-loader
        v-bind="attrs"
        type="article, actions"
      />
    </v-container>
    <insurance-form
      v-else
      key="insurance"
      :section-data="insuranceSections"
      :premium-cost="insurance.totalAmount"
      :coverage-cost="insurance.coverageAmt"
      :deductive-cost="insurance.totalDeductible"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import InsuranceForm from './form'
  export default {
    components: { InsuranceForm },
    data: () => ({
      attrs: {
        elevation: 2,
        class: 'mt-16',
        height: '400px',
      },
      loader: true,
    }),
    computed: mapGetters(['insurance', 'insuranceSections']),
    watch: {
      insurance (val) {
        this.setInsuranceFields(val)
        this.loader = false
      },
    },
    created () {
      this.getInsurance({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getInsurance', 'setInsuranceFields', 'error']),
      updateSection (fields) {
        const sections = this.insuranceSections || {}
        for (const field in fields) {
          if (Object.prototype.hasOwnProperty.call(sections, field)) { sections[field] = fields[field] }
        }
        this.$store.commit('INSURANCE_UPDATE_SECTIONS', sections)
      },
    },
  }
</script>
