<template>
  <div>
    <v-container
      id="view-alerts"
      fluid
      tag="section"
    >
      <base-material-card class="px-5 py-3">
        <template #heading>
          <div class="display-2 font-weight-light">
            Pre Alerts
          </div>
          <h3 class="display-2 font-weight-light">
            <small>for {{ notification.title }}</small>
          </h3>
        </template>
        <v-skeleton-loader
          v-if="loader"
          v-bind="attrs"
          type="table-tbody"
        />
        <v-simple-table v-else>
          <template #default>
            <tbody>
              <tr>
                <th>Seaport of Arrival</th>
                <td>{{ notification.seaport }}</td>
              </tr>
              <tr>
                <th>Estimated Arrival Date</th>
                <td>{{ notification.estarrivaldate }}</td>
              </tr>
              <tr>
                <th>Tracking Details</th>
                <td>
                  <a
                    :href="notification.trackingdetails"
                    target="_blank"
                  > {{ notification.trackingdetails }} </a>
                </td>
              </tr>
              <tr>
                <th>Container #</th>
                <td>{{ notification.container }}</td>
              </tr>
              <tr>
                <th>Direction for Tracking</th>
                <td>
                  - Please Click on the above link <br>
                  - Search by Container number under "CARGO TRACKING" <br>
                  - Type the container number in the search area and submit
                </td>
              </tr>
              <tr>
                <th>Delivery Agent</th>
                <td>
                  <b>Name : </b>{{ notification.deliveryagent.name }} <br>
                  <b>Mobile : </b>{{ notification.deliveryagent.phone }} <br>
                  <b>Email : </b>{{ notification.deliveryagent.email }}
                </td>
              </tr>
              <tr>
                <th>Important Notes</th>
                <td
                  v-html="
                    `<b>Dear Shipper, </b><br>
                      <p>1. It is your responsibility to track container movement regularly.
                      Any change in arrival schedule is completely governed by the Shipping Line
                      & Earth Relocation cannot be held responsible for it. <br>
                      2. it is critical that you contact the Delivery Agent at the earliest to arrange
                      required documentation for successful completion of customs clearance process at the arrival seaport.
                      Failure to do so could result in demurrage/port storage charges and you will be solely responsible for them,
                      Earth Relocation cannot be help responsible for them.<br>
                      3. In most countries, Shipper's presence (Persons whose name in the shopping documents) is mandatory for customs
                      clearance of household goods. Therefore, it is highly critical that you inform your Move Manager & Delivery Agent
                      at the earliest if you cannot be in the country at the time of contaier arrival so that required actions can be
                      taken in a timely manner.<br>
                      4 please confirm receipt of this PRE-ALERT so that all parties are on the same page. <br>
                      5. If you have any questions or concerns please contact your Move Manager at the earliest.</p>`"
                />
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </base-material-card>
    </v-container>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data: () => ({
      attrs: {
        elevation: 2,
        height: '500px',
      },
      loader: true,
      items: {},
    }),
    computed: mapGetters(['notification']),
    watch: {
      notification (val) {
        this.loader = false
      },
    },
    mounted () {
      const { deliveryagent } = this.notification
      this.items = [
        { title: 'Seaport of Arrival', text: this.notification.seaport },
        { title: 'Estimated Arrival Date', text: this.notification.estarrivaldate },
        { title: 'Tracking Details', text: `<a href="${this.notification.trackingdetails}" target="_blank">${this.notification.trackingdetails}</a>` },
        { title: 'Container #', text: this.notification.container },
        {
          title: 'Direction for Tracking',
          text: `- Please Click on the above link </br>
                 - Search by Container number under "CARGO TRACKING" </br>
                 - Type the container number in the search area and submit`,
        },
        {
          title: 'Delivery Agent',
          text: `${deliveryagent.name} </br>
                 - Search by Container number under "CARGO TRACKING" </br>
                 - Type the container number in the search area and submit`,
        },
        { title: 'Important Notes', text: this.notification.seaport },
      ]
    },
    created () {
      this.getNotification({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getNotification']),
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
