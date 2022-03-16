<template>
  <div>
    <v-container
      v-if="loader"
      id="edit-delivery"
      fluid
      tag="section"
    >
      <v-skeleton-loader
        v-bind="attrs"
        type="article, actions"
      />
    </v-container>
    <edit-form
      v-else
      :fields="document"
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
    }),
    computed: mapGetters(['document']),
    watch: {
      document (val) {
        console.log(val)
        this.loader = false
      },
    },
    created () {
      this.getDocuments({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getDocuments', 'error']),
    },
  }
</script>
