<template>
  <base-material-card
    icon="mdi-clipboard-text"
    :title="title"
    class="px-5 py-3 v-meterial-data-table"
  >
    <template #after-heading>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </template>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto"
      type="table"
    />
    <v-data-table
      v-else
      :headers="head"
      :items="body"
      :search="search"
    >
      <template
        #[`item.actions`]="{ item }"
        class="d-flex"
      >
        <div class="d-flex justify-center">
          <v-btn
            v-if="pdf"
            text
            icon
            color="red darken-10"
            @click="$emit('generatePdf',item.Id)"
          >
            <v-icon>mdi-file</v-icon>
          </v-btn>
          <v-btn
            v-if="view || user.role === 'admin'"
            text
            icon
            :to="{ name: `View ${actionTitle}`, params: { id: item.Id }}"
            color="blue"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="edit"
            icon
            :to="{ name: `Edit ${actionTitle}`, params: { id: item.Id }}"
            color="green lighten-8"
            class="custom-edit-btn"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="user.role === 'admin'"
            text
            icon
            color="red lighten-10"
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
        </div>
      </template>
    </v-data-table>
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
  </base-material-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'DataTable',

    props: {
      title: {
        type: String,
        default: '',
      },
      head: {
        type: Array,
        default: null,
      },
      body: {
        type: Array,
        default: null,
      },
      progress: {
        type: Boolean,
        default: true,
      },
      view: {
        type: Boolean,
        default: true,
      },
      edit: {
        type: Boolean,
        default: true,
      },
      pdf: {
        type: Boolean,
        default: false,
      },
      actionUrl: {
        type: String,
        default: '',
      },
      actionTitle: {
        type: String,
        default: '',
      },
    },

    data () {
      return {
        search: '',
        loading: this.progress,
        deleteId: -1,
        dialogDlt: false,
        dltLoading: false,
        actionLink: '',
      }
    },
    computed: mapGetters(['user']),
    watch: {
      body () {
        this.loading = false
      },
      progress (v) {
        this.loading = v
      },
    },
    mounted(){
      console.log('asd',this.body)
    },
    created () {
      this.actionLink = this.actionUrl || this.$route.fullPath
    },
    methods: {
      deleteItem (item) {
        this.deleteId = item
        this.dialogDlt = true
        this.dltLoading = false
      },
      deleteConfirm () {
        this.dltLoading = true
        this.$emit('deleteitem', this.deleteId)
        this.dialogDlt = false
      },
    },
  }
</script>

<style lang="sass">
.v-meterial-data-table

  > div:first-child
    justify-content: space-between
</style>
<style>
  .custom-edit-btn {
    background: none!important;;
    
  }
  .custom-edit-btn:hover{
background-color: #cef3cf!important;
  }
</style>
