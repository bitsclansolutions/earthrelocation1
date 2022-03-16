<template>
  <div>
    <v-container
      v-if="loader"
      id="edit-bookingd"
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
      :fields="booking"
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
    computed: mapGetters(['booking']),
    watch: {
      booking (val) {
        console.log(val)
        this.loader = false
      },
    },
    created () {
      this.getBookings({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getBookings', 'error']),
    },
  }
</script>
