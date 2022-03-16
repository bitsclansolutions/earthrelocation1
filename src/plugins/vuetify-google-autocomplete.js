import Vue from 'vue'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

Vue.directive('highlight', {
  inserted (el) {
    el.style.color = 'red'
  },
})

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyClqF0ssSzrlCp2sNXYyCHHsohPDpc21Yg', // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  version: '...', // Optional
  language: '...', // Optional
  installComponents: true, // Optional (default: true) - false, if you want to locally install components
  vueGoogleMapsCompatibility: false, // Optional (default: false) - true, requires vue2-google-maps to be configured see https://github.com/xkjyeah/vue-google-maps
})
