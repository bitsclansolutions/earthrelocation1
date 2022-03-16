<template>
  <div>
    <v-row
      v-for="(veh, i) in items"
      :key="i"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="veh.type"
          :items="vahicleOptions"
          label="Select Options"
          @change="changeField(items,'vehicles')"
        />
      </v-col>
      <v-col
        cols="12"
      >
        <car
          v-if="veh.type === 'Car'"
          ref="car"
          :inputs="veh.inputs"
          @updatefields="updateVehField($event,i)"
        />
        <truck
          v-if="veh.type === 'Truck/SUV'"
          :inputs="veh.inputs"
          @updatefields="updateVehField($event,i)"
        />
        <motor-cyle
          v-if="veh.type === 'MotorCyle'"
          :inputs="veh.inputs"
          @updatefields="updateVehField($event,i)"
        />
      </v-col>
      <v-col
        v-if="veh.type"
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="veh.condition"
          label="Vehicle Condition"
          row
        >
          <v-radio
            v-for="(label, val) in { used: 'Used', new: 'New' } "
            :key="val"
            :label="label"
            :value="val"
          />
        </v-radio-group>
      </v-col>
      <v-col
        v-if="veh.type"
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="veh.isRunningCondition"
          label="Vehicle in running condition?"
          row
        >
          <v-radio
            v-for="(label, val) in { yes: 'Yes', no: 'No' } "
            :key="val"
            :label="label"
            :value="val"
          />
        </v-radio-group>
      </v-col>
      <v-col
        v-if="veh.type"
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="veh.isFinanced"
          label="Is vehicle financed?"
          row
        >
          <v-radio
            v-for="(label, val) in { yes: 'Yes', no: 'No' } "
            :key="val"
            :label="label"
            :value="val"
          />
        </v-radio-group>
      </v-col>
      <v-col
        v-if="veh.type"
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="veh.isNext"
          label="Are you shipping additional vehicles?"
          row
          @change="veh.isNext === 'yes' ? updateVehicleCount(true,i+1): updateVehicleCount(false,i+1)"
        >
          <v-radio
            v-for="(label, val) in { yes: 'Yes', no: 'No' } "
            :key="val"
            :label="label"
            :value="val"
          />
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import Car from './Car'
  import MotorCyle from './MotorCycle'
  import Truck from './Truck'
  export default {
    components: { Car, MotorCyle, Truck },
    props: {
      vehicles: {
        type: [Object, Array],
        default: () => [],
      },
    },
    data () {
      return {
        fd: {
          isInsure: this.isInsure,
          vehicles: this.vehicles,
        },
        items: this.vehicles,
        vahicleOptions: [
          {text : 'Select vehicle type',disabled: true },
          {text : 'Car'},
          { text : 'Truck/SUV'},
          {text : 'MotorCyle'}
          ],
        opc: 0,
      }
    },
    watch: {
      vehicles: function (v) { this.items = v },
    },
    mounted () {
      if (!this.vehicles.length > 0) {
        this.updateVehicleCount(true)
      }
    },
    methods: {
      updateVehicleCount (inc, i = 0) {
        if (!inc) {
          if (i === 0) this.items = []
          this.items.splice(i, 1)
        } else {
          this.items.push({ type: '', inputs: {}, vehCondition: '', isRunningCondition: '', isFinanced: '', isNext: 'no' })
        }
      },
      changeField (val, name) {
        // console.log(val,name)
        // console.log('first')
        this.$emit('updateField', val, name)
      },
      updateVehField (fields, i) {
        let itemValue = this.items[i]
        itemValue = { ...itemValue, inputs: fields }
        this.items.splice(i, 1, itemValue)
        this.changeField(this.items, 'vehicle')
      },
    },
  }
</script>
