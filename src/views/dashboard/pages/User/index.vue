<template>
  <v-container
    id="prealerts"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      class="px-5 py-3 v-meterial-data-table"
    >
      <template #after-heading>
        <div class="ml-auto text-right d-flex">
          <v-btn
            fab
            :to="`${$route.fullPath}/add`"
            color="blue darken-3"
            small
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
          <v-btn
            fab
            color="green"
            small
            @click="createExcel"
          >
            <v-icon>
              mdi-microsoft-excel
            </v-icon>
          </v-btn>
          <v-btn
            fab
            color="red"
            small
            @click="createPDF"
          >
            <v-icon>
              mdi-file
            </v-icon>
          </v-btn>
        </div>
      </template>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-skeleton-loader
        v-if="!allUsers.length"
        class="mx-auto"
        type="table"
      />
      <v-data-table
        v-else
        :headers="thead"
        :items="allUsers"
        :search="search"
      >
        <template #[`item.bookings`]="{ item }">
          <v-chip
            color="green"
            class="ma-2"
            label
            dark
          >
            <strong> {{ item.bookings }} </strong>
          </v-chip>
        </template>
        <template #[`item.insurance`]="{ item }">
          <v-chip
            color="green"
            class="ma-2"
            label
            dark
          >
            <strong> {{ item.insurance }} </strong>
          </v-chip>
        </template>
        <template #[`item.delivery`]="{ item }">
          <v-chip
            color="green"
            class="ma-2"
            label
            dark
          >
            <strong> {{ item.delivery }} </strong>
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            text
            icon
            :to="`${$route.fullPath}/${item.Id}`"
            color="blue"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            :to="`${$route.fullPath}/edit/${item.Id}`"
            color="green lighten-8"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            color="red lighten-8"
            @click="deleteItem(item.Id)"
          >
            <v-progress-circular
              v-if="deleteId === item.Id && dltLoading"
              :width="2"
              color="red"
              indeterminate
            />
            <v-icon v-else>
              mdi-close
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      v-if="user.role === 'admin'"
      v-model="dialogDlt"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          Are you sure?

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialogDlt = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            class="mr-3"
            text
            @click="dialogDlt = false;deleteId = -1"
          >
            Cancel
          </v-btn>

          <v-btn
            color="success"
            text
            @click="deleteConfirm"
          >
            Yes
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Papa from 'papaparse'
  import { jsPDF } from 'jspdf'
  import 'jspdf-autotable'
  export default {
    data () {
      const { fullPath } = this.$route
      return {
        search: '',
        deleteId: -1,
        dialogDlt: false,
        dltLoading: false,
        thead: [
          { text: 'ERB', value: 'erb' },
          { text: 'Name', value: 'name' },
          { text: 'Email', value: 'email' },
          { text: 'Role', value: 'role' },
          { text: 'Bookings', value: 'bookings' },
          { text: 'Insurance', value: 'insurance' },
          { text: 'Delivery', value: 'delivery' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
        ],
        actionBtn: [
          { icon: 'mdi-plus', color: 'purple', title: 'Add Item', link: fullPath + '/add' },
          { icon: 'mdi-cloud-download', color: 'blue', title: 'Download Items', link: fullPath + '/download' },
          { icon: 'mdi-printer', color: 'amber', title: 'Print Table', link: fullPath + '/download' },
        ],
      }
    },
    computed: mapGetters(['allUsers', 'user']),
    watch: {
      allUsers (n) {
        this.progress = false
      },
    },
    created () {
      this.getUsers()
    },
    methods: {
      ...mapActions(['getUsers', 'deleteUser']),
      deleteItem (item) {
        this.deleteId = item
        this.dialogDlt = true
        this.dltLoading = false
      },
      deleteConfirm () {
        this.dltLoading = true
        this.deleteUser(this.deleteId)
        this.dialogDlt = false
      },
      createExcel () {
        let users = this.allUsers
        users = users.map(function (obj) {
          const newUser = {}
          Object.keys(obj).map(key => {
            const newKey = key.charAt(0).toUpperCase() + key.slice(1)
            newUser[newKey] = obj[key]
          })
          return newUser
        })
        var blob = new Blob([Papa.unparse(JSON.stringify(users))], { type: 'text/csv;charset=utf-8;' })

        var link = document.createElement('a')

        var url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'Users.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      createPDF () {
        const body = []
        const head = ['ID', 'Name', 'Email', 'Bookings', 'Insurance', 'Delivery']
        const pdfName = 'Users'
        this.allUsers.map(function (obj) {
          const user = [obj.Id, obj.name, obj.email, obj.bookings, obj.insurance, obj.delivery]
          body.push(user)
        })
        // eslint-disable-next-line new-cap
        const doc = new jsPDF()
        doc.autoTable({ head: [head], body, startY: 10 })
        doc.save(pdfName + '.pdf')
      },
    },
  }
</script>
