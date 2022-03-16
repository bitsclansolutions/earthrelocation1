<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          ref="moveItems"
          v-model="fd.moveItems"
          :items="moveItemOptions"
          :rules="[rules.required]"
          label="What do you want to move?"
          @input="changeField(fd.moveItems, 'moveItems')"
        />
      </v-col>
    </v-row>
    <vehicle-motor-cycle
      v-if="'Vehicle or Motor Cycle Only' === fd.moveItems"
      :vehicles="fd.vehicles"
      @update="( $event, 'vehicles' )"
      @updateField="changeField()"
    />
    <boat
      v-if="'Boat/Yacht' === fd.moveItems"
      :inputs="fd.boat"
      @update="( $event, 'vehicles' )"
      @updatefields="boat"
    />
  </div>
</template>
 
<script>
  import VehicleMotorCycle from './Shipments/VehicleMotocycle'
  import Boat from './Shipments/Boat/Boat'
  export default {
    components: { VehicleMotorCycle, Boat },
    props: {
      fields: {
        type: Object,
        default: () => ({
          moveItems: '',
          vehicles: [],
          boat:{}
        }),
      },
      prefix: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        fd: this.fields,
        moveItemOptions: [
          'Household Goods by Air Freight',
          'Household Goods by Road Freight',
          'Household Goods by Ocean Transport',
          'Household Goods + Vehicle by Ocean Transport',
          'Household Goods + Vehicle by Road Transport',
          'Vehicle or Motor Cycle Only',
          'Household Goods + Vehicle by Road Transport',
          'Boat/Yacht',
          'Commercial',
        ],
        rules: {
          required: v => !!v || 'Required',
        },
      }
    },
    watch: {
      fields: {
        deep: true,
        handler (v) { this.fd = v },
      },
    },
    mounted(){

    },
    methods: {
      changeField (val, name) {

        this.$set(this.fd, name, val)
        this.$emit('updateField', this.fd, 'shipmentdetails')
      },
      boat (field) {

        this.changeField(field, 'boat')
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
    },
  }
</script>
