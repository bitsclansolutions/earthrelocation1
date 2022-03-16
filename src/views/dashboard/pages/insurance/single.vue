<template>
  <div>
    <v-container
      id="view-booking"
      ref="view-booking"
      class="align-center text-right"
      fluid
      tag="section"
    >
      <v-btn
        color="blue darken-2"
        class="ma-2 white--text"
        :to="{ name: 'Edit Insurance', params: { id: $route.params.id }}"
      >
        Edit
        <v-icon
          right
          dark
        >
          mdi-pencil
        </v-icon>
      </v-btn>

      <v-btn
        color="red"
        class="align-right justify-end ma-2 white--text"
        justify="end"
        @click="$refs.editform.generatePDF()"
      >
        <!-- @click="generatePDF" -->
        Download
        <v-icon
          right
          dark
        >
          mdi-file
        </v-icon>
      </v-btn>

      <v-skeleton-loader
        v-if="loader"
        v-bind="attrs"
        type="article, actions"
      />
    </v-container>
    <edit-form
      v-if="!loader"
      ref="editform"
      :section-data="insuranceSections"
      :premium-cost="insurance.totalAmount"
      :coverage-cost="insurance.coverageAmt"
      :deductive-cost="insurance.totalDeductible"
      :is-disabled="true"
    />
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex'
  import EditForm from './form'
  export default {
    components: { EditForm },
    data: () => ({
      attrs: {
        elevation: 2,
        class: 'mt-16',
        height: '400px',
      },

      loader: true,
      policyData: null,

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
      policyDataShow (data) {
        this.policyData = data
      },
    },
  }
</script>
