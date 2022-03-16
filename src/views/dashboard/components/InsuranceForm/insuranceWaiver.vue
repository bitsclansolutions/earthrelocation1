<template>
  <v-container>
    <h3 class="text-center">
      INSURANCE WAIVER
    </h3>
    <v-row>
      <v-col
        cols="12"
        md="3"
      >
        <v-menu
          v-model="datePicker"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              ref="date"
              v-model="savedData.date"
              prefix="Date : "
              :rules="[rules.required]"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="savedData.date"
            class="ma-0"
            @input="datePicker = false;changeField('date', savedData.date)"
          />
        </v-menu>
      </v-col>
    </v-row>
    <p>
      I the Undersigned <v-text-field
        ref="name"
        v-model="savedData.name"
        class="d-inline-block"
        :rules="[rules.required]"
        @input="changeField('name', savedData.name)"
      />, do
      hereby declare that Earth Relocation (the “Shipper Company”) have
      offered me to purchase a Marine Insurance which covers my shipment
      while it’s being handled by the Shipping Company.
    </p>
    <p>
      I hereby further declare that I have refused and declined to purchase
      the insurance offer by the shipping company (‘Earth Relocation’) and I,
      furthermore agree that neither I nor any person or entity acting on my
      behalf shall assign, grant, authorized or allow any subrogation of my
      rights against the shipping company in connection with my shipping and
      shall indemnify shipping company for any loss it incurs if I breach my
      agreement hereunder or as result of any claim or action of subrogation
      or otherwise asserted by any third party in connection with my
      shipment.
    </p>
    <v-row>
      <v-col
        cols="12"
        md="6"
        align-self="center"
      >
        <v-text-field
          ref="printName"
          v-model="savedData.printName"
          label="Print Name"
          :rules="[rules.required]"
          @input="changeField('printName', savedData.printName)"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <base-signature-pad
          v-if="showPad || readonly"
          ref="pad"
          :value="savedData.signature || {}"
          :readonly="readonly"
          @save="updateSign"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    props: {
      inputs: {
        type: [Object, Array],
        default: () => ({
          signature: {},
          printName: '',
          name: '',
          date: '',
        }),
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        menu2: false,
        date: '',
        datePicker: '',
        savedData: this.inputs,
        signData: {},
        showPad: this.isOpen || false,
        rules: {
          required: v => !!v || 'Required',
        },
      }
    },
    watch: {
      isOpen (val) {
        if (val) this.openPad()
      },
      inputs : { 
        deep:true,
        handler (v){
          console.log('watcherr',v)
          this.savedData = v 
        }
         },
    },
    mounted(){
      // console.log('mounted',this.inputs)
    },
    methods: {
      changeField () {


        this.$emit('updateField', this.savedData, 'waiver')

      },
      updateSign (val) {
        this.savedData.signature = val
        this.changeField()
      },
      validate () {
        return this.inpValidate(this.$refs)
      },
      openPad () {
        const self = this
        self.showPad = true
      },
      async save () {
        await this.$refs.pad.save()
      },
    },
  }
</script>
