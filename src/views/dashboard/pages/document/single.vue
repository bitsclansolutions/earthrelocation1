<template>
  <div>
    <v-container
      id="view-booking"
      ref="view-booking"
      class="align-center text-right"
      fluid
      tag="section"
    >
      <v-btn
        color="blue darken-2"
        class="ma-2 white--text"
        :to="{ name: 'Edit Document', params: { id: $route.params.id }}"
      >
        Edit
        <v-icon
          right
          dark
        >
          mdi-pencil
        </v-icon>
      </v-btn>
      <v-btn
        color="red"
        class="align-right justify-end ma-2 white--text"
        justify="end"
        @click="downloadFile(document.file)"
      >
        Download
        <v-icon
          right
          dark
        >
          mdi-file
        </v-icon>
      </v-btn>
      <v-skeleton-loader
        v-if="loader"
        v-bind="attrs"
        type="article, actions"
      />
      <v-card>
        <v-card-title>
          {{ document.type }}
        </v-card-title>
        <v-divider />
        <v-card-text
          v-if="document.file.match(/.(jpg|jpeg|png|gif)$/i)"
          class="justify-center text-center ma-auto"
          self-align="center"
        >
          <v-img
            :src="document.file"
            class="ma-auto"
            max-width="500"
          />
        </v-card-text>
        <v-card-text v-else-if="document.file.match(/.(pdf|pdfx)$/i)">
          <pdf
            :src="document.file"
          />
        </v-card-text>
        <v-card-text
          v-else
          class="justify-center"
        >
           <iframe :src="`https://docs.google.com/gview?url=${document.file}&embedded=true`" /> 
          <vue-doc-preview
            :value="document.file"
            type="office"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Axios from 'axios'
  import download from 'js-file-download'
  import pdf from 'vue-pdf'
  import VueDocPreview from 'vue-doc-preview'
  export default {
    components: { VueDocPreview, pdf },
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
      document () {
        this.loader = false
      },
    },
    created () {
      this.getDocuments({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getDocuments', 'error']),
      getFilename (url) {
        if (url) {
          var m = url.substring(url.lastIndexOf('/'))
          return m
        }
        return ''
      },
      downloadFile (url) {
        var config = {
          method: 'get',
          responseType: 'blob',
          url: url
        }
        const self = this
        Axios(config)
          .then(function (response) {
            console.log(response)
            download(response.data, self.getFilename(url))
          })
          .catch(function (error) {
            console.log(error)
            console.log(error.response)
          })
      },
    },
  }
</script>
