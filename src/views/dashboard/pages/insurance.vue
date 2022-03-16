<template>
  <v-container
    id="insurance"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="4"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-file-document"
          title="Total Forms"
          :value="allInsurance.length"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        lg="4"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-plus"
          title="Add Insurance"
          :btn="true"
          :to="`${this.$route.fullPath}/add`"
        />
      </v-col>
    </v-row>
    <base-data-table
      color="info"
      icon="mdi-email-open"
      title="All Insurance Form"
      :head="headers"
      :body="allInsurance"
      action-title="Insurance"
      @deleteitem="deleteIns"
    />
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        headers: [
          { text: 'id', value: 'Id' },
          { text: 'Name', value: 'name' },
          { text: 'Email', value: 'email' },
          { text: 'Policy', value: 'policy' },
          { text: 'Amount', value: 'totalAmount' },
          { text: 'Date', value: 'date' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
        ],
        body: [],
      }
    },
    computed: mapGetters(['allInsurance']),
    watch: {
      allInsurance () {
        this.progress = false
      },
    },
    created () {
      this.getInsurance({ id: false })
    },
    methods: {
      ...mapActions(['getInsurance', 'deleteInsurance']),
      deleteIns (id) {
        this.deleteInsurance(id)
      },
    },
  }
</script>
