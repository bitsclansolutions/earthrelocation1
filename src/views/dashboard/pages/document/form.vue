<template>
  <v-container
    id="add-document"
    fluid
    tag="section"
  >
    <base-material-card class="px-5 py-3">
      <template #heading>
        <div class="display-2 font-weight-light">
          <v-icon>mdi-cloud-upload</v-icon>
          Upload Documents
        </div>
      </template>
      <v-form
        ref="form"
        @submit.stop.prevent="submitForm($event)"
      >
        <v-select
          v-model="selectDoc"
          :items="documentsType"
          :rules="[rules.required]"
          label="Document Type"
          prepend-icon="mdi-file-document"
        />
        <v-text-field
          v-if="selectDoc === 'Others'"
          v-model="fileName"
          prepend-icon="mdi-label-outline"
          label="Document Name"
          :rules="[rules.required]"
        />
        <v-file-input
          v-model="inputs.file"
          label="File input"
          :rules="[rules.required]"
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
    <base-material-snackbar
      v-model="snackbar.st"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
    </base-material-snackbar>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    props: {
      fields: {
        type: Object,
        default: () => ({
          type: 'Passport',
          file: '',
        }),
      },
      documentsType: {
        type: Array,
        default: () => ['Passport', 'Visa', 'Others'],
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },

    },
    
    data () {
    
   
      return {
        
        inputs: this.fields,
        selectDoc: this.documentsType.includes(this.fields.type) ? this.fields.type : 'Others',
        fileName: this.documentsType.includes(this.fields.type) ? '' : this.fields.type,
        loading: false,
        snackbar: { st: false, text: 'Updated', color: 'success' },
        rules: {
          required: v => !!v || 'Required',
        },
        
      }
      
    
    },
    
    computed: {
      ...mapGetters(['deliveryAlert', 'apiResponse']),
    },
    watch: {
      apiResponse ({ status, msg }) {
        this.loading = false
        this.snackbar.text = msg
        this.snackbar.st = true
        if (status) {
          this.snackbar.color = 'success'
          this.$router.push('/document')
        } else {
          this.snackbar.color = 'error'
        }
      },
    },
    methods: {
      ...mapActions(['updateDocument']),
      async submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          const data = new FormData()
          const docName = this.selectDoc === 'Others' ? this.fileName : this.selectDoc
          data.append('type', docName)
          data.append('file', this.inputs.file)
          // console.log(this.inputs.file)
          await this.updateDocument({ data, id: this.$route.params.id || false })
        } else {
          this.snackbar.st = true
          this.snackbar.text = 'Please fill all the required field'
          this.snackbar.color = 'error'
        }
      },
    },
  }
</script>

<style lang="sass">
  .theme--light.v-label
    color: #414141
</style>
