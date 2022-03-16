<template>
  <div>
    <v-container
      id="view-alerts"
      fluid
      tag="section"
    >
      <v-row>
        <v-col
          cols="12"
        >
          <base-material-card class="px-5 py-3">
            <template #heading>
              <div class="display-2 font-weight-light">
                User Details
              </div>
              <div class="subtitle-1 font-weight-light">
                {{ userDetails.erb ? `ERB : ${userDetails.erb}` : `ID : ${userDetails.id}` }}
              </div>
            </template>
            <v-skeleton-loader
              v-if="loader.users"
              v-bind="attrs"
              type="table-tbody"
            />
            <v-simple-table v-else>
              <template #default>
                <tbody>
                  <tr
                    v-for="(item,i) in items"
                    :key="i"
                  >
                    <th>{{ item.title }}</th>
                    <td>{{ item.text }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </base-material-card>
        </v-col>
        <v-col
          cols="12"
        >
          <base-data-table
            color="info"
            icon="mdi-email-open"
            title="Delivery & Access"
            :head="table.delivery.headers"
            :body="table.delivery.body"
            action-title="Delivery"
            :progress="loader.delivery"
            @deleteitem="deleteDelivery"
          />
        </v-col>
        <v-col
          cols="12"
        >
          <base-data-table
            color="info"
            icon="mdi-email-open"
            title="Insurance Form"
            :head="table.insurance.headers"
            :body="table.insurance.body"
            action-title="Insurance"
            :progress="loader.insurance"
            @deleteitem="deleteInsurance"
          />
        </v-col>
        <v-col
          cols="12"
        >
          <base-data-table
            color="info"
            icon="mdi-email-open"
            title="Booking Form"
            :head="table.booking.headers"
            :body="table.booking.body"
            action-title="Booking"
            @deleteitem="deleteBooking"
          />
        </v-col>
        <v-col
          cols="12"
        >
          <base-data-table
            title="Notifications"
            :head="table.notifications.headers"
            :body="table.notifications.body"
            :view="true"
            action-title="Alert"
            @deleteitem="deleteNotification"
          />
        </v-col>
        <v-col
          cols="12"
        >
          <base-data-table
            title="Documents"
            :head="table.documents.headers"
            :body="table.documents.body"
            :view="true"
            action-title="Alert"
            @deleteitem="deleteDocument"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        attrs: {
          elevation: 2,
          height: '500px',
        },
        loader: {
          users: true,
          notifications: true,
          documents: true,
          insurance: true,
          booking: true,
          delivery: true,
        },
        items: [],
        table: {
          insurance: {
            headers: [
              { text: 'id', value: 'Id' },
              { text: 'Policy', value: 'policy' },
              { text: 'Amount', value: 'totalAmount' },
              { text: 'Date', value: 'date' },
              { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            body: [],
          },
          booking: {
            headers: [
              { text: 'ID', value: 'Id' },
              { text: 'Name', value: 'title' },
              { text: 'Desired Move Date', value: 'movedate' },
              { text: 'Booked Date', value: 'date' },
              { text: 'Status', value: 'status' },
              { text: 'Order Confirmation', value: 'orderconfirm', sortable: false, align: 'center' },
              { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            body: [],
          },
          notifications: {
            headers: [
              { text: 'Alert', value: 'name', align: 'start', width: this.$vuetify.breakpoint.sm && this.$vuetify.breakpoint.xs ? '' : '70%' },
              { text: 'Date', value: 'date' },
              { text: 'Open', value: 'actions', align: 'center' },
            ],
            body: [],
          },
          delivery: {
            headers: [
              { text: 'ID', value: 'Id' },
              { text: 'Name', value: 'title' },
              { text: 'Phone', value: 'phone' },
              { text: 'Residence Type', value: 'residencetype' },
              { text: 'Date', value: 'date' },
              { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            body: [],
          },
          documents: {
            headers: [
              { text: 'ID', value: 'Id' },
              { text: 'Type', value: 'title' },
              { text: 'Owner', value: 'author' },
              { text: 'Uploaded Date', value: 'date' },
              { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            body: [],
          },
        },
      }
    },
    computed: mapGetters(['userDetails', 'allInsurance', 'allBookings', 'allDelivery', 'allDocs', 'allNotifications']),
    watch: {
      userDetails (val) {
        this.loader.users = false
        this.fetchUser()
      },
      allInsurance (n) {
        this.loader.insurance = false
        this.table.insurance.body = n
      },
      allBookings (n) {
        this.loader.booking = false
        this.table.booking.body = n
      },
      allDelivery (n) {
        this.loader.delivery = false
        this.table.delivery.body = n
      },
      allDocs (n) {
        this.loader.documents = false
        this.table.documents.body = n
      },
      allNotifications (n) {
        this.loader.notifications = false
        this.table.notifications.body = n
      },
    },
    created () {
      this.userDetail(this.$route.params.id)
      this.getInsurance({ id: false, filter: { author: this.$route.params.id } })
      this.getBookings({ id: false, filter: { author: this.$route.params.id } })
      this.getNotification({ id: false, filter: { author: this.$route.params.id } })
      this.getDelivery({ id: false, filter: { author: this.$route.params.id } })
      this.getDocuments({ id: false, filter: { author: this.$route.params.id } })
    },
    methods: {
      ...mapActions(['userDetail', 'getInsurance', 'getBookings', 'getNotification', 'getDelivery', 'getDocuments',
                     'deleteInsurance', 'deleteBooking', 'deleteDelivery', 'deleteNotification', 'deleteDocument']),
      fetchUser () {
        const user = this.userDetails
        this.items = [
          { title: 'First Name', text: user.first_name },
          { title: 'Last Name', text: user.last_name },
          { title: 'Username', text: user.username },
          { title: 'Email', text: user.email },
          { title: 'Country', text: user.country },
          { title: 'Description', text: user.description },
          { title: 'ZIP', text: user.zip },
        ]
      },
    },
  }
</script>

<style scoped>
  th{
    width: 25%;
    text-transform: uppercase;
    font-size: inherit !important;
    font-weight: 400;
  }
  td{
    padding: 10px 10px !important;
  }
</style>
