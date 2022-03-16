<template>
  <div id="app">
    <v-card class="justify-center">
      <v-card-title>
        Signature
      </v-card-title>
      <v-card-text class="justify-center text-center">
        <VueSignaturePad
          v-if="showPad && !readonly"
          ref="signaturePad"
          width="400px"
          readonly
          height="250px"
          :custom-style="signStyle"
        />
        <v-img
          v-if="readonly"
          :src="signUrl"
          max-height="250"
          max-width="400"
        />
      </v-card-text>
      <v-card-text
        v-if="buttons && !readonly"
        class="pb-6 text-center"
      >
        <v-btn
          color="blue"
          @click="undo"
        >
          Undo
        </v-btn>

        <!-- <v-btn
          color="success"
          @click="save"
        >
          Add
        </v-btn> -->
        <v-btn
          color="success"
          @click="reset"
        >
          Reset
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
  export default {
    name: 'SignaturePad',
    props: {
      value: {
        type: [Object, Array],
        default: () => [],
      },
      buttons: {
        type: Boolean,
        default: true,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        open: false,
        openBtn: false,
        deleteConfirm: false,
        signUrl: this.value.url || '',
        showPad: false,
        signStyle: { border: 'black 3px solid' },
      }
    },
    watch: {
      isOpen (val) {
        if (val) this.openPad()
      },
      value (val) {
        this.signUrl = val.url
        this.value.signUrl = val.url
      },
    },
    computed: {
      currentRouteName() {
        if(this.$route.name === 'View Booking')
        this.readonly = true
      }
    },
    mounted () {
      const self = this
      setTimeout(() => {
        self.show()
      }, 1000)
      this.currentRouteName
    },
    methods: {
      undo () {
        this.$refs.signaturePad.undoSignature()
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
      async show () {
        const self = this
        setTimeout(() => {
          self.showPad = true
        }, 100)
        if (!this.readonly && self.value.points) {
          setTimeout(() => {
            self.$refs.signaturePad.fromData(self.value.points)
          }, 150)
        }
      },
      reset () {
        this.$refs.signaturePad.clearSignature()
        // if (this.value.length) { this.$refs.signaturePad.fromData(this.value) }
      },
      async save () {
        const { isEmpty, data } = await this.$refs.signaturePad.saveSignature()
        const points = await this.$refs.signaturePad.toData()
        this.$emit('save', isEmpty ? {} : { points, url: data })
      },
      openPad () {
        this.open = true
      },
    },
  }
</script>
