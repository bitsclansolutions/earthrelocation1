/* eslint-disable no-undef */
/* eslint-disable no-undef */
<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="600px"
      max-height="600px"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          {{ title }}
          <v-btn
            color="primary"
            style="float:right"
            @click="downloadFile(file)"
          >
            Download
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="file.match(/.(jpg|jpeg|png|gif)$/i)">
          <v-img
            :src="file"
            max-width="500"
          >
            <template #placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="primary lighten-5"
                />
              </v-row>
            </template>
          </v-img>
        </v-card-text>
        <v-card-text v-else>
          <iframe :src="`https://docs.google.com/gview?url=${file}&embedded=true`" />
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
    </v-dialog>
  </v-row>
</template>

<script>
  import Axios from 'axios'
  import download from 'js-file-download'
  export default {
    name: 'DocView',
    props: {
      file: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        dialogm1: '',
        dialog: false,
      }
    },
    methods: {
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
          url,
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

<style scoped>
 iframe{
   overflow:hidden;
   overflow-x:hidden;
   overflow-y:hidden;
   height:500px;
   width:100%;
   top:0px;
   left:0px;
   right:0px;
   bottom:0px
 }
</style>
