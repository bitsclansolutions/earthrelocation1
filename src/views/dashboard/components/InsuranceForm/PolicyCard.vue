<template>
  <v-row>
    <v-col
      v-for="(policy, n) in data"
      :key="`policy-${n}`"
      cols="12"
      md="4"
      class="d-flex flex-column"
    >
      <base-material-card
        :class="`flex d-flex flex-column ${n === selected ? 'active' : ''}`"
        color="green"
      >
        <template #heading>
          <h3
            v-if="n === 'LUMPSUM POLICY'"
            class="recomand ml-n7 px-5 py-1"
          >
            Recommended
          </h3>
          <div class="display-2 font-weight-light mt-5 text-center">
            {{ policy.name.toUpperCase() }}
          </div>
        </template>
        <v-card-text>
          <v-list-item
            v-for="(pro, p) in policy.pros"
            :key="`policyrule-${n}-${pro}`"
            class="pa-0"
          >
            <v-list-item-content>{{ p+1 }} {{ pro }}</v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions
          style="height: 100%"
          class="mx-10 mb-5"
        >
          <v-btn
            color="primary align-self-end"
            style="background-image: linear-gradient(to right, rgb(75, 197, 90) 0%, rgb(4, 81, 32) 100%);"
            block
            @click="$emit('selected', n)"
          >
            Select
          </v-btn>
        </v-card-actions>
      </base-material-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      selected: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style scoped>
  .v-card.active{
    box-shadow: 0px 3px 6px 0px #4caf50, 0px 2px 2px 0px #4caf50, -1px 1px 2px 0px #4caf50;
  }
  .recomand{
    position: absolute;
    top: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-image: linear-gradient(to right, rgb(234 223 65) 0%, rgb(198 202 23) 100%);
  }
</style>
