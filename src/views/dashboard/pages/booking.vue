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
          :value="allBookings.length"
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
          title="Add New"
          :btn="true"
          :to="`${this.$route.fullPath}/add`"
        />
      </v-col>
    </v-row>

    <base-data-table
      :head="thead"
      :body="allBookings"
      :loader="progress"
      action-title="Booking"
      @deleteitem="deleteBooking"
      @generatePdf="generatePdf"
    />
    <view-pdf
      v-show="false"
      ref="viewform"
    />
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import viewPdf from './booking/view'
  export default {
    components: { viewPdf },
    data () {
      return {
        formId: false,
        progress: true,
        thead: [
          { text: 'ID', value: 'Id' },
          { text: 'Name', value: 'title' },
          { text: 'Desired Move Date', value: 'movedate' },
          { text: 'Booked Date', value: 'date' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
        ],
      }
    },
    computed: mapGetters(['allBookings', 'bookAlert']),
    watch: {
      bookAlert (n) {
        console.log(n)
      },
    },
    async created () {
      await this.getBookings({ id: false })
      this.progress = false
    },
    methods: {
      ...mapActions(['getBookings', 'deleteBooking']),
      generatePdf (id) {
        this.$refs.viewform.fetchAndPdf(id)
      },
    },
  }
</script>
