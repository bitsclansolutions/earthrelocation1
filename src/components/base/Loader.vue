<template>
  <v-dialog
    :v-model="dialog"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      color="success"
      dark
    >
      <v-card-text color="white">
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'Loader',

    props: {
      text: {
        type: String,
        default: 'Sending Data',
      },
      dialog: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>
