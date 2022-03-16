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
          :value="allDelivery.length"
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
      :body="allDelivery"
      :loader="progress"
      action-title="Delivery"
      @deleteitem="deleteDelivery"
    />
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        progress: true,
        thead: [
          { text: 'ID', value: 'Id' },
          { text: 'Name', value: 'title' },
          { text: 'Phone', value: 'phone' },
          { text: 'Residence Type', value: 'residencetype' },
          { text: 'Date', value: 'date' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
        ],
      }
    },
    computed: mapGetters(['allDelivery', 'deliveryAlert']),
    watch: {
      deliveryAlert (n) {
      },
    },
    async created () {
      await this.getDelivery({ id: false })
      this.progress = false
    },
    methods: {
      ...mapActions(['getDelivery', 'deleteDelivery']),
    },
  }
</script>
