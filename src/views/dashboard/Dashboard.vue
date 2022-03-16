<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Bookings"
          :value="allBookings.length"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Insurance"
          :value="allInsurance.length"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Delivery & Access"
          :value="allDelivery.length"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="New Notifications"
          :value="allBookings.length"
        />
      </v-col>

      <v-col
        cols="12"
        md="12"
      >
        <base-material-card class="px-5 py-3">
          <template #heading>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
            >
              <span
                class="subheading font-weight-light mx-3"
                style="align-self: center"
              >Reports :</span>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-book-check-outline
                </v-icon>
                Bookings
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-certificate-outline
                </v-icon>
                Insurance
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">
                  mdi-truck-delivery-outline
                </v-icon>
                Delivery & Access
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items
            v-model="tabs"
            class="transparent"
          >
            <v-tab-item>
              <base-data-table
                :head="tHeads.bookings"
                :body="allBookings"
                :progress="loading.bookings"
              />
            </v-tab-item>
            <v-tab-item>
              <base-data-table
                :head="tHeads.insurance"
                :body="allInsurance"
                :progress="loading.insurance"
              />
            </v-tab-item>
            <v-tab-item>
              <base-data-table
                :head="tHeads.delivery"
                :body="allDelivery"
                :progress="loading.delivery"
              />
            </v-tab-item>
          </v-tabs-items>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        loading: {
          bookings: this.allBookings || true,
          insurance: this.allInsurance || true,
          delivery: this.allDelivery || true,
        },
        tHeads: {
          bookings: [
            { text: 'ID', value: 'Id' },
            { text: 'Name', value: 'title' },
            { text: 'Desired Move Date', value: 'movedate' },
            { text: 'Booked Date', value: 'date' },
          ],
          insurance: [
            { text: 'ID', value: 'Id' },
            { text: 'Name', value: 'name' },
            { text: 'Email', value: 'email' },
            { text: 'Policy', value: 'policy' },
            { text: 'Amount', value: 'totalAmount' },
            { text: 'Date', value: 'date' },
          ],
          delivery: [
            { text: 'ID', value: 'Id' },
            { text: 'Name', value: 'title' },
            { text: 'Phone', value: 'phone' },
            { text: 'Residence Type', value: 'residencetype' },
            { text: 'Date', value: 'date' },
          ],
        },
        tabs: 0,
      }
    },
    computed: mapGetters(['allBookings', 'allInsurance', 'allDelivery']),
    watch: {
      allBookings () {
        this.loading.bookings = false
      },
      allInsurance () {
        this.loading.insurance = false
      },
      allDelivery () {
        this.loading.delivery = false
      },
    },
    created () {
      this.getBookings({ id: false })
      this.getInsurance({ id: false })
      this.getDelivery({ id: false })
    },
    methods: {
      ...mapActions(['getBookings', 'getInsurance', 'getDelivery']),
      complete (index) {
        this.list[index] = !this.list[index]
      },
    },
  }
</script>
