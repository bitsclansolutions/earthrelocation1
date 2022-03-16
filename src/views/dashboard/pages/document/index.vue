<template>
  <v-container
    id="document"
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
          title="Total Documents"
          :value="allDocs.length"
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
      :body="allDocs"
      :loader="progress"
      action-title="Document"
      @deleteitem="deleteDocument"
    />
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        formId: false,
        progress: true,
        thead: [
          { text: 'ID', value: 'Id' },
          { text: 'Type', value: 'title' },
          { text: 'Owner', value: 'author' },
          { text: 'Uploaded Date', value: 'date' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
        ],
      }
    },
    computed: mapGetters(['allDocs', 'docAlert']),
    watch: {
      docAlert (n) {
        console.log(n)
      },
    },
    async created () {
      await this.getDocuments({ id: false })
      this.progress = false
    },
    methods: {
      ...mapActions(['getDocuments', 'deleteDocument']),
    },
  }
</script>
