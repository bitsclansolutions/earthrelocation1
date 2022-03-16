<template>
  <v-container
    id="add-insurance"
    fluid
    tag="section"
  >
    <v-card
      class="text-right py-3 mt-0"
    >
      <h2
        style="float:left"
        class="px-5"
      >
        Total Amount
      </h2>
      <v-btn
        color="primary"
      >
        COVERAGE AMOUNT : ${{ coverageAmount }}
      </v-btn>
      <v-btn
        color="primary"
        class="display-1 font-weight-medium"
      >
        Premium Amount : ${{ totalAmount ? totalAmount : allFields.totalAmount }}
      </v-btn>
    </v-card>
    <v-stepper
      v-model="e1"
      transition="scroll-x-transition"
    >
      <v-stepper-header>
        <div
          v-for="step in steps.filter( i => i.enable)"
          :key="step.id"
        >
          <v-stepper-step
            editable
            :complete="e1 > step.id"
            :step="step.id"
          >
            {{ step.title }}
          </v-stepper-step>
        </div>
      </v-stepper-header>

      <v-stepper-items>
        <v-form
          ref="form"
          :disabled="isDisabled"
          @submit.stop.prevent="submitForm($event)"
        >
          <v-stepper-content
            step="1"
          >
            <contact-info
              ref="contact"
              :user-data="allFields.contact"
              @updateField="updateField"
            />
            <div
              class="d-flex justify-end"
            >
              <v-btn
                color="primary"
                @click="e1 = $refs.contact.validate() ? nextStepper(1) : 1"
              >
                Next
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content
            step="2"
          >
            <v-container
              v-if="!allFields.noInsurance"
              class="pa-1"
            >
              <v-select
                v-show="false"
                ref="policy"
                v-model="policyName"
                :items="policyOptions"
                label="Select Options"
                :rules="[v => !!v || 'Required']"
              />
              <p><b>Select Policy :</b></p>
              <policy-card
                :data="policyTc"
                :selected="policyName"
                @selected="policyName = $event;updateField($event, 'policy'); e1 = nextStepper(1)"
              />
            </v-container>
            OR
            <v-checkbox
              ref="noInsurance"
              v-model="allFields.noInsurance"
              label="I do not wish to buy Insurance"
              @change="noIns(allFields.noInsurance)"
            />
            <waiver
              v-if="allFields.noInsurance"
              ref="waiver"
              :is-open="e1 === 2"
              :readonly="isDisabled"
              :inputs="allFields.waiver"
              @updateField="updateField"
            />
            <div
              class="d-flex justify-space-between"
            >
              <v-btn
                color="primary"
                class="align-self-end"
                @click="e1 = prevStepper(2)"
              >
                Prev
              </v-btn>
              <v-btn
                v-if="allFields.noInsurance"
                color="primary"
                @click="submitWaiver();e1 = nextStepper(2)"
              >
                Next
              </v-btn>
              <v-btn
                v-else
                color="primary"
                class="align-self-end"
                @click="e1 = $refs.policy.validate(true) ? nextStepper(2) : 2"
              >
                Next
              </v-btn>
            </div>
          </v-stepper-content>
          <v-stepper-content
            v-if="steps[2].enable"
            step="3"
          >
            <amount-calculator
              v-if="policyName"
              ref="amtcal"
              :volume="allFields.volume"
              :amount="allFields.amount"
              :deductible="allFields.deductible"
              :policy="policyName"
              :mulamount="policyName === 'LUPSUM POLICY' ? 84 : 1"
              @deduct="updateDeduct"
              @updateAmount="allAmount.volume = $event;updateAmount()"
              @updateField="updateField"
            />
            <base-next-prev-btn
              @next="e1 = $refs.policy.validate(true) && $refs.amtcal.validate() ? nextStepper(3) : 3"
              @prev="e1 = prevStepper(3)"
            />
          </v-stepper-content>
          <v-stepper-content
            v-if="steps[3].enable"
            step="4"
          >
            <article-agreement
              ref="articleAgreement"
              :tc="allFields.agreements"
              @updateField="updateField"
            />
            <base-next-prev-btn
              @next="e1 = $refs.articleAgreement.validate() ? nextStepper(4) : 4"
              @prev="e1 = prevStepper(4)"
            />
          </v-stepper-content>
          <v-stepper-content
            v-if="steps[4].enable"
            step="5"
          >
            <article-items
              ref="articleItems"
              :items="allFields.article"
              @updateAmount="allAmount.article = $event;updateAmount()"
              @updateField="updateField"
            />
            <base-next-prev-btn
              @next="e1 = $refs.articleItems.validate() ? nextStepper(5) : 5"
              @prev="e1 = prevStepper(5)"
            />
          </v-stepper-content>

          <v-stepper-content
            v-if="steps[5].enable"
            step="6"
          >
            <extra-items
              ref="extraitems"
              :items="allFields.items"
              :policy="policyName"
              :over2500="allFields.over2500"
              :deductible="allFields.deductible"
              :coverage="allFields.coverage"
              @updateAmount="allAmount.items = $event;updateAmount()"
              @updateField="updateField"
            />
            <base-next-prev-btn
              @next="e1 = $refs.extraitems.validate() ? nextStepper(6) : 6"
              @prev="e1 = prevStepper(6)"
            />
          </v-stepper-content>

          <v-stepper-content
            v-if="steps[6].enable"
            step="7"
          >
            <vehicle
              ref="vehicle"
              :vehicles="allFields.vehicle"
              :is-insure="allFields.isVehicleInsurance"
              :policy="policyName"
              @updateAmount="allAmount.vehicles = $event;updateAmount()"
              @updateField="updateField"
              @next="e1 = 1"
            />
            <base-next-prev-btn
              @next="e1 = nextStepper(7)"
              @prev="e1 = prevStepper(7)"
            />
          </v-stepper-content>

          <v-stepper-content
            v-if="steps[7].enable"
            step="8"
          >
            <premium-calculator
              ref="premiumcals"
              :deductible="allFields.deductible"
              :coverage="allFields.coverage"
              :policy="policyName"
              @updateField="updateField"
              @deduct="updateDeduct"
            />
            <base-next-prev-btn
              @next="e1 = $refs.premiumcals.validate() ? nextStepper(8) : 8"
              @prev="e1 = prevStepper(8)"
            />
          </v-stepper-content>

          <v-stepper-content
            v-if="steps[8].enable"
            step="9"
          >
            <tnc
              ref="tnc"
              :inputs="allFields.tnc"
              :readonly="isDisabled"
              :is-open="e1 === 9"
              @updateField="updateField"
            />
            <base-next-prev-btn
              @next="submitTnc();e1 = $refs.tnc.validate() ? nextStepper(9) : 9"
              @prev="e1 = prevStepper(9)"
            />
          </v-stepper-content>
          <v-stepper-content
            v-if="steps[9].enable"
            step="10"
          >
            <preview
              :policy-name="policyName"
              :all-fields="allFields"
              :is-open="steps[9].enable"
            />
            <div
              class="d-flex justify-space-between"
            >
              <v-btn
                color="primary"
                class="align-self-end"
                @click="e1 = prevStepper(10)"
              >
                Prev
              </v-btn>
              <v-btn
                v-if="!isDisabled"
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading"
                @click.prevent="submitForm"
              >
                Submit
              </v-btn>
            </div>
          </v-stepper-content>
        </v-form>
      </v-stepper-items>
    </v-stepper>
    <base-material-snackbar
      v-model="snackbar.st"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
    </base-material-snackbar>
    <v-dialog
      v-model="premiumNotify"
      max-width="450"
    >
      <v-card>
        <v-card-title>
          <v-icon
            aria-label="Close"
            @click="premiumNotify = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text style="font-size:15px">
          When coverage amount falls below $3000 minimum premium amount shown above will apply.
        </v-card-text>

        <v-card-text class="pb-6 text-center">
          <v-btn
            color="success"
            text
            @click="premiumNotify = false"
          >
            Ok
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import JsPdf from 'jspdf'
  import 'jspdf-autotable'
  import ContactInfo from '../../components/InsuranceForm/ContactInfo'
  import Waiver from '../../components/InsuranceForm/insuranceWaiver'
  import AmountCalculator from '../../components/InsuranceForm/AmountCals'
  import ArticleAgreement from '../../components/InsuranceForm/ArticleAgreement'
  import ArticleItems from '../../components/InsuranceForm/ArticleItems'
  import ExtraItems from '../../components/InsuranceForm/Items'
  import Vehicle from '../../components/InsuranceForm/Vehicle/'
  import PremiumCalculator from '../../components/InsuranceForm/PremiumCals'
  import Tnc from '../../components/InsuranceForm/tnc'
  import PolicyCard from '../../components/InsuranceForm/PolicyCard'
  import Preview from './allSections'
  export default {
    components: { AmountCalculator, Waiver, ContactInfo, ArticleAgreement, ArticleItems, ExtraItems, Vehicle, PremiumCalculator, Tnc, PolicyCard, Preview },
    props: {
      sectionData: {
        type: Object,
        default: () => ({
          contact: {},
          policy: '',
          noInsurance: false,
          waiver: {},
          volume: '',
          amount: '',
          agreements: {},
          article: [],
          over2500: false,
          items: [],
          isVehicleInsurance: 'no',
          vehicle: [],
          deductible: '',
          totalAmount:'',
          coverageAmt:'',
          coverage: ({ pairs: '', mold: '', electrical: '' }),
          tnc: {},
        }),
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
      premiumCost: {
        type: Number,
        default: 0,
      },
      coverageCost: {
        type: Number,
        default: 0,
      },
      deductiveCost: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {
        publicPath: process.env.BASE_URL,
        e1: 1,
        premiumNotify: false,
        premnotify: 0,
        allFields: this.sectionData,
        loading: false,
        coverageAmount: this.coverageCost,
        steps: [],
        def: {
          extraItems: [{ name: '', value: '' }],
          vehicles: [],
        },
        policyName: this.sectionData.policy,
        policyOptions: ['LUMPSUM POLICY', 'VALUED INVENTORY', 'TOTAL LOSS'],
        allAmount: {
          volume: this.sectionData.amount,
          items: 0,
          article: 0,
          vehicles: 0,
        },
        policyTc: {
          'LUMPSUM POLICY': {
            name: 'All Risk - Lump Sum',
            pros: [
              'Offers great convenience by waiving the requirement to provide valued inventory. Insurance premium is calculated based on weight of the shipment. (Goods have to be insured at $12/Lb).',
              'Every item in the shipment is automatically covered based on weight of that item, therefore no risk involved.',
              'Preferred method to insure shipments.',
              'Co-Insurance penalty does not apply if the shipment is insured based on actual weight at $ 12/Lb.',
              'PBO items within the shipment have limited coverage.',
              'Any item valued at or over $2500 is considered to be High value and will need a professional appraisal or independently written support of value.'
            ],
          },
          'VALUED INVENTORY': {
            name: 'All Risk - Valued Inventory',
            pros: [
              'Coverage depends upon actual replacement value declared by client.',
              // 'Preferred method to insure shipments containing Regular-Value items.',
              'Entire shipment must be packed by Moving Company. Packed-By-Owner (No coverage under this policy for PBO items, however there is limited coverage under the Total Loss policy) items cannot be covered.',
              'Requires itemization of all items in the shipment & replacement value for each one.',
              'Undeclared items will not be covered .',
              'Undervaluation of items can lead to co insurance penalty.',
            ],
          },
          'TOTAL LOSS': {
            name: 'Total Loss',
            pros: [
              'Automatic coverage for all items regardless of party responsible for packing. Therefore \'Packed-By-Owner\' (PBO) items are also covered.',
              // 'Preferred method to insure shipments containing Low-Value items.',
              'Co-Insurance penalty does not apply.',
              'Claim can only be submitted if the whole shipment is lost/damaged/destroyed. Partial loss of any type is not covered. ',
            ],
          },
        },
        snackbar: { st: false, text: 'Updated', color: 'success' },
      }
    },
    computed: {
      ...mapGetters(['insAlert', 'totalDeductible', 'insuranceSections']),
      ...mapGetters({
        totalAmount: 'InsurancetotalAmount',
        coverageAmt: 'insurancecoverageAmt',
        allField: 'insuranceSections',
      }),
      extraItems () { return this.def.extraItems },
      vehicles () { return this.def.vehicles },
    },
    watch: {
      fields () {
        this.resetData()
      },
      policyName () {
        this.steps = this.getSteps()
        this.updateField(this.policyName, 'policy')
        this.premnotify = 0
        this.resetData()
      },
      coverageAmt (val) {
        console.log('valnew',val)
        this.coverageAmount = val
      },
      insAlert ({ msg, val }, old) {
        this.loading = false
        if (!val) this.$router.push('/my-insurance')
      },
    },
    created () {
      if (this.$route.path === 'my-insurance/add') { 
        console.log('my-insurance/add')
        this.resetData() 
        console.log('my-insurance/add')
        }
      this.steps = this.getSteps()
    },
    mounted () {
      if(this.$route.path === '/my-insurance/add'){ this.resetData() }
      this.noIns(this.allFields.noInsurance)
    },
    methods: {
      ...mapActions(['getInsurance', 'updateInsurance']),
      getSteps () {
        return [
          {
            id: 1,
            title: 'Contact Information',
            enable: true,
          },
          {
            id: 2,
            title: 'Policy Options',
            enable: true,
          },
          {
            id: 3,
            title: 'Amount',
            enable: this.policyName !== 'VALUED INVENTORY' && !this.allFields.noInsurance,
          },
          {
            id: 4,
            title: 'Agreements',
            enable: this.policyName === 'VALUED INVENTORY' && !this.allFields.noInsurance,
          },
          {
            id: 5,
            title: 'Articles',
            enable: this.policyName === 'VALUED INVENTORY' && !this.allFields.noInsurance,
          },
          {
            id: 6,
            title: 'Extra Items',
            enable: this.policyName === 'LUMPSUM POLICY' && !this.allFields.noInsurance,
          },
          {
            id: 7,
            title: 'Vehicle',
            enable: !this.allFields.noInsurance,
          },
          {
            id: 8,
            title: 'Premium Options',
            enable: this.policyName !== 'TOTAL LOSS' && !this.allFields.noInsurance,
          },
          {
            id: 9,
            title: 'Terms & Conditions',
            enable: !this.allFields.noInsurance,
          },
          {
            id: 10,
            title: 'Preview',
            enable: true,
          },
        ]
      },
      noIns ($enable) {
        this.steps = this.getSteps()
        if ($enable) {
          this.allFields.policy = ''
          this.updateField('', 'policy')
          this.resetData()
        }
        this.updateField(Boolean($enable), 'noInsurance')
      },
      async submitTnc () {
        await this.$refs.tnc.save()
      },
      async submitWaiver () {
        await this.$refs.waiver.save()
      },
      nextStepper (step) {
        return this.steps.find((st, i) => st.enable && i + 1 > step).id
      },
      prevStepper (step) {
        const enabledStep = this.steps.filter(i => i.enable)
        const currentStep = enabledStep.findIndex(el => el.id === step)
        return enabledStep[currentStep - 1].id
      },
      async updateDeduct (val) {
        const totalDeductible = val
        this.$store.commit('ADD_DEDUCTIBLE', totalDeductible)
        this.updateAmount()
      },
      updateAmount () {
        const Cost = Number(this.allAmount.article) + Number(this.allAmount.items) + Number(this.allAmount.vehicles) + Number(this.allAmount.volume)
        const covAmount = Number(Object.values(this.allAmount).reduce((a, b) => a + b))
        const covcost = Cost
        
        this.coverageAmount = covcost.toFixed(2)
        console.log('covcost',this.coverageAmount)
        if(isNaN(this.coverageAmount)){
          this.coverageAmount = 0
        }
        this.$store.commit('SET_COVERAGE', this.coverageAmount)
        let totalAmount = 0
        if (Number(this.totalDeductible)) {
          totalAmount = Number((covAmount / 100) * this.totalDeductible)
          console.log('totalAmount',totalAmount)
          if(sessionStorage.getItem('policy') === 'TOTAL LOSS'){
            if(totalAmount < 75){
              if(this.premnotify < 75){
                this.premiumNotify = true
              }
              let diff = Math.abs(totalAmount - 75)
              totalAmount = totalAmount + diff
              this.premnotify = totalAmount
            }
          }else{
            if(totalAmount < 90){
              if(this.premnotify < 90){
                this.premiumNotify = true
              }
              let diff = Math.abs(totalAmount - 90)
              totalAmount = totalAmount + diff
              this.premnotify = totalAmount
            }
          }
          totalAmount = totalAmount.toFixed(2)
          console.log('policy=>',this.policyName)

        }
        this.$store.commit('SET_INSURANCE_TOTAL_AMOUNT', totalAmount)
      },
      updateField ($ev, field) {
        console.log($ev, field)
        if(field === 'policy'){sessionStorage.setItem('policy', $ev);}
        const sections = this.insuranceSections || {}
        if (Object.prototype.hasOwnProperty.call(sections, field)) { sections[field] = $ev }
        this.$store.commit('INSURANCE_UPDATE_SECTIONS', sections)
      },
      resetData () {
        const amounts = this.allAmount
        Object.keys(this.allAmount).map(obj => (amounts[obj] = 0))
        this.allFields.allAmount = amounts
        this.allFields.amount = 0
        this.allFields.volume = 0
        this.allFields.items = []
        this.allFields.vehicle = []
        this.allFields.isInsure = false
        this.allFields.article = []
        this.allFields.over2500 = ''
        this.allFields.deductible = ''
        this.allFields.ttlDeductible = ''
        this.$store.commit('SET_DEDUCTIBLE', 0)
        this.$store.commit('VEH_COVERAGE', 0)
        this.$store.commit('MAIN_COVERAGE', 0)
        this.$store.commit('ART_COVERAGE', 0)
        this.$store.commit('ITEM_COVERAGE', 0)
        this.$store.commit('SET_COVERAGE', 0)
        this.$store.commit('ADD_DEDUCTIBLE', 0)
        this.updateAmount()
      },
      generatePDF () {
        const id = this.$route.params.id
        const ins = this.allFields
        const policy = ins.policy
        var pdf = new JsPdf({
          orientation: 'p',
          unit: 'mm',
          putOnlyUsedFonts: true,
        })
        pdf.autoTable({
          margin: { top: 10, left: 10 },
          theme: 'plain',
          bodyStyles: {
            cellWidth: 120,
            valign: 'middle',
          },
          body: [
            [
              { content: '', rowSpan: 2, styles: { cellPadding: 0 } },
              { content: 'Earth Relocation', styles: { fontStyle: 'bold' } },
            ],
            [
              {
                content: `1001 Roosevelt Avenue, Unit 4,
Carteret NJ 07008
Tel: +1 (201) 875 5400 | Cell : +1 (201) 234 9309
Fax: +1 (201) 875 5400
CTC: Samir Shah | info@earthrelocation.com`,
                styles: { fontSize: 9 },
              },
            ],
          ],
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
              const img = new Image()
              img.src = `${this.publicPath}company-logo.png`
              pdf.addImage(img, 'JPEG', data.cell.x, data.cell.y, 70, 20)
            }
          },
        })

        pdf.line(1, 40, 400, 40)
        if (!ins.noInsurance) {
          pdf.autoTable({
            margin: { top: 35, left: 10 },
            head: [['COVERAGE COST', 'PREMIUM COST']],
            body: [
              [`$${this.coverageAmount}`, `$${this.premiumCost}`],
            ],
          })
        }

        pdf.autoTable({
          margin: { top: 35, left: 10 },
          head: [[{ content: 'CONTACT INFORMATION :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`First Name : ${ins.contact.firstName}`, `Last Name : ${ins.contact.lastName}`],
            [`Origin Address : ${ins.contact.origAdd}`, `Destination Address : ${ins.contact.destAdd}`],
            [`Email : ${ins.contact.email}`, `Moving By : ${ins.contact.movingBy.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}`],
          ],
        })

        if (ins.noInsurance) {
          const { waiver } = ins
          pdf.autoTable({
            margin: { top: 35, left: 10 },
            headStyles: {
              halign: 'center',
            },
            theme: 'plain',
            head: [['INSURANCE WAIVER']],
            body: [
              [`Date : ${waiver.date}`],
              [`I the Undersigned ${waiver.name}, do hereby declare that Earth Relocation (the "Shipper Company") have offered me to purchase a Marine Insurance which covers my shipment while it's being handled by the Shipping Company.`],
              ['I hereby further declare that I have refused and declined to purchase the insurance offer by the shipping company ("Earth Relocation") and I, furthermore agree that neither I nor any person or entity acting on my behalf shall assign, grant, authorized or allow any subrogation of my rights against the shipping company in connection with my shipping and shall indemnify shipping company for any loss it incurs if I breach my agreement hereunder or as result of any claim or action of subrogation or otherwise asserted by any third party in connection with my shipment.'],
            ],
          })

          pdf.autoTable({
            margin: { top: 35, left: 10 },
            theme: 'plain',
            bodyStyles: {
              cellWidth: 95,
              valign: 'middle',
            },
            body: [
              [
                `Name : ${waiver.printName}`,
                { content: '', rowSpan: 3, styles: { minCellHeight: 50, minCellWidth: 95, cellPadding: 0 } },
              ],
            ],
            didDrawCell: (data) => {
              if (data.section === 'body' && data.column.index === 1) {
                const img = new Image()
                img.src = waiver.signature.url
                pdf.addImage(img, 'JPEG', data.cell.x + 20, data.cell.y, 50, 50)
              }
            },
          })
        } else {
          pdf.autoTable({
            margin: { top: 35, left: 10 },
            head: [[{ content: `POLICY : ${this.policyTc[policy].name}`, colSpan: 2 }]],
            bodyStyles: {
              cellWidth: 95,
            },
            body: [],
          })
          if (policy !== 'VALUED INVENTORY') {
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              head: [[{ content: 'AMOUNT ', colSpan: 2 }]],
              body: [
                policy === 'LUMPSUM POLICY'
                  ? [`Volume : ${ins.volume}`, `Amount : ${ins.amount}`]
                  : [`Amount : ${ins.amount}`, []],
                policy === 'LUMPSUM POLICY'
                  ? ['This is only an estimated premium, Actual amount wil be billed as per actual weight upon pickup']
                  : ['Does not include vehicle amount'],
              ],
            })

            pdf.autoTable({
              margin: { top: 35, left: 10 },
              theme: 'plain',
              head: [['Note : ']],
              body: [
                ['Included coverages: Pairs and set, Mold and Mildew, Electrical and mechanical Derangements'],
              ],
            })
          }
          if (policy === 'VALUED INVENTORY') {
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              head: [['Agreements']],
              body: [
                ['- Describe each item, give individual values. ITEMS NOT DECLARED & VALUED WILL NOT BE INSURED'],
                ['- Take into consideration what item will be worth at your new residence, not What they are worth before they are shipped.'],
                ['- If you are shipping a car, do not use it as a shipping container'],
                ['- Do not Dispose of or discard any item without written Authorization from UNIRISC.'],
                ['- Provide details of each set, a number of settings and value.'],
                ['- The policy does not insure such as jewelry, watches, currency, coins or stamp collections.'],
              ],
            })
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              theme: 'plain',
              head: [['Note : ']],
              body: [['All claims for high-value items will require proof of valuation in terms of purchase receipt(s) or published valuation in the public domain. If no such proof is available, a professional appraisal by a licensed appraiser is mandatory prior to pickup.']],
            })

            pdf.autoTable({
              margin: { left: 10 },
              theme: 'plain',
              head: [['Articles : ']],
            })

            const atricles = ins.article.map((i) => [i.cat, i.name, i.number, i.value, i.file])
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              head: [
                ['Category', 'Article', 'Number', 'Value', 'Doc'],
              ],
              willDrawCell (data) {
                if (data.row.cells[3] && parseInt(data.row.cells[3].raw) >= 2500) {
                  pdf.setFillColor(226, 207, 160)
                }
              },
              body: atricles,
            })
          }

          if (policy === 'LUMPSUM POLICY') {
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              theme: 'plain',
              head: [[`Do you have any items indivisual value over $2500 ? ${ins.over2500.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}`]],
            })

            pdf.autoTable({
              margin: { top: 10, left: 10 },
              theme: 'plain',
              head: [['Note : ']],
              body: [['All claims for high-value items will require proof of valuation in terms of purchase receipt(s) or published valuation in the public domain. If no such proof is available, a professional appraisal by a licensed appraiser is mandatory prior to pickup.']],
            })

            pdf.autoTable({
              margin: { left: 10 },
              theme: 'plain',
              pageBreak: 'always',
              head: [['Extra Items : ']],
            })

            const extraItems = ins.items.map((i) => [i.name, i.value])
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              head: [
                ['Name', 'Value'],
              ],
              body: extraItems,
            })
          }

          pdf.autoTable({
            margin: { top: 35, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            head: [['Insuring your Vehicle for Transit : ']],
            body: [
              ['If within the continental US, the vehicle value should be obtained from Kelly Blue Book based on the year, make, model and condition of the vehicle.'],
              ['If shipping the vehicle overseas, the vehicle value would be determined by Replacement Cost at destination of the vehicle based on same model, make, year, conditions and wear and tear of the vehicle. Check local car dealers for updated market value at destination.'],
            ],
          })

          pdf.autoTable({
            margin: { top: 35, left: 10 },
            theme: 'plain',
            head: [['Vahicles : ']],
          })

          if (ins.vehicle.length) {
            for (const i in ins.vehicle) {
              const thisVeh = ins.vehicle[i]
              pdf.autoTable({
                margin: { top: 35, left: 10 },
                head: [[{ content: `Selected Vahicle :${thisVeh.type}`, colSpan: 2 }]],
                bodyStyles: {
                  cellWidth: 95,
                },
                body: this.setVehTable(thisVeh.inputs, thisVeh.value, thisVeh.type),
              })
            }
          }

          pdf.autoTable({
            margin: { top: 35, left: 10 },
            theme: 'plain',
            head: [[`Premium Calculation : ${policy !== 'TOTAL LOSS' ? '$' + (ins.deductible === '3' ? '250' : '500') : '' } deductible ${ins.deductible || 2.5}%`]],
          })

          if (policy !== 'TOTAL LOSS') {
            pdf.autoTable({
              margin: { top: 35, left: 10 },
              head: [[{ content: 'Coverages', colSpan: 2 }]],
              bodyStyles: {
                cellWidth: 95,
              },
              body: [
                ['Pairs and Sets', ins.coverage.pairs + '%'],
                ['Mold and Mildew', ins.coverage.mold + '%'],
                ['Electrical and Mechanical Derangement', ins.coverage.electrical + '%'],
              ],
            })
          }

          pdf.autoTable({
            margin: { top: 20, left: 10 },
            head: [['Term and Conditions']],
          })

          pdf.autoTable({
            margin: { top: 0, left: 10 },
            theme: 'plain',
            head: [['To Cover']],
            showHead: 'firstPage',
            body: [['Household Goods/Personal Effects and Private Passenger Carrying Automobiles, Privately Owned Motorcycles and Privately Owned boats, not exceeding seventeen feet in length as limited or as excluding in this Certificate of Insurance while in the course of transportation']],
          })

          pdf.autoTable({
            margin: { top: 5, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            head: [[{ content: 'Transit Insurance Coverage' }]],
            body: [
              [`Except while on deck of ocean vessel subject to on-deck bill of lading:
Against all risks of physical loss or damage from any external cause,irrespective of percentage, but excluding those risks excepted by the Free of Capture and Seizure and Strikes, Riots, and Civil Commotions warranties, unless otherwise specifically noted hereon.`],
              [`While on deck of ocean vessel subject to an on-deck bill of lading:
Warranted free of particular average unless caused by the stranding, sinking, burning or collision of the vessel; but to pay the insured value of any merchandise or goods jettisoned or washed overboard, irrespective of percentage.`],
              ['This insurance is subject to the American Institute Cargo Clauses current on date of attachment of risk hereunder. Note SR&CC War Risk Insurance is included.'],
            ],
          })

          pdf.autoTable({
            margin: { top: 5, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            head: [[{ content: 'CONDITIONS OF COVERAGE' }]],
            body: [
              [`A. 100% Coinsurance Clause: The insured shall declare insurance on the entire shipment to the extent of the full
    value at the time of shipment and failing to do so, the insured shall, to the extent of such deficit; bear their
    proportion of any loss. Furthermore, in every event of loss or damage, the insurance shall not attach or cover for
    more than the amount specified opposite each category of goods listed in this certificate or as scheduled and filed
    with this certificate.`],
              [`B. Pairs & Sets Clause: Where any insurance items consists of articles in a pair or set, this certificate shall not pay
    more than the value of any particular part or parts, which may be lost or damaged, without reference to any
    special value which such article or articles may have as part of such pair or set, nor more than the proportionate
    part of the insured value of the pair or set.`],
              [`C. Valuation Clause: The household goods and personal effects insured must be valued either:

        1. At the replacement value at destination as supported by a complete valued inventory. Items of dissimilar value
          are to be individually insured. Items grouped together will have a maximum recovery of the aggregate value
          divided by the total number of items listed.

        2. At the replacement value of the entire shipment at destination as supported by a declared value in no instance
          less than US$12 times the net weight of the shipment in pounds plus the value of all items of unusual or unique
          value. Further the insured must provide a valued listing of all items valued over US$1,500 per item, set orentire
          contents of a box; otherwise reimbursement will be limited to that amount.

        3. Automobiles, motorcycles and boats must be valued at the cost to replace the item at destination with another
          of the same year, make and model.`],
              [`D. Deductible Clause: Each claim shall be adjusted separately and from the amount of each such adjusted claim or
    applicable limit of liability whichever is less, the deductible amount as shown on this certificate shall be deducted.
    Shipments in storage that are extended beyond the combined 180 day origin/destination SIT coverage must be
    approved by Unirisc, Inc. Shipments in USA storage are subject to the following deductibles for earthquake, wind
    and flood: US$5,000DA - losses up to $100,000, $7,500 - losses up to $200,000, $12,500 losses up to $500,000
    (MAY ONLY APPLY TO CERTAIN MOVING COMPANIES).`],
              [`E. Prima Facie Evidence Clause: The origin and/or destination shipping inventory as prepared by the mover shall be
    Prima Facie evidence of delivery of the shipment in good order with the except of any written notations made on
    such inventory by the Insured at the time of delivery, noting missing and/or damaged items`],
              [`F. Repair or Replacement Clause: DO NOT DISPOSE OF OR DISCARD ANY ITEM WITHOUT WRITTEN
    AUTHORIZATION Underwriters retain the right to inspect any item prior to its repair or disposal. Underwriters shall
    be entitled, at their sole option, to repair or replace with like kind and quality , any article lost or damaged
    (whether whole or in part) or to pay cash therefore not exceeding, in any event, the amount of the insured
    item. No betterment allowable.`],
              [`G. Salvage Clause: Where replacement or total loss payment of a damaged article(s) is made by Underwriters, they,
    at their option, have the right to salvage the damaged article (s).`],
              [`H. Claims Notification: In the event of loss, damage or non-delivery which may give rise to a claim under this
    certificate,immediate notice must be given, in writing, to Unirisc, Inc.at the address shown on this certificate.
    Failure to give such notice within 45 days after delivery of the shipment will void coverage under this certificate.`],
              [`I. Misrepresentation and Fraud: This entire certificate shall be void if, whether before or after a loss, the insured has
    concealed or misrepresented any material fact or circumstances concerning this insurance or the subject thereof,
    or the interest of the insured therein, or in case of any fraud or false swearing by the insured relating
    thereto.`],
              [`J. Suit Against Company: No suit, action or proceeding against this Company for recovery of any claim shall be
    sustainable unless commenced within one year from the date of the happening out of which the claim arises,
    provided that if such limitation is invalid by the laws of the state in which this certificate is issued then such suit,
    action or proceeding should be barred unless commenced within the shortest limit of time permitted by the laws
    of such state.`],
              [`K. Transit Limits:

        1. Household Goods: Coverage is to attach from date the Moving Company accepts property at origin residence
          which is the date shown on the Moving Company's origin shipping inventory and is continuous during the
          normal course of transit until the Moving Company delivers the property at destination residence provided that
          all other terms and conditions of this are met. The origin and destination referred to in this clause means the
          FROM and TO, as appropriate locations specified on this certificate.

        2. Automobiles, Motorcycles and Boats: Coverage is to attached from the date that the automobile, motorcycle
          or boat is placed in the custody of the Moving Company or Steamship Company and continues until the
          automobile, motorcycle and boat is delivered to the destination specified on this certificate, provided it is not
          operated on public or private roads under its own power. Further, coverage does not apply for any period
          exceeding 72 hours at destination ocean port, should the ocean port be the final destination. Excluding
          Recreational Vehicles.

        3. Storage In Transit Coverage Extensions: Coverage is intended to apply within the country of origin or final
          destination for a period of 180 day or as otherwise agreed provided that the property is stored in an enclosed,
          protect commercial Moving Company's household goods warehouse under the care, custody and control of the
          Thru-Bill of Lading Moving Company (or their designated agent). Mini-storage and/or self-storage facilities
          are excluded. Storage may be extended for additional periods of time storage subject to prior special written
          notice and payment of additional premium to Unirisc,.`],
              [`L. Other Insurance: This insurance does not cover to the extent of any other insurance, whether prior of subsequent
    hereto in date and by whomsoever effected, directly or indirectly covering the same property, and the Company
    shall be liable for loss or damage only for the excess value beyond the amount due from such other insurance.`],
              [`M. Subrogation Clause: The Company shall be subrogated to the extent of their payment for losses insured
    hereunder and to the insured's rights to recovery against any person or organization; excepting the origin and
    destination freight forwarders who performed pickup, packing, delivery and unpacking services in connection with
    the movement of the shipment other than in the event of gross negligence. All provisions of this clause not with
    standing, it is hereby warranted that the Insured shall take all necessary actions to protect the Company's rights
    of subrogation against culpable parties. Failure to take such action, causing prejudice to the Company's rights of
    subrogation, may result in denial or reduction of the claim.`],
              [`N. Burden/Duty of Insured: The burden of proof is upon the Insured to establish that loss and/or damage was incurred
    while under the ambit of this certificate's coverage. It is the duty of the Insured and their agents, in all cases, to
    take such measures as may be reasonable for the purpose of averting or minimizing a loss and to ensure that all
    rights against carriers, bailees, or other third parties are properly preserved and exercised. Failure by the
    Insured to fulfill these obligations could preclude recovery for any claimed loss and/or damage.`],
              [`O. High Value Articles: Any item with an individual value US$2,500 or more is defined as a "High Value Article".
    Items in this category must be specifically described, declared and valued in writing before the date property is
    picked up from the origin specified in this certificate.`],
              [`P. Premium Payment: Where the named insured herein has not paid premium directly to Unirisc, any party receiving
    premium from the herein named insured is construed as the Insured's agent for payment of said premium to
    Unirisc, and failure of Unirisc, Inc.to receive such premium will void any coverage under this certificate.`],
              ['Q. Surveys: Survey Inspection Fees are payable by this company only with prior consent by Unirisc.'],
              ['R. Abandonment: There cannot be any abandonment of any insured property to the Underwriters or anyone else.'],
              [`S. Assignment of Certificate: This certificate shall be void if assigned or transferred without the written
    consent of this Company.`],
              [`T. Total Loss/FPA: Warranted free of particular average unless caused by stranding, sinking, burning, and/or
    collision of the vessel; but to pay the insured value of any merchandise and/or goods jettisoned and/or washed
    overboard, irrespective of percentage No coverage for partial loss. Including theft and or non delivery of the
    entire shipment`],
            ],
          })
          pdf.autoTable({
            margin: { top: 5, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            head: [['This insurance is subject to the American Institute Cargo Clauses current on date of attachment of risk hereunder. Note SR&CC War Risk Insurance is included.']],
          })

          pdf.autoTable({
            margin: { top: 5, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            rowPageBreak: 'avoid',
            head: [['Exclusions : This insurance does NOT cover:']],
            body: [
              ['Damage including but not limited to mold, mildew, rust, and warping. Damages caused by climactic conditions. Spoilage or change in food or beverage of any kind.'],
              ['Loss or damage cause by normal wear and tear, mechanical or electrical derangement, wrinkling of clothing, worn shoes, purses, hand bags accessories and the like, discoloration of leather, infestation of vermin, moths, insects of any type or inherent vice. Loss or damage attributable to fumigation or contamination of the shipment from any cause.'],
              ['Jewelry, furs, cash, currency, bank notes, stocks, bonds, stamp and/or coin collections or any negotiable document. Collections and/or collectibles defined as but not limited to baseball cards, sports memorabilia, collectible toys, etc. are only insured if specifically declared, separately valued and appraised prior to shipment. Limited to maximum of 10% of the shipment value. Artwork and Antiques individually valued over $10,000 USD must be appraised by a professional appraisal firm or have a commercial invoice prior to shipping and must be approved by Unirisc.'],
              ['Missing and/or damaged items from within containers which were not packed by the current Household Goods Moving Company, unless loss/damage is caused by a direct result of fire, sinking, overturn, collision or theft of the transporting conveyance.'],
              ['Loss and/or damage of any type to an automobile or motorcycle while being driven under its own power except for the purpose of loading and unloading.'],
              ['Non-factory installed accessories and/or removable items on automobiles, motorcycles and boats unless specifically and individually declared and valued for insurance. Tools, batteries, extra tires, antennas, air bags and/or personal property shipped in automobiles, motorcycles and boats are not insured.'],
              ['Scratching, denting, chipping or marring of automobiles, motorcycles and boats over 5 years old. Scratching, denting, chipping or marring of automobiles, motorcycles and boats under 5 years old unless the shipper and the owner both agree to sign a "Condition Inspection Report" or similar document portraying the condition at origin and again at destination, noting all defects, if any. This policy excludes any coverage for recreational vehicles.'],
              ['Calibration and/or tuning of any item, machine, device or equipment.'],
              ['Acts of government officials and customs authorities, including confiscation. Consequential losses due to delay are not covered.'],
              ['Data contained on hard disks, diskettes, cassettes, video tapes, CD\'s, etc. Company\'s liability is limited to the cost of hardware only, except as may be excluded elsewhere in this certificate.'],
              ['Depreciation in market or appraised value of any item. Underwriter\'s liability hereon is governed by the "Repair and Replacement Clause" found in this certificate.'],
              ['Loss or damage of personal and/or professional papers/documents of any kind, including but not limited to dissertations, tax returns, medical and employment records; items have that have no market value (such as but not limited to photographs, family albums and pictures, sentimental items, newspaper clippings, etc.).'],
              ['Non delivery of a shipping package if the delivery receipt shows that all packages were delivered to the final destination.'],
              ['Items not listed in the inventory prepared at origin. Items not shipped are not insured.'],
            ],
          })

          pdf.autoTable({
            margin: { top: 5, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            head: [['OPTIONAL COVERAGE TERMS & CONDITIONS']],
            body: [
              ['Mold & Mildew - To include loss or damage in respect to mold & mildew to the interest insured, subject to goods being professionally packed.'],
              ['Electrical & Mechanical Derangement (Excluding Autos) - To include loss or damage to the interest insured which is caused by electronic and/or electrical and/or mechanical derangement, provided the interest insured is less than 6 years old. Subject to the goods being professionally packed.'],
              [`Pairs & Sets Coverage - In the event of loss or damage recoverable to any item or items forming part of a pair or set,
the indemnity afforded by this policy shall be limited to the reasonable and fair reduction in value of the pair or set
by reason of the loss or damage to the affected items. All the articles constituting the pair or set shall, at Underwriters
option become their property in the event that the Underwriters agree to pay the total loss of the pair or entire set.`],
            ],
          })
          pdf.autoTable({
            margin: { top: 20, left: 10 },
            theme: 'plain',
            showHead: 'firstPage',
            head: [['I agreed your terms and conditions']],
          })

          const { tnc } = ins
          pdf.autoTable({
            margin: { top: 35, left: 10 },
            theme: 'plain',
            bodyStyles: {
              cellWidth: 95,
              valign: 'middle',
            },
            body: [
              [
                `Name : ${tnc.name}`,
                { content: '', rowSpan: 3, styles: { minCellHeight: 50, minCellWidth: 95, cellPadding: 0 } },
              ],
              [`Date : ${tnc.date}`],
            ],
            didDrawCell: (data) => {
              if (data.section === 'body' && data.column.index === 1) {
                const img = new Image()
                img.src = tnc.signature.url
                pdf.addImage(img, 'JPEG', data.cell.x + 20, data.cell.y, 50, 50)
              }
            },
          })
        }

        pdf.autoTable({
          margin: { top: 35, left: 10 },
          bodyStyles: {
            cellWidth: 95,
          },
          body: [],
          didDrawPage: (data) => {
            const img = new Image()

            const pageSize = pdf.internal.pageSize
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            const footerX = data.settings.margin.left
            const footerY = pageHeight - 15
            pdf.setFontSize(8)

            pdf.line(1, footerY - 3, 400, footerY)

            img.src = `${this.publicPath}icons/home.png`
            pdf.addImage(img, 'PNG', footerX, footerY + 2, 4, 4)
            pdf.text('780 ROOSEVELT AVENUE, SUITE 233, IRVINE, CA 92620', footerX + 5, footerY + 5)

            img.src = `${this.publicPath}icons/mail.png`
            pdf.addImage(img, 'PNG', footerX + 130, footerY + 2, 4, 4)
            pdf.text('info@earthrelocation.com', footerX + 135, footerY + 5)

            img.src = `${this.publicPath}icons/phone.png`
            pdf.addImage(img, 'PNG', footerX, footerY + 7, 4, 4)
            pdf.text('Tel: +1(714)511-6300 | Fax: +1(714)655-7943 | Toll Free: +1(855)55-EARTH or (855)553-2784', footerX + 5, footerY + 10)

            img.src = `${this.publicPath}icons/web.png`
            pdf.addImage(img, 'PNG', footerX + 130, footerY + 7, 4, 4)
            pdf.text('www.earchrelocation.com', footerX + 135, footerY + 10)
          },
        })

        pdf.save(`insurance-${id}.pdf`)
      },

      setVehTable (inputs, value, type) {
        let basicData = [
          [`Year: ${inputs.year}`, `Manufacturer: ${inputs.manufacturer}`],
          [`Make: ${inputs.make}`, `Model: ${inputs.model}`],
          type !== 'Boat/ Yatch' ? [`Color: ${inputs.color}`, `VIN #: ${inputs.vin}`] : '',
          type === 'Truck/SUV' ? [`Number of Wheels: ${inputs.wheels}`] : '',
        ]

        if (type === 'Boat/ Yatch') {
          basicData = [
            ...basicData,
            [`Trailer VIN # : ${inputs.trailerVin}`, `Boat HULL # : ${inputs.boatVin}`],
            [`Length(ft) : ${inputs.length}`, `Width(ft) : ${inputs.width}`],
            [`Height(ft) : ${inputs.height}`, `Weight : ${inputs.weight}`],
          ]
        }

        basicData = [
          ...basicData,
          [{ content: `Value: $${value}`, colSpan: 2 }],
        ]
        return basicData.filter(i => i !== '')
      },
      async submitForm () {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.insuranceSections.firstName = this.insuranceSections.contact.firstName
          this.insuranceSections.lastName = this.insuranceSections.contact.lastName
          this.insuranceSections.email = this.insuranceSections.contact.email
          const formData = {
            ...this.insuranceSections,
            coverageAmt: this.coverageAmount,
            totalAmount: this.totalAmount,
            totalDeductible: this.totalDeductible,
          }
          if (this.$route.params.id) await this.updateInsurance({ data: formData, id: this.$route.params.id || '' })
          else await this.updateInsurance({ data: formData })
        } else {
          this.snackbar.st = true
          this.snackbar.text = 'Please fill all the required field'
          this.snackbar.color = 'error'
        }
      },
    },
  }
</script>
