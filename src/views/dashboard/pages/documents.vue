/* eslint-disable vue/no-parsing-error */
<template>
  <v-container
    id="insurance"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        lg="12"
      >
        <base-material-card class="px-5 py-3">
          <template #heading>
            <div class="display-2 font-weight-light">
              <v-icon>mdi-cloud-upload</v-icon>
              Upload Documents
            </div>
          </template>
          <base-material-alert
            color="error"
            dark
            :value="alert.value"
          >
            {{ alert.text }}
          </base-material-alert>
          <v-form
            ref="form"
            @submit.stop.prevent="formSubmit($event)"
          >
            <v-select
              v-model="selectDoc"
              :items="documentsType"
              :rules="[v => !!v || 'Item is required']"
              label="Document Type"
              prepend-icon="mdi-file-document"
              required
            />
            <v-text-field
              v-if="selectDoc === 'Others'"
              v-model="fileName"
              prepend-icon="mdi-label-outline"
              label="Document Name"
              :rules="[v => !!v || 'Item is required']"
              required
            />
            <v-file-input
              v-model="file"
              label="File input"
              required
              :rules="[v => !!v || 'Item is required']"
            />
            <v-container class="text-right">
              <v-btn
                color="success"
                :right="true"
                class="ma-0"
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                Upload
                <v-icon right>
                  mdi-cloud-upload
                </v-icon>
              </v-btn>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        lg="12"
      >
        <base-material-card
          icon="mdi-clipboard-text"
          class="px-5 py-3 v-meterial-docs"
        >
          <template #after-heading>
            <div class="mr-auto text-right">
              <v-autocomplete
                v-if="user.role === 'admin'"
                v-model="customer"
                :items="allUsers"
                item-text="name"
                item-value="Id"
                label="Select Customer"
                prepend-inner-icon="mdi-account"
                required
                @input="changeUser"
              />
              <h2 v-else>
                All Documents
              </h2>
            </div>
          </template>
          <template v-if="progress">
            Getting your files
            <v-progress-linear
              color="green accent-4"
              indeterminate
              rounded
              height="6"
            />
          </template>
          <v-simple-table v-else>
            <thead>
              <tr v-ripple="{ center: true }">
                <th
                  v-for="(header, i) in headers"
                  :key="i"
                  class="primary--text"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody v-if="user.role === 'admin'">
              <template
                v-for="userDocs in allDocs"
              >
                <tr
                  v-for="(userdoc,useri) in userDocs"
                  :key="useri"
                >
                  <td>{{ useri }}</td>
                  <td>
                    <base-doc-view
                      :file="userdoc"
                      :title="useri"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
            <tbody v-else>
              <tr
                v-for="(item,i) in docs"
                :key="i"
              >
                <td>{{ i }}</td>
                <td>
                  <base-doc-view
                    :file="item"
                    :title="i"
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data: () => ({
      selectDoc: '',
      loading: false,
      fileName: '',
      progress: true,
      doc: '',
      docName: 'Pass Port',
      docDialog: false,
      file: [],
      customer: '',
      headers: ['Name', 'View'],
      documentsType: ['Passport', 'Visa', 'Others'],
      allDocs: [],
      alert: {
        value: false,
        text: 'Something went wrong',
        type: 'error',
      },
    }),
    computed: mapGetters(['docs', 'docAlert', 'allUsers', 'user']),
    watch: {
      docAlert ({ msg, val }, old) {
        this.loading = false
        this.alert.value = true
        this.alert.text = msg
        this.$refs.form.reset()
        setTimeout(() => (this.alert.value = false), 3000)
      },
      docs (n, od) {
        this.allDocs = n
        this.loading = false
        this.alert.value = false
        this.progress = false
        this.$refs.form.reset()
      },
    },
    created () {
      this.getDocs()
      this.getUsers()
    },
    methods: {
      ...mapActions(['getDocs', 'addDoc', 'getUsers', 'docError']),

      async formSubmit (e) {
        if (!this.$refs.form.validate()) return false
        this.loading = true
        const docName = this.selectDoc === 'Others' ? this.fileName : this.selectDoc
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('doc', docName)
        await this.addDoc(formData)
      },
      changeUser () {
        const docs = this.docs
        // eslint-disable-next-line no-prototype-builtins
        if (docs.hasOwnProperty(this.customer)) { this.allDocs = [docs[this.customer]] } else { this.allDocs = [] }
      },
    },
  }
</script>

<style lang="sass">
thead th:last-child
  text-align: center !important

.v-meterial-docs

  > div:first-child
    justify-content: space-between
</style>
