<template>
  <div>
    <p><b>Insuring your Vehicle for Transit:</b></p>
    <p>
      If within the continental US, the vehicle value should be obtained from Kelly Blue Book based on the year, make, model and condition of the vehicle. <br>
    </p>
    <p>
      If shipping the vehicle overseas, the vehicle value would be determined by Replacement Cost at destination of the vehicle based on same model, make, year, conditions and wear and tear of the vehicle.  Check local car dealers for updated market value at destination.
    </p>
    <v-radio-group
      v-model="fd.isInsure"
      label="Do you want to insure vehicle ?"
      row
      @change="fd.isInsure == 'yes' ? updateVehicleCount(true): updateVehicleCount(false,0);changeField(fd.isInsure,'isVehicleInsurance');"
    >
      <v-radio
        label="Yes"
        value="yes"
      />
      <v-radio
        label="No"
        value="no"
      />
    </v-radio-group>
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
        v-if="veh.isInsure"
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
          v-if="veh.type === 'Motorcycle'"
          :inputs="veh.inputs"
          @updatefields="updateVehField($event,i)"
        />
        <boat
          v-if="veh.type === 'Boat/ Yacht'"
          :inputs="veh.inputs"
          @updatefields="updateVehField($event,i)"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-if="veh.isInsure && veh.type"
          v-model="veh.value"
          label="Enter Value"
          dense
          outlined
          @input="updateAmount(veh);"
        />
      </v-col>
      <v-col
        v-if="veh.isInsure && veh.type"
        cols="12"
        md="12"
      >
        <v-radio-group
          v-model="veh.isNext"
          label="Need to insure another vehicle ?"
          row
          @change="veh.isNext === 'yes' ? updateVehicleCount(true,i+1): updateVehicleCount(false,i+1)"
        >
          <v-radio
            label="Yes"
            value="yes"
          />
          <v-radio
            label="No"
            value="no"
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
  import Boat from './Boat'
  export default {
    components: { Car, MotorCyle, Truck, Boat },
    props: {
      vehicles: {
        type: Array,
        default: () => [],
      },
      isInsure: {
        type: [String, Number, Boolean],
        default: 'no',
      },
      policy: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        fd: {
          isInsure: this.isInsure,
          vehicles: this.vehicles,
        },
        items: this.vehicles,
        vahicleOptions: ['Car', 'Truck/SUV', 'Motorcycle', 'Boat/ Yacht'],
        opc: 0,
      }
    },
    watch: {
      isInsure (v) { this.fd.isInsure = v },
      vehicles: function (v) { this.items = v },
    },
    mounted () {
      this.updateAmount()
    },
    methods: {
      updateVehicleCount (inc, i = 0) {
        console.log('inc,i',inc,i)
        if (!inc) {
          if (i === 0) this.items = []
          this.items.splice(i, 1)
        } else {
          this.items.push({ isInsure: 'yes', type: '', inputs: {}, orgVal: '', value: '', isNext: 'no', deductible: {} })
        }
        this.updateAmount()
      },
      async updateAmount (veh = { value: 0 }) {

        const amt = Number(this.items.reduce((a, b) => { return Number(a) + Number(b.value) }, 0))
        console.log('amt',amt)
        await this.$store.dispatch('setVehCoverage', amt)
        this.$emit('updateAmount', amt)
        this.changeField(this.items, 'vehicle')
      },
      changeField (val, name) {
        // val.map((v)=>{
        //   v.value = Number(v.value)
        // });
        // console.log('val, name',val, name)

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
