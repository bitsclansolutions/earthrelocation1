<template>
  <div
    class="d-flex justify-space-between"
  >
    <v-btn
      color="primary"
      @click="$emit('prev')"
    >
      Prev
    </v-btn>
    <v-btn
      color="primary"
      @click="$emit('next')"
    >
      Next
    </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'NextPrevBtn',
  }
</script>
