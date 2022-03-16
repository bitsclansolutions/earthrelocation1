<template>
  <div>
    <div
      :class="scroll ? 'tncOverflow overflow-y-auto' : ''"
    >
      <div
        v-for="(tp, i) in termnConditions"
        :key="`${tp.tag}${i}`"
        class="tnc"
      >
        <p v-if="tp.tag === 'p'">
          {{ tp.context }}
        </p>
        <h3 v-else-if="tp.tag === 'h3'">
          {{ tp.context }}
        </h3>
        <table v-else-if="tp.tag === 'table'">
          <thead v-if="tp.context.headers && tp.context.headers.length">
            <tr>
              <th
                v-for="(header) in tp.context.headers"
                :key="header"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody v-if="tp.context.body && tp.context.body">
            <tr
              v-for="(tblBody, tri) in tp.context.body"
              :key="tri"
            >
              <td
                v-for="(tblData, tdi) in tblBody"
                :key="tdi"
                :colspan="typeof tblData === 'object' ? tblData.colspan : ''"
              >
                {{ typeof tblData === 'object' ? tblData.text : tblData }}
              </td>
            </tr>
          </tbody>
        </table>
        <p
          v-else
          v-html="tp.context"
        />
      </div>
      <p>
        <v-checkbox
          ref="tncagree"
          :class="{ tncError : agreeclass }"
          v-model="fd.agree"
          :rules="[rules.required]"
          label="I agree your terms and conditions"
        />
      </p>
    </div>
    <v-row>
      <v-col>
        <v-text-field
          ref="name"
          v-model="fd.name"
          label="Name"
          :class="{ tncError : nameclass }"
          :rules="[rules.required]"
          @input="changeField('name', fd.name)"
        />
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
              
              v-model="fd.date"
              label="Date"
              :rules="[rules.required]"
              :class="{tncError : dateclass }"

              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            ref="datepicker"
            v-model="fd.date"
            class="ma-0"
            :rules="[rules.required]"
            @input="datePicker = false;changeField('date', fd.date)"
          />
        </v-menu>
      </v-col>
      <v-col>
        <base-signature-pad
          v-if="showPad || format==='pdf' || readonly"
          ref="pad"
          :value="fd.signature"
          :readonly="readonly"
          :rules="[rules.required]"
          :buttons="format!=='pdf'"
          @save="changeField('signature', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import termnConditions from './assets/tnc'
  export default {
    props: {
      inputs: {
        type: [Object, Array, String],
        default: () => ({
          agree: '',
          signature: {},
          name: '',
          date: new Date().toISOString().substr(0, 10),
        }),
      },
      format: {
        type: String,
        default: '',
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      scroll: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {
        fd: this.inputs,
        showPad: false,
        datePicker: '',
        rules: {
          required: v => !!v || 'Required',
        },
        nameclass : false,
        dateclass : false,
        agreeclass : false,

        termnConditions,
      }
    },
    watch: {
      isOpen (val) {
        if (val) this.openPad()
      },
      inputs: {
        deep: true,
        handler (v) { 
          if (v.date) {
            this.dateclass = false
          }
          if (v.agree === true) {
            this.agreeclass = false
          }
          this.fd = v
        },
      },
      nameclass:{
        handler(val){
          this.nameclass = val
        }
      },
      dateclass:{
        handler(val){
          this.dateclass = val
        }
      },
      agreeclass:{
        handler(val){
          this.agreeclass = val
        }
      },
    },
    methods: {
      changeField (name, val) {
        this.$set(this.fd, name, val)
        this.$emit('updateField', this.fd, 'tnc')
      },
      async validate () {
          await this.save()
          this.nameclass = false
          this.dateclass = false
          this.agreeclass = false
        if (!this.fd.agree) {
          this.agreeclass = true
        }
        else if(!this.fd.name){
          this.nameclass = true
        }
        else if(!this.fd.date){
          this.dateclass = true
        }
        // else if(!this.fd.signature.url){

        // }
        else{
          return this.inpValidate(this.$refs)
        }
      },
      openPad () {
        this.showPad = true
      },
      async save () {
        await this.$refs.pad.save()
      },
    },
  }
</script>

<style scoped>
.tncOverflow{
  max-height: 300px;
  background: #cccccc4d;
}
.tncOverflow::-webkit-scrollbar {
  width: 10px;
}
.tnc{
  padding: 10px;
}
h3{
  text-align: center;
}
table{
  border-collapse: collapse;
  width: 100%;
  margin: 5px;
}
table th, table td{
  border: 1px solid;
  text-align: center;
  padding: 10px;
}

/* Track */
.tncOverflow::-webkit-scrollbar-track {
  background: #c2c2c2
}

/* Handle */
.tncOverflow::-webkit-scrollbar-thumb {
  background: #03aa28;
}

/* Handle on hover */
.tncOverflow::-webkit-scrollbar-thumb:hover {
  background: #367644;
}


</style>
<style>
.tncError div div div label{
  color: red !important;
}
.tncError div div label{
  color: red !important;
}
</style>
