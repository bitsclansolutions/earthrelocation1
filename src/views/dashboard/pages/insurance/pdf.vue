<template>
  <div ref="content">
    <v-container>
      <div
        style="text-align:right"
        class="text-right py-3 mt-0"
      >
        <h2
          style="float:left"
          class="px-5"
        >
          Total Amount
        </h2>
        <!-- <button @click="downloadPDF">Download</button> -->

        <v-btn
          color="primary"
          @click="downloadPDF"
        >
          Download
        </v-btn>

        <v-btn
          color="primary"
        >
          Coverage Cost : ${{ insurance.covAmount }}
        </v-btn>
        <v-btn
          color="primary"
        >
          Premium Amount : ${{ insurance.totalAmount }}
        </v-btn>
      </div>
    </v-container>
    <v-container>
      <h2> Contact Information </h2>
      <v-row>
        <v-col cols="6">
          First Name : {{ insurance.firstName }}
        </v-col>
        <v-col cols="6">
          last Name : {{ insurance.lastName }}
        </v-col>
        <v-col cols="6">
          Orgin Address : {{ insurance.origAdd }}
        </v-col>
        <v-col cols="6">
          Destination Address : {{ insurance.destAdd }}
        </v-col>
        <v-col cols="6">
          Email : {{ insurance.email }}
        </v-col>
        <v-col cols="6">
          Moving By : {{ insurance.movingBy }}
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <h2> Policy </h2>
      <v-row>
        <v-col cols="12">
          <p>Policy : {{ insurance.policy }}</p>
          <p><b>Pros : </b></p>
          <p
            v-for="(pros, i) in policyTc[insurance.policy].pros"
            :key="i"
          >
            - {{ pros }}
          </p>
          <p><b>Cons : </b></p>
          <p
            v-for="(cons, i) in policyTc[insurance.policy].cons"
            :key="i"
          >
            - {{ cons }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="policyName !== 'VALUED INVENTORY'">
      <h2> Amount </h2>
      <v-row>
        <v-col cols="6">
          Volume : {{ insurance.volume }}
        </v-col>
        <v-col cols="6">
          Amount : {{ insurance.amount }}
        </v-col>
        <v-col
          v-if="policyName === 'LUMPSUM POLICY'"
          cols="12"
        >
          <p>This is only an estimated premium, Actual amount wil be billed as per actual weight upon pickup</p>
        </v-col>
        <v-col cols="12">
          <p><b>Note : </b></p>
          <p>Included coverages: Pairs and set, Mold and Mildew, Electrical and mechanical Derangements</p>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="policyName === 'VALUED INVENTORY'">
      <h2> Agreements </h2>
      <article-agreement
        :tc="insurance.tc"
      />
    </v-container>

    <v-container v-if="policyName === 'VALUED INVENTORY'">
      <h2> Article </h2>
      <article-items
        :items="insurance.article"
        format="pdf"
      />
    </v-container>

    <v-container v-if="policyName === 'LUMPSUM POLICY'">
      <h2> Extra Items </h2>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in insurance.items"
              :key="i"
            >
              <td>{{ item.name }}</td>
              <td> ${{ item.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
    <v-container>
      <h2> Vehicles </h2>
      <vehicle
        :vehicles="insurance.vehicles"
        :is-insure="insurance.isInsure"
        :policy="policyName"
      />
    </v-container>

    <v-container>
      <h2> Premium Calculs </h2>
      <premium-calculator
        :deductible="insurance.deductible"
        :policy="policyName"
      />
    </v-container>

    <v-container>
      <h2> Term & Conditions </h2>
      <tnc
        :inputs="insurance.tnc"
        :is-open="true"
        format="pdf"
        :policy="policyName"
      />
    </v-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ArticleAgreement from '../../components/InsuranceForm/ArticleAgreement'
  import ArticleItems from '../../components/InsuranceForm/ArticleItems'
  import Vehicle from '../../components/InsuranceForm/Vehicle/'
  import PremiumCalculator from '../../components/InsuranceForm/PremiumCals'
  import Tnc from '../../components/InsuranceForm/tnc'

  // pdf maker
  import jsPDF from 'jspdf'
  import 'jspdf-autotable'
  export default {
    components: { ArticleAgreement, ArticleItems, Vehicle, PremiumCalculator, Tnc },
    props: {
      id: {
        type: [Number, String],
        default: '',
      },

    },
    data () {
      return {
        formId: this.id || this.$route.params.id,
        policyName: '',

        policyTc: {
          'LUMPSUM POLICY': {
            name: 'All Risk – Lump Sum',
            pros: [
              'Offers great convenience by waiving the requirement to provide valued inventory.',
              'Every item in the shipment is automatically covered therefore no risk involved.',
              'Preferred method to insure shipments containing High-Value items.',
              'Co-Insurance penalty does not apply.',
            ],
            cons: [
              'Can get expensive due to high premium.',
              'Does not offer saving opportunity as ‘Packed-By-Owner’ (PBO) items are not covered.Entire shipment must be packed by Moving Company.',
            ],
          },

          'VALUED INVENTORY': {
            name: 'All Risk – Valued Inventory',
            pros: [
              'Lower premium as coverage depends upon actual replacement value by itemization.',
              'Preferred method to insure shipments containing Regular-Value items.',
            ],
            cons: [
              'Entire shipment must be packed by Moving Company. Packed-By-Owner (PBO) items cannot be covered.',
              'Requires itemization of all items in the shipment & replacement value for each one.',
              'Undeclared items will not be covered therefore carries some risk.',
              'Failure to insure your shipment at 100% of value will result in a Co – Insurance penalty.',
              'Does not offer saving opportunity as ‘Packed-By-Owner’ (PBO) items are not covered. Entire shipment must be packed by Moving Company.',
            ],
          },
          'TOTAL LOSS': {
            name: 'Total Loss',
            pros: [
              'Automatic coverage for all items regardless of party responsible for packing. Therefore ‘Packed-By-Owner’ (PBO) items are also covered',
              'Preferred method to insure shipments containing Low-Value items.',
              'Co-Insurance penalty does not apply.',
            ],
            cons: [
              'Extremely rare chances of qualification towards claims.',
              'Individual damages to items NOT covered unless entire shipment is lost/damaged. Therefore carries higher risk.',
            ],
          },
        },
      }
    },
    computed: mapGetters(['insurance']),

    created () {
      this.policyName = this.insurance.policy
    },

    methods: {

      // eslint-disable
      downloadPDF () {
        // eslint-disable-next-line new-cap
        var pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true,

        })
        pdf.getFontList({ Roboto: ['bold'] })
        pdf.setFontSize(26).text('This  is Heading', 70, 20)
        pdf.setLineWidth(0.2)
        pdf.line(200, 25, 10, 25)
        pdf.setFontSize(16)
        pdf.text('Total Cost : ', 10, 32)
        pdf.autoTable({
          // styles: { fillColor: [255, 0, 0] },
          // columnStyles: { 0: { halign: 'center' } }, // Cells in first column centered and green
          margin: { top: 35, left: 10 },
          theme: 'grid',
          head: [['Coverage Cost :', 'Premium Amount :']],

          body: [
            [`${this.insurance.covAmount}`, `${this.insurance.covAmount}`],
          ],
        })

        // contac information

        pdf.text('Contact Information : ', 10, 56)
        pdf.autoTable({
          // styles: { fillColor: [255, 0, 0] },
          // columnStyles: { 0: { halign: 'center' } }, // Cells in first column centered and green
          margin: { top: 10, left: 10 },
          theme: 'grid',
          head: [['Name :', 'Email :', 'Moving By :']],

          body: [
            [`${this.insurance.firstName}  ${this.insurance.lastName}`, `${this.insurance.email}`, `${this.insurance.movingBy}`],
          ],
        })

        pdf.setFontSize(14).text('Orgin Address : ', 10, 85)
        pdf.setFontSize(10).text(`${this.insurance.origAdd}`, 10, 93)
        pdf.setFontSize(14).text('Destination Address : ', 110, 85)
        pdf.setFontSize(10).text(`${this.insurance.destAdd}`, 110, 93)

        // Policy
        pdf.setFontSize(14).text('Policy : ', 10, 120)
        pdf.setFontSize(10).text(`${this.insurance.policy}`, 10, 126)

        // poros
        pdf.setFontSize(12).text('Pros : ', 10, 134)
        var props = []
        for (var i in this.policyTc[this.insurance.policy].pros) {
          props.push('- ' + this.policyTc[this.insurance.policy].pros[i])
        }
        var splitTitle = pdf.splitTextToSize(props, 210)
        pdf.setFontSize(10).text(splitTitle, 10, 140)

        // cons
        pdf.setFontSize(12).text('Cons : ', 10, 165)
        var cons = []
        for (var po in this.policyTc[this.insurance.policy].cons) {
          cons.push('- ' + this.policyTc[this.insurance.policy].cons[po])
        }
        var splitTitle2 = pdf.splitTextToSize(cons, 210)
        pdf.setFontSize(10).text(splitTitle2, 10, 170)

        // pdf.setFontSize(14).text(`Agreements: ` , 10, 200)

        if (this.insurance.policy === 'TOTAL LOSS') {
          pdf.setFontSize(14).text('Amount : ', 10, 200)
          pdf.setFontSize(12).text(`Volume : ${ this.insurance.volume} `, 10, 206)
          pdf.setFontSize(12).text(`Amount : ${ this.insurance.amount} `, 10, 211)
        }

        if (this.insurance.policy === 'LUMPSUM POLICY') {
          pdf.setFontSize(10).text('This is only an estimated premium, Actual amount wil be billed as per actual weight upon pickup ', 10, 200)

          pdf.setFontSize(12).text('Note :', 10, 206)
          pdf.setFontSize(10).text('Included coverages: Pairs and set, Mold and Mildew, Electrical and mechanical Derangements :', 10, 211)

          pdf.setFontSize(14).text('Extra Items', 10, 215)

          pdf.autoTable({
            // styles: { fillColor: [255, 0, 0] },
            // columnStyles: { 0: { halign: 'center' } }, // Cells in first column centered and green
            margin: { top: 35, left: 10 },
            theme: 'grid',
            head: [['Name :', 'Value :']],

            body: [

              [`${this.insurance.items.name}`, `${this.insurance.items.value}`],
            ],
          })
        }

        if (this.insurance.policy === 'VALUED INVENTORY') {
          pdf.setFontSize(14).text('Article: ', 10, 200)

          pdf.setFontSize(12).text('Note: ', 10, 205)

          var t1 = pdf.splitTextToSize('All claims for high-value items will require proof of valuation in terms of purchase receipt(s) or published valuation in the public domain. If no such proof is available, a professional appraisal by a licensed appraiser is mandatory prior to pickup.', 210)

          pdf.setFontSize(12).text(t1, 10, 211)
        }

        // terms and Conditions

        pdf.setFontSize(14).text('Term & Conditions : ', 10, 225)

        pdf.setFontSize(12).text('To Cover : ', 10, 230)
        pdf.setFontSize(10).text(` Household Goods/Personal Effects and Private Passenger Carrying Automobiles, Privately Owned Motorcycles
and Privately Owned boats, not exceeding seventeen feet in length as limited or as excluding in thisCertificate of Insurance
while in the course of transportation `, 10, 234)

        pdf.setFontSize(12).text('Transit Insurance Coverage ', 10, 250)

        pdf.setFontSize(10).text(`Except while on deck of ocean vessel subject to on-deck bill of 
Against all risks of physical loss or damage from any external cause,irrespective of percentage,
but excluding those risks excepted by the Free of Capture and Seizure and Strikes, Riots,
and Civil Commotions warranties, unless otherwise specifically noted hereon. `, 10, 256)

        pdf.setFontSize(10).text(`While on deck of ocean vessel subject to an on-deck bill of lading: 
Warranted free of particular average unless caused by the stranding, sinking, burning or collision of the vessel;but to pay
 the insured value of any merchandise or goods jettisoned or washed overboard, irrespective of percentage. 

This insurance is subject to the American Institute Cargo Clauses current on date of attachment of risk hereunder.
Note SR&CC War Risk Insurance is included.`

                                 , 10, 275)

        pdf.addPage()
        pdf.setFontSize(12).text('CONDITIONS OF COVERAGE ', 10, 10)
        pdf.setFontSize(10).text('A)100% Coinsurance Clause : ', 10, 15)

        pdf.setFontSize(10).text(`A)100% Coinsurance Clause : The insured shall declare insurance on the entire shipment to the extent 
of the full value at the time of shipment and failing to do so, the insured shall, to the extent of such deficit; bear their 
proportion ofany loss.  Furthermore, in every event of loss or damage, the insurance shall not attach or cover for morethan
the amount specified opposite each category of goods listed in this certificate or as scheduled andfiled with this certificate.

B) Pairs & Sets Clause: Where any insurance items consists of articles in a pair or set, this certificate shall not pay more
 than the value of any particular part or parts, which may be lost or damaged, without reference to any special value which
  such article or articles may have as part of such pair or set, nor more than the proportionate part of the insured value 
of the pair or set.

C) Valuation Clause: The household goods and personal effects insured must be valued either :

   1) At the replacement value at destination as supported by a complete valued inventory. Items of dissimilar value are to be 
   individually insured. Items grouped together will have a maximum recovery of the aggregate value divided by the total number
   of items listed.
   2)At the replacement value of the entire shipment at destination as supported by a declared value in no instance less than
   US$12 times the net weight of the shipment in pounds plus the value of all items of unusual or unique value. Further the 
   insured must provide a valued listing of all items valued over US$1,500 per item, set or entire contents of a box; otherwise 
   reimbursement will be limited to that amount
   3) Automobiles, motorcycles and boats must be valued at the cost to replace the item at destination with another of the same 
   year, make and model


D) Deductible Clause: Each claim shall be adjusted separately and from the amount of each such adjusted claim or 
applicable limit of liability whichever is less, the deductible amount as shown on this certificate shall be 
deducted. Shipments in storage that are extended beyond the combined 180 day origin/destination SIT coverage 
must be approved by Unirisc,, Inc. Shipments in USA storage are subject to the following deductibles for 
earthquake, wind and flood: US$5,000DA – losses up to $100,000, $7,500 – losses up to $200,000, $12,500 losses
up to $500,000(MAY ONLY APPLY TO CERTAIN MOVING COMPANIES)

E) Prima Facie Evidence Clause:  The origin and/or destination shipping inventory as prepared by the mover shall 
be Prima Facie evidence of delivery of the shipment in good order with the except of any written notations made 
on such inventory by the Insured at the time of delivery, noting missing and/or damaged items

F) Repair or Replacement Clause: DO NOT DISPOSE OF OR DISCARD ANY ITEM WITHOUT WRITTEN
AUTHORIZATION Underwriters
retain the right to inspect any item prior to its repair or disposal. Underwriters shall be entitled, at their 
sole option, to repair or replace with like kind and quality , any article lost or damaged (whether whole or in 
part) or to pay cash therefore not exceeding, in any event, the amount of the insured item. No betterment
allowable.

G) Salvage Clause: Where replacement or total loss payment of a damaged article(s) is made by Underwriters,
they, at their sole option,have the right to salvage the damaged article (s).

H) Claims Notification: In the event of loss, damage or non-delivery which may give rise to a claim under this 
certificate, immediate notice must be given, in writing, to Unirisc, Inc.at the address shown on this 
certificate. Failure to give such notice within 45 daysafter delivery of the shipment will void coverage under
 this certificate.

I) Misrepresentation and Fraud: This entire certificate shall be void if, whether before or after a loss, the 
insured has concealed or misrepresented any material fact or circumstances concerning this insurance or the
 subject thereof, or the interest of the insured therein, or in case of any fraud or false swearing by the 
insured relating thereto.

J) Suit Against Company: No suit, action or proceeding against this Company for recovery of any claim shall 
be sustainable unless commenced within one year from the date of the happening out of which the claim arises,
 provided that if such limitation is invalid by the laws of the state in which this certificate is issued 
then such suit, action or proceeding should be barred unless commenced within the shortest limit of time 
permitted by the laws of such state.

K) Transit Limits :
   1)Household Goods: Coverage is to attach from date the Moving Company accepts property at origin residence
    which is the date shown on the Moving Company’s origin shipping inventory and is continuous during the 
    normal course of transit until the Moving Company delivers the property at destination residence provided 
    that all other terms and conditions of this are met. The origin and destination referred to in this clause
    means the FROM and TO, as appropriate locations specified on this certificate.

  
   
 
  

`

                                 , 10, 20)

        pdf.addPage()
        pdf.setFontSize(10).text(`
  2) Automobiles, Motorcycles and Boats: Coverage is to attached from the date that the automobile, motorcycle
  or boat is placed in the custody of the Moving Company or Steamship Company and continues until the 
  automobile, motorcycle and boat is delivered to the destination specified on this certificate, provided 
  it is not operated on public or private roads under its own power.Further, coverage does not apply for 
  any period exceeding 72 hours at destination ocean port, should the ocean port be the final destination. 
  Excluding Recreational Vehicles.

  3) Storage In Transit Coverage Extensions: Coverage is intended to apply within the country
  of origin or final destination for a period of 180 day or as otherwise agreed provided that the property is stored 
  in an enclosed, protect commercial Moving Company’s household goods warehouse under the care, custody and control 
  of the Thru-Bill of Lading Moving Company (or their designated agent). Mini-storage and/or self-storage facilities
  are excluded. Storage may be extended for additional periods of time storage subject to prior special written 
  notice and payment of additional premium to Unirisc,. 

L) Other Insurance: This insurance does not cover to the extent of any other insurance, whether prior of subsequent
 hereto in date and by whomsoever effected, directly or indirectly covering the same property, and the Company 
 shall be liable for loss or damage only for the excess value beyond the amount due from such other insurance.
 
M) Subrogation Clause: The Company shall be subrogated to the extent of their payment for losses insured hereunder 
and to the insured’s rights to recovery against any person or organization; excepting the origin and destination 
freight forwarders who performed pickup, packing, delivery and unpacking services in connection with the movement 
of the shipment other than in the event of gross negligence. All provisions of this clause notwithstanding, it is
hereby warranted that the Insured shall take all necessary actions to protect the Company’s rights of subrogation
against culpable parties. Failure to take such action, causing prejudice to the Company’s rights of subrogation,
may result in denial or reduction of the claim. 
 
N) Burden/Duty of Insured: The burden of proof is upon the Insured to establish that loss and/or damage was incurred
while under the ambit of this certificate’s coverage. It is the duty of the Insured and their agents, in all cases,
to take such measures as may be reasonable for the purpose of averting or minimizing a loss and to ensure that all
rights against carriers, bailees, or other third parties are properly preserved and exercised. Failure by the 
Insured to fulfill these obligations could preclude recovery for any claimed loss and/or damage.

O) High Value Articles: Any item with an individual value US$2,500 or more is defined as a “High Value Article”. 
Items in this category must be specifically described, declared and valued in writing before the date property is
picked up from the origin specified in this certificate.

P) Premium Payment: Where the named insured herein has not paid premium directly to Unirisc,, any party receiving premium 
from the herein named insured is construed as the Insured’s agent for payment of said premium to Unirisc,, and failure 
of Unirisc, Inc.to receive such premium will void any coverage under this certificate.

Q) Surveys: Survey Inspection Fees are payable by this company only with prior consent by Unirisc.

R) Abandonment: There cannot be any abandonment of any insured property to the Underwriters or anyone else.

S) Assignment of Certificate: This certificate shall be void if assigned or transferred without the written 
consent of this Company.

T) Total Loss/FPA: Warranted free of particular average unless caused by stranding, sinking, burning, and/or collision of 
the vessel; but to pay the insured value of any merchandise and/or goods jettisoned and/or washed overboard, irrespective 
of percentage No coverage for partial loss. Including theft and or non delivery of the entire shipment

 `

                                 , 10, 10)

        pdf.setFontSize(14).text(`This insurance is subject to the American Institute Cargo Clauses current on date of
 attachment of risk hereunder. Note SR&CC War Risk Insurance is included. `, 10, 230)

        pdf.setFontSize(10).text(`This insurance does NOT cover:

Damage including but not limited to mold, mildew, rust, and warping. Damages caused by climactic conditions. Spoilage
or change in food or beverage of any kind.Loss or damage cause by normal wear and tear, mechanical or electrical 
derangement, wrinkling of clothing, worn shoes, purses, hand bags accessories and the like, discoloration of leather,
infestation of vermin, moths, insects of any type or inherent vice. Loss or damage attributable to fumigation or
contamination of the shipment from any cause.


`, 10, 250)

        pdf.addPage()

        pdf.setFontSize(10).text(`Jewelry, furs, cash, currency, bank notes, stocks, bonds, stamp and/or coin collections or any
negotiable document. Collections and/or collectibles defined as but not limited to baseball cards, sports memorabilia,
collectible toys, etc. are only insured if specifically declared, separately valued and appraised prior to shipment.
Limited to maximum of 10% of the shipment value. Artwork and Antiques individually valued over $10,000 USD must be 
appraised by a professional appraisal firm or have a commercial invoice prior to shipping and must be approved by Unirisc.

Missing and/or damaged items from within containers which were not packed by the current Household Goods Moving
Company,unless loss/damage is caused by a direct result of fire, sinking, overturn, collision or theft of the
transporting conveyance.

Loss and/or damage of any type to an automobile or motorcycle while being driven under its own power except for 
the purpose of loading and unloading.

Non-factory installed accessories and/or removable items on automobiles, motorcycles and boats unless specifically and 
individually declared and valued for insurance. Tools, batteries, extra tires, antennas, air bags and/or personal property 
shipped in automobiles, motorcycles and boats are not insured.

Scratching, denting, chipping or marring of automobiles, motorcycles and boats over 5 years old. Scratching, denting, 
chipping or marring of automobiles, motorcycles and boats under 5 years old unless the shipper and the owner both agree
 to sign a “Condition Inspection Report” or similar document portraying the condition at origin and again at destination, 
noting all defects, if any. This policy excludes any coverage for recreational vehicles.
Calibration and/or tuning of any item, machine, device or equipment.
Acts of government officials and customs authorities, including confiscation. Consequential losses due to delay are not
covered.

Data contained on hard disks, diskettes, cassettes, video tapes, CD’s, etc. Company’s liability is limited to the cost
 of hardware only, except as may be excluded elsewhere in this certificate.
Depreciation in market or appraised value of any item. Underwriter’s liability hereon is governed by the “Repair and 
Replacement Clause” found in this certificate.

Loss or damage of personal and/or professional papers/documents of any kind, including but not limited to dissertations,
tax returns, medical and employment records; items have that have no market value (such as but not limited to photographs,
family albums and pictures, sentimental items, newspaper clippings, etc.).

Non delivery of a shipping package if the delivery receipt shows that all packages were delivered to the final destination.
Items not listed in the inventory prepared at origin. Items not shipped are not insured.



`, 10, 10)

        pdf.setFontSize(14).text('OPTIONAL COVERAGE TERMS & CONDITIONS', 10, 170)
        pdf.setFontSize(10).text(`Mold & Mildew - To include loss or damage in respect to mold & mildew to the interest insured, 
subject to goods being professionally packed.

Electrical & Mechanical Derangement (Excluding Autos) - To include loss or damage to the interest insured which is caused
by electronic and/or electrical and/or mechanical derangement, provided the interest insured is less than 6 years old.
Subject to the goods being professionally packed.

Pairs & Sets Coverage – In the event of loss or damage recoverable to any item or items forming part of a pair or set, 
the indemnity afforded by this policy shall be limited to the reasonable and fair reduction in value of the pair or set 
by reason of the loss or damage to the affected items. All the articles constituting the pair or set shall, at 
Underwriters option become their property in the event that the Underwriters agree to pay the total loss of the pair or
entire set.

`, 10, 176)

        pdf.setFontSize(12).text(`Name : ${this.insurance.firstName}  ${this.insurance.lastName}
Date : 21/01/21
`, 10, 230)

        pdf.setFontSize(12).text(`Signature : 

`, 100, 230)

        pdf.autoTable({
          margin: { top: 35, left: 10 },
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            ['Our Branch Office 44 Pleasonton, Irvine, CA 92620', 'info@earthrelocation.com'],
            ['Tel : +1 (714) 511 6300 | Fax : +1 (714) 655 7943 | Toll Free : +1 (855) 55 EARTH or (855) 553-2784', 'www.earchrelocation.com'],
          ],
          didDrawPage: (data) => {
            const str = 'Page ' + pdf.internal.getNumberOfPages()
            const pageSize = pdf.internal.pageSize
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            pdf.text(str, data.settings.margin.left, pageHeight - 10)
            console.log(data)
          },
        })

        pdf.save('test.pdf')
      },

    },

  }
</script>
