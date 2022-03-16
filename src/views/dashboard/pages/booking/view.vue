<template>
  <div>
    <v-container
      id="view-booking"
      ref="view-booking"
      class="align-center text-right"
      fluid
      tag="section"
    >
      <v-btn
        color="blue darken-2"
        class="ma-2 white--text"
        :to="{ name: 'Edit Booking', params: { id: $route.params.id }}"
      >
        Edit
        <v-icon
          right
          dark
        >
          mdi-pencil
        </v-icon>
      </v-btn>
      <v-btn
        color="red"
        class="align-right justify-end ma-2 white--text"
        justify="end"
        @click="generatePDF()"
      >
        Download
        <v-icon
          right
          dark
        >
          mdi-file
        </v-icon>
      </v-btn>
      <v-skeleton-loader
        v-if="loader"
        v-bind="attrs"
        type="article, actions"
      />
    </v-container>
    <edit-form
      v-if="!loader"
      :fields="booking"
      :is-disabled="true"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import JsPdf from 'jspdf'
  import 'jspdf-autotable'
  import EditForm from './form'
  export default {
    components: { EditForm },
    data: () => ({
      publicPath: process.env.BASE_URL,
      attrs: {
        elevation: 2,
        class: 'mt-16',
        height: '400px',
      },
      loader: true,
    }),
    computed: mapGetters(['booking']),
    watch: {
      booking () {
        this.loader = false
      },
    },
    created () {
      this.getBookings({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getBookings', 'error']),
      generatePDF () {
        const id = this.$route.params.id
        const { movedetails, customerdetails, billingdetails , shipmentdetails, deliverydetails, comment, tnc } = this.booking
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
                content: `1001 Roosevelt Avenue, 
Unit 4, Carteret NJ 07008 
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

        // pdf.setFontSize(25).text(`BOOKING ${id}`, 70, 52)

        pdf.autoTable({
          margin: { top: 35, left: 10 },
          head: [[{ content: 'MOVE INFORMATION :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`Sales Rep Name : ${movedetails.repname}`, `Desired Move Date : ${movedetails.movedate}`],
          ],
        })

        pdf.autoTable({
          margin: { top: 35, left: 10, right: 10 },
          head: [[{ content: 'CUSTOMER INFORMATION :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`First Name : ${customerdetails.firstname}`, `Last Name : ${customerdetails.lastname}`],
            [`Street Address : ${customerdetails.streetadd}`, `Address Line 2 : ${customerdetails.address2}`],
            [`City : ${customerdetails.city}`, `State / Province / Region : ${customerdetails.state}`],
            [`Zip / Postal Code : ${customerdetails.zip}`, `Country : ${customerdetails.country}`],
            [`Phone 1 : ${customerdetails.phone}`, `${customerdetails.phone2 ? 'Phone 2 : ' +customerdetails.phone2 : '' }`, `${customerdetails.phone3 ? 'Phone 3 : ' +customerdetails.phone3 : '' }`],
            [`Primary Email ID : ${customerdetails.email}`, `${customerdetails.email2 ? 'Secondary Email : '+customerdetails.email2 : ''}`],
            [`Official ID : ${customerdetails.officialid}`, `${customerdetails.officialid === 'EIN Tax ID' ? 'EIN Tax ID :' + customerdetails.taxid : 'Passport Number : ' + customerdetails.passport}`],
          ],
        })

        pdf.autoTable({
          margin: { top: 35, left: 10, right: 10 },
          head: [[{ content: 'PICK UP INFORMATION :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`Street Address : ${billingdetails[0].fields.streetadd}`, `Address Line 2 : ${billingdetails[0].fields.address2}`],
            [`City : ${billingdetails[0].fields.city}`, `State / Province / Region : ${billingdetails[0].fields.state}`],
            [`Zip / Postal Code : ${billingdetails[0].fields.zip}`, `Country : ${billingdetails[0].fields.country}`],
            [{ content: `Need additional Pickup? : ${billingdetails[0].additional}`, colSpan: 2 }],
            [{ content: `Is your Billing Information Same as customer information? : ${billingdetails[0].sameinfo}`, colSpan: 2, styles: { cellWidth: 'wrap' } }],
          ],
        })
        if (shipmentdetails.moveItems === 'Vehicle or Motor Cycle Only') {
          pdf.autoTable({
            margin: { top: 5, left: 10, right: 10 },
            head: [[{ content: 'Shipment Details :', colSpan: 2 }]],
            bodyStyles: {
              cellWidth: 95,
            },
            body: [
              [`What do you want to move : ${shipmentdetails.moveItems}`,`Vehicle type : ${shipmentdetails.vehicles[0].type}`],
              [`Year : ${shipmentdetails.vehicles[0].inputs.year}`,`Manufacturer : ${shipmentdetails.vehicles[0].inputs.manufacturer}`],
              [`Make : ${shipmentdetails.vehicles[0].inputs.make}`,`Model : ${shipmentdetails.vehicles[0].inputs.model}`],
              [`Color : ${shipmentdetails.vehicles[0].inputs.color}`,`Vin # : ${shipmentdetails.vehicles[0].inputs.vin}`],
              [`${shipmentdetails.vehicles[0].inputs.wheels ? 'Wheels : ' + shipmentdetails.vehicles[0].inputs.wheels : ''}`],
              [`Vehicle Condition : ${shipmentdetails.vehicles[0].condition}`,`Vehicle in running Condition : ${shipmentdetails.vehicles[0].isRunningCondition}`],
              [`Is vehicle financed? : ${shipmentdetails.vehicles[0].isFinanced}`,`Are you shipping additional vehicles? : ${shipmentdetails.vehicles[0].isNext}`],

            ],
          })
        }else if (shipmentdetails.moveItems === 'Boat/Yacht') {
          pdf.autoTable({
            margin: { top: 5, left: 10, right: 10 },
            head: [[{ content: 'Shipment Details :', colSpan: 2 }]],
            bodyStyles: {
              cellWidth: 95,
            },
            body: [
              [`What do you want to move : ${shipmentdetails.moveItems}`],
              [`Year : ${shipmentdetails.boat.year}`,`Make : ${shipmentdetails.boat.make}`],
              [`Model : ${shipmentdetails.boat.model}`,`Trailer VIN # : ${shipmentdetails.boat.trailerVin}`],
              [`Boat HULL # : ${shipmentdetails.boat.boatVin}`,`Length(ft) : ${shipmentdetails.boat.length}`],
              [`Width(ft) : ${shipmentdetails.boat.width}`,`Height(ft) : ${shipmentdetails.boat.height}`],
              [`Weight : ${shipmentdetails.boat.weight}`,`How is Boat presented : ${shipmentdetails.boat.boatPresented}`],
            ],
          })
        }else{
          pdf.autoTable({
            margin: { top: 5, left: 10, right: 10 },
            head: [[{ content: 'Shipment Details :', colSpan: 2 }]],
            bodyStyles: {
              cellWidth: 95,
            },
            body: [
              [`Move Items : ${shipmentdetails.moveItems}`],
            ],
          })
        }
        if (deliverydetails.isDelivery === 'yes') {
          pdf.autoTable({
          margin: { top: 5, left: 10, right: 10 },
          head: [[{ content: 'Delivery Details :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`Do you have a delivery address available : ${deliverydetails.isDelivery}`,`Type of delivery : ${deliverydetails.deliveryAddress.type}`],
            [`First Name : ${deliverydetails.deliveryAddress.firstName}`, `Last Name : ${deliverydetails.deliveryAddress.lastName}`],
            [`Street Address : ${deliverydetails.deliveryAddress.address}`, `Address line 2 : ${deliverydetails.deliveryAddress.address2}`],
            [`City : ${deliverydetails.deliveryAddress.city}`, `State / Province / Region : ${deliverydetails.deliveryAddress.state}`],
            [`ZIP / Postal Code : ${deliverydetails.deliveryAddress.zip}`, `Country : ${deliverydetails.deliveryAddress.country}`],
            [`Phone (Mobile) : ${deliverydetails.deliveryAddress.phone}`, `${deliverydetails.deliveryAddress.phoneWork ? 'Phone (Work) :' + deliverydetails.deliveryAddress.phoneWork : 'Phone (Work) :'}`],
            [`${deliverydetails.deliveryAddress.phoneHome ? 'Phone (Home) : '+ deliverydetails.deliveryAddress.phoneHome : 'Phone (Home) :'}`, `Email : ${deliverydetails.deliveryAddress.email}`],
            // [`${deliverydetails.deliveryAddress.secondaryEmail ? 'Secondary Email : ' + deliverydetails.deliveryAddress.secondaryEmail : 'Secondary Email : '}`]
          ],
        })
        }else{
          pdf.autoTable({
          margin: { top: 5, left: 10, right: 10 },
          head: [[{ content: 'Delivery Details :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`Do you have a delivery address available : ${deliverydetails.isDelivery}`],
          ],
        })
        }
        

        pdf.autoTable({
          margin: { top: 5, left: 10, right: 10 },
          head: [[{ content: 'Comments :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`Comments/Special Instructions (If any) : ${comment.comment}`],
            [`How did you hear about us? : ${comment.findUs}`,`Are you a military Personnel? : ${comment.military}`],
          ],
        })

        pdf.autoTable({
          margin: { top: 5, left: 10, right: 10 },
          head: [[{ content: 'T&C :', colSpan: 1 }]],
          bodyStyles: {
            cellWidth: 190,
          },
          
          body: [
            [`FORWARDER’S AUTHORIZATION`],
            [`(U.S. Principal Party in Interest/Forwarding Agent)`],
            [`Hereby authorize the Following Agent to act as forwarding agent for export control and customs purposes to sign any SED (Shipper’s Export Declaration) and transmit such information via AES (Automated Export System) which may be required by law or regulation with regards to the exportation and transportation of any merchandise on behalf of the said U.S. Principal Party in interest. The U.S. Principal party in interest hereby certifies that the necessary and proper documentation to accurately complete the SED and transmit the information via AES is and will be provided to the said forwarding agent. The U.S. Principal party in interest further understand that civil and criminal penalties may be imposed for making false or fraudulent statements or for the violations of any United States laws or regulations on exportation and agrees to be bound by all statements of said agent based upon the information or documentation provided by the exporter to said, agent. This written authorization is to remain in full force an effect until revocation in writing is duly given by the U.S Principal Party in interest and received by the Forwarding Agent.`],
            [`SHIPPING AGREEMENT TERMS BETWEEN SHIPPER AND COMPANY "EARTH RELOCATION"`],
            [`Shipper must provide company shipping instructions in writing. Company shall not assume any responsibility for any delays or omissions to shipment in the event instructions were not given in writing.`],
            [`EARTH RELOCATION "company" agrees to transport shipper’s packed goods to the ocean and air terminal for shipment to the port of final destination and acts only as a shipper’s agent with respect to the transportation of said goods and does not act as a common carrier. The shipper authorizes the company to employ the services of any steamship line and or any certified common carrier(s) when in the company’s opinion such service are necessary to transport the property to destination herein designated. Our international full-service shipping proposals include the service of clearing customs by a customs broker unless otherwise indicated. The service does not include the destination local government agencies fees if any, nor duties or taxes if applicable. It is the responsibility of the shipper to ensure that the consignee’s name correlates with all documentation necessary for customs clearance (ex-passport, visa etc.). Customs regulations are subject to change at any time.`],
            [`Any information EARTH RELOCATION may have provided is a brief summary of customs regulations applicable to household goods shipments to your destination and is occasionally being provided for general guidance to assist our agents and customers. Se such regulations are subject to change without notice, EARTH RELOCATION cannot be held liable for any costs, damage, delays, or other detrimental events resulting from non-compliance. It is the consignee’s responsibility to check with the local embassy or consulate for any regulatory requirements and obtain/ provide all documentation needed to facilitate their customs clearance.`],
            [`Furniture packing and crating costs and that of box packaging (if necessary) is subject to actual utilization of both material and labor on moving day. Final invoice shall reflect total charges per actual materials usage including all amounts necessary for securing your load into the appropriate container. Shipper must provide company with a complete list of the items to be shipped, and make sure all suppliers that same was delivered to the company prior to shipping date and or loading date. Company will not assume responsibility for any item not shipped if such list was not provided, or any items were not included after agreed shipping date. Estimate provided by company as a guideline and is based on information provided by the shipper.`],
            [`PBO (Packed by Owner Goods) CLAUSE: Shippers packing their own boxes or furniture have to follow the international shipping and safety guidelines. They should give a declaration on a form confirming that they are not shipping any banned items as follows and not limited to weapons, drugs, narcotics, explosives, artillery and ammunition, assault weapons of any kind, radioactive material, inflammable products or any articles of dangerous nature (basically anything apart from “normal” household goods and personal effects.`],
            [`The shipper will be solely responsible for any prosecution that will take place from government agencies, customs depts. At origin/destination etc if he or she ships such items. Also, this will conclude our contract with the shipper and ER will not be liable for any such activity. If shipper still insists to ship such goods, he/she will be responsible to provide a detailed packing list with all goods packed in each box in his/her own format. PBO items are also subject to delays at customs and can get 100% searched/inspected by customs authorities. ER will not be liable for any costs arising from such delays. PBO items are also subject to be declined from insurance coverage.A move deposit is required for all moves as indicated by your relocation consultant and appropriate cancellation policy will apply as indicated below:`],
            [`If balance payment is made by credit card, a 4.5% credit card processing fee shall apply. Estimated total charges during the quotation process are simply a cost estimate based on a variety of factors not the least of which are: submitted inventory list in verbal or written form, national cubic footage averages for common household items, visual surveys, etc.

Final charges may vary if one of these factors differs from the quotation interview prior to booking. Final cost will be determined when actual packing is completed, and dimensions obtained according to rate agreed. Shipper shall pay the freight and any and all other lawful charges accruing on said property prior to any movement of goods by the company and or affiliates and or agents.`],
            [`Company shall have a lien on the goods for all freight and charges and any sums that may be due it under this agreement and or any other charges that may result under this process. This quotation is valid for 60 days only from the date of signing and acceptance of the agreement by both shipper and company. Rate is based on consolidation of goods and therefore company cannot be held responsible for exact shipping dates. When receiving items on behalf of the shipper, the company has no duty to open or verify the content of the cartons received, and only responsible for verifying the quantity of cartons received.`],
            [`Estimated Time of Pickup is based on your desired date in conjunction with the appropriate time of day as determined by the carrier’s normal schedule. While every effort is made to provide you with a timely pickup, EARTH RELOCATION shall not be held liable for delay caused by highway obstruction, faulty or impassable highway, lack of capacity of any highway, bridge, or ferry, or caused by breakdown of mechanical defects of vehicles, equipment, or from any cause other than negligence of the carrier; nor shall the carrier be bound to transport by any particular schedule, means, vehicle or otherwise than with reasonable dispatch. The carrier reserves the right in regard to the routing, method of transportation, selection of carrier and delivery agent. The assigned carrier shall have the right in the case of physical necessity to forward said property by any carrier or route between the point of shipment and the point of destination.`],
            [`It is highly recommended that Marine Insurance coverage be purchased for your international shipment. While every effort is taken to provide the most secure method of transporting your goods, accidental damage/loss does occur on a seldom/random basis. If insurance is purchased, you must itemize the articles of concern and provide this list to our office. The insurance endowment will be filed based on your declaration of the shipment’s value and the premium amount will be assessed on your final invoice. All terms and conditions of coverage are subject to the Insurance policy.`],
            [`All claims, if any, should be submitted by the Consignee directly to the Insurance Company of record. EARTH RELOCATION is the carrier for your shipment, not the insurance underwriter and will not be responsible for any claim you may have. If you choose not to purchase insurance, you are waiving your right for reimbursement in case of any nature of damage or loss. If you choose not to insure you hereby declare that EARTH RELOCATION has offered marine insurance coverage for your shipment. In addition, if coverage is declined by the shipper/consignee, neither you nor any person or entity acting on your behalf shall assign, grant, authorize or allow any subrogation of your rights against EARTH RELOCATION in connection with your shipment.`],
            [`EARTH RELOCATION shall be indemnified and held harmless for any loss incurred if this agreement is breached as a result of any claim or action of subrogation or otherwise asserted by any third party in connection with your shipment. Company shall not be liable for any losses or damages to shipper’s goods caused by acts of god, public enemies, and authority of law, labor troubles, riots and weather conditions, acts of defaults by shipper of other causes beyond company’s control. Company will not be responsible for loss or damages to goods by fire or moth, rust, or deterioration by time while in its care possession, or while being transported or transferred to railroad, car or steamship or any other condition.`],
            [`Company does not recommend shipments of the following items; valuable documents, stamp collection, coin collection, valuable jewelry, pressure spray cans, inflammable items, liquid bleach, open liquid bottles, excessive food staples, fire arms, live plants or seed, broadcast equipment including but not limited to new building materials, acids etc. and is not responsible for any such missing items or subsequent damages which may be caused to other items in the shipments by contamination from same. Additional charges will apply but are not limited to inaccessible or difficult entry; stairs and long carry situations and other unforeseen hindrances determined on moving day and/or during the delivery at destination (if applicable). Our local moving agent and/or shipping line have the right to determine whether crating or palletizing is necessary for the safety of your belongings at their own discretion.`],
            [`CANCELLATION POLICY : `],
            [`DURATION                                                                                   REFUND`],
            [`Upon 9% deduction`],
            [`Six or more business days prior to Moving Date                         100% of Deposit `],
            [`Within five business days of Moving Date                                     50% of Deposit`],
            [`Within one business days of Moving Date                                       0% of Deposit`],
            [`If balance payment is made by credit card, a 4.5% credit card processing fee shall apply. Estimated total charges during the quotation process are simply a cost estimate based on a variety of factors not the least of which are: submitted inventory list in verbal or written form, national cubic footage averages for common household items, visual surveys, etc.`],
            [`Final charges may vary if one of these factors differs from the quotation interview prior to booking. Final cost will be determined when actual packing is completed, and dimensions obtained according to rate agreed. Shipper shall pay the freight and any and all other lawful charges accruing on said property prior to any movement of goods by the company and or affiliates and or agents. `],
            [`Company shall have a lien on the goods for all freight and charges and any sums that may be due it under this agreement and or any other charges that may result under this process. This quotation is valid for 60 days only from the date of signing and acceptance of the agreement by both shipper and company. Rate is based on consolidation of goods and therefore company cannot be held responsible for exact shipping dates. When receiving items on behalf of the shipper, the company has no duty to open or verify the content of the cartons received, and only responsible for verifying the quantity of cartons received.`],
            [`Estimated Time of Pickup is based on your desired date in conjunction with the appropriate time of day as determined by the carrier’s normal schedule. While every effort is made to provide you with a timely pickup, EARTH RELOCATION shall not be held liable for delay caused by highway obstruction, faulty or impassable highway, lack of capacity of any highway, bridge, or ferry, or caused by breakdown of mechanical defects of vehicles, equipment, or from any cause other than negligence of the carrier; nor shall the carrier be bound to transport by any particular schedule, means, vehicle or otherwise than with reasonable dispatch. The carrier reserves the right in regard to the routing, method of transportation, selection of carrier and delivery agent. The assigned carrier shall have the right in the case of physical necessity to forward said property by any carrier or route between the point of shipment and the point of destination.`],
            [`Shipping time is approximate, and the company is not responsible for any delays caused beyond its control, such as highway problems, port congestion, steamship line schedule, overbooking, technical difficulties in equipment, trucking strikes, port authorities, labor problems etc., at origin and or destination. Shipper must notify the company of requested pickup date minimum of four weeks in advance. Shipper allows a minimum of four weeks for the packing and preparation services from date of pick up. Estimated Time of Arrival is determined 1by the shipping line and is listed on their Booking Confirmation. All shipping lines reserve the right to schedule changes while in transit should they deem this necessary. While not guaranteed, most shipments arrive at port within 30-60 days of sailing date to arrival port. This time estimate is based on a compilation of past experience of shipping time frames for specific regions. In addition, this shipping time estimate begins from the first date of complete payment of final invoice or receipt of the required customs/contact documents if applicable. EARTH RELOCATION cannot be held liable for any unforeseen actions that would delay a shipment’s arrival date such as, but not limited to natural disasters, port/terminal issues, government involvement, port authority/customs intervention, labor strikes, increased examinations due to heightened security alerts, etc.`],
            [`It is highly recommended that Marine Insurance coverage be purchased for your international shipment. While every effort is taken to provide the most secure method of transporting your goods, accidental damage/loss does occur on a seldom/random basis. If insurance is purchased, you must itemize the articles of concern and provide this list to our office. The insurance endowment will be filed based on your declaration of the shipment’s value and the premium amount will be assessed on your final invoice. All terms and conditions of coverage are subject to the Insurance policy.`],
            [`All claims, if any, should be submitted by the Consignee directly to the Insurance Company of record. EARTH RELOCATION is the carrier for your shipment, not the insurance underwriter and will not be responsible for any claim you may have. If you choose not to purchase insurance, you are waiving your right for reimbursement in case of any nature of damage or loss. If you choose not to insure you hereby declare that EARTH RELOCATION has offered marine insurance coverage for your shipment. In addition, if coverage is declined by the shipper/consignee, neither you nor any person or entity acting on your behalf shall assign, grant, authorize or allow any subrogation of your rights against EARTH RELOCATION in connection with your shipment.`],
            [`EARTH RELOCATION shall be indemnified and held harmless for any loss incurred if this agreement is breached as a result of any claim or action of subrogation or otherwise asserted by any third party in connection with your shipment. Company shall not be liable for any losses or damages to shipper’s goods caused by acts of god, public enemies, and authority of law, labor troubles, riots and weather conditions, acts of defaults by shipper of other causes beyond company’s control. Company will not be responsible for loss or damages to goods by fire or moth, rust, or deterioration by time while in its care possession, or while being transported or transferred to railroad, car or steamship or any other condition.`],
            [`Company does not recommend shipments of the following items; valuable documents, stamp collection, coin collection, valuable jewelry, pressure spray cans, inflammable items, liquid bleach, open liquid bottles, excessive food staples, fire arms, live plants or seed, broadcast equipment including but not limited to new building materials, acids etc. and is not responsible for any such missing items or subsequent damages which may be caused to other items in the shipments by contamination from same. Additional charges will apply but are not limited to inaccessible or difficult entry; stairs and long carry situations and other unforeseen hindrances determined on moving day and/or during the delivery at destination (if applicable). Our local moving agent and/or shipping line have the right to determine whether crating or palletizing is necessary for the safety of your belongings at their own discretion.`],
            [`For vehicle/boat shipments, you must provide our office (or the carrier in some cases) the original title, a signed/notarized power of attorney authorizing EARTH RELOCATION to ship your vehicle/boat. In addition, you will be provided a dock receipt by email that must be given to the carrier to be stamped at the port of entry. Any delays in the processing of your shipment as a direct result of complete documentation shall be the responsibility of the shipper.

All cancellations must be confirmed via email or fax within fourteen business days of a scheduled pick-up date in order to be eligible for a deposit refund. Refunds are processed within thirty days after cancellation is confirmed. If partial services have been rendered, a cancellation invoice will be generated that includes the cost of these partial services. If your move date is within the fourteen-day period, your refund is non-refundable due to the expedited booking process. Any amount remaining after your payment(s) has been applied shall be refunded to you.`],
            [`All cancellations must be confirmed via email or fax within fourteen business days of a scheduled pick-up date in order to be eligible for a deposit refund. Refunds are processed within thirty days after cancellation is confirmed. If partial services have been rendered, a cancellation invoice will be generated that includes the cost of these partial services. If your move date is within the fourteen-day period, your refund is non-refundable due to the expedited booking process. Any amount remaining after your payment(s) has been applied shall be refunded to you.

Unless otherwise noted, your shipment will be either palletized or crated so as to prevent harm during the shipping process. Final dimensions include all gross space occupied by the palletizing and crating process. All shipments are subject to documentation fees if overnight couriers are used and insurance processing fees should insurance be purchased. While every attempt is made to consider all charges for the delivery of your goods, certain destination charges are always excluded from our estimates/invoices, unless otherwise noted in your contract.`],
            [`These charges include, but are not limited to port, terminal and container service charges at destination, parking space reservation if needed, temporary or non-household goods customs clearance, nspections and/or scanning charges, quarantine charges, excessive delays at customs points, unexpected increase in road taxes/fees, handling of different weight or volume, unexpected bunker charges, war risk surcharges, import duties and taxes if applicable at destination, storage/demurrage, difficult access delivery, long carry, shuttle service, hoisting, inhouse delivery above 1stfloor, etc. Company cannot be held responsible for any advice of information given regarding customs regulations, port fees, etc. at any port. This AGREEMENT IS SOLELY BETWEEN THE SHIPPER AND EARTH RELOCATION. Customs regulations, residency requirements, port fees, and tax laws differ in each country and are subject to periodic change.`],
            [`Therefore, EARTH RELOCATION only offers guidance, not legal advice, and is not liable for any inaccuracies pertaining to offering such guidance. Shipper must contact the consulate or embassy representing the country of destination in order to determine the applicable rules, regulations and law pertains to its shipment. All final invoices must be paid in full within 72 hours of invoice date to insure timely processing of your shipment and to avoid storage/administrative charges. While every effort is made to make your relocation a pleasant and efficient experience, disagreements sometimes occur. Depending on the stage within the shipping process, we request that you submit your information in writing to the contact email designated in your customer packet. Your submission will then be reviewed by upper management for accuracy, clarification, determination and resolution. Said resolution will be presented to you in writing shortly thereafter. EARTH RELOCATION is committed to exemplary customer service and will do everything within reasonable limits to affect a satisfactory resolution. ??During this phase, you are required to maintain all communications between EARTH RELOCATION personnel and yourself in the utmost confidence and will not forward, display publicly, post online or otherwise reveal the nature of any internal communications as it is considered privileged information and may hinder the negotiation process. Any final settlement reached is further bound by this confidentiality agreement and the shipper/consignee consents to the jurisdiction and venue of any court of general jurisdiction of New York County, in the borough of New York, in the state of New York and any legal proceedings arising out of this Agreement shall be brought only in such courts.`],
            [`Pick-up dates are subject, but not limited to changes by the shipping line and/or intermodal company responsible for shipping your household goods. Every effort will be made to retain your scheduled date, yet unforeseen circumstances may prevent a timely pick-up. In this case, dispatch will work diligently to find a solution so as to prevent as much convenience as possible.

To secure your move, we require a nominal deposit as listed in your offer. Acceptable forms of payment are, wire transfer, company, personal and cashier’s check and money order. Balance is due on the day of pick up in the form of a personal or business check, money order, cashier’s check or wire transfer and made payable to EARTH RELOCATION A finance charge of 2% per month or part thereof (24% annually will be added to each balance paid later than 14 days from the invoice date.`],
            [`The cost of collection, including attorney fees will be added to every balance for which collection procedures are initiated. All payments or adjusted balance, if any, must clear the bank posting system in order to release your shipment and continue service. A non-sufficient check issued to EARTH RELOCATION will incur a minimum service fee of 150.00. It is considered fraudulent to pay for services with a check that is returned for insufficient funds.

he cost of collection, including attorney fees will be added to every balance for which collection procedures are initiated. All payments or adjusted balance, if any, must clear the bank posting system in order to release your shipment and continue service. A non-sufficient check issued to EARTH RELOCATION will incur a minimum service fee of 150.00. It is considered fraudulent to pay for services with a check that is returned for insufficient funds.`],
            [`Any increase or surcharges, as assesses will be added to the price. This agreement is null and void in the event any laws or regulations are imposed by authorities at origin or destination which affect the terms of this agreement. The company and the shipper must renegotiate the terms of any new agreement. EARTH RELOCATION is acting as a shipper’s agent, is contracted to perform moving services and shipping only. Company’s charges cover shipping and related services only. Taxes and other port or government assessments are the responsibility of the shipper.`],
            [`LIMITED LIABILITY : `],
            [`By signing this contract, the shipper/consignee fully acknowledges that any and all contract-based and/or tort based claims under this contract are fully assigned to the designated carrier. ??This contract unambiguously states that any and all disputes arising from this contract are between the consignee and the assigned carrier. EARTH RELOCATION or our agents shall under no circumstances be liable for any loss, damage, expense or delay to the goods for any reason whatsoever when such goods are in the custody, possession or control of third party selected by the carrier to forward, enter and clear, transport or render other services with respect to such goods.By signing this contract, the consignee fully acknowledges that EARTH RELOCATION cannot be held vicariously liable for the errors and omissions of others.`],
            [`PROHIBITED ITEMS : `],
            [`Many common items used in the home or workplace every day may seem harmless; however, when transported by air or by sea as part of household goods shipment; they become very dangerous. Variations in temperature and pressure can cause items to leak, generate toxic fumes or start a fire while being transported. Below you will see a list of items that CAN NOT BE TRANSPORTED through any vessel (air or sea) as part of a shipment containing household goods and Personal effects.`],
            [`Flammable liquids or solids such as but not limited to fuel, paint, paint thinners/cleaners, adhesives, polishes, lighter fluid, matches, strike anywhere matches, lighters with flammable liquid, perfumes, colognes, aftershave lotions, propane tanks, etc.

Pressure Containers such as but not limited to spray cans: aerosols (hair spray, deodorant, shaving cream or repellents) butane fuel, scuba tanks- to include high-intensity diving lamps, propane tanks; CO2 cartridges, self-inflating rafts, etc.`],
            [`Weapons such as, but not limited to; signal flares sparklers or other explosives.

Other materials such as but not limited to; dry ice gasoline-powered tools, wet-cell batteries, camping equipment with fuel, radioactive materials, poisons, infectious substances, etc.

Household cleaning items, such as but not limited to, drain cleaners, oven cleaners, solvents, bleach or others with toxic or corrosive substances, etc.

Please take the time to familiarize yourself with the above-mentioned list, and feel free to contact your Move Coordinator should you have any questions. In our endeavor to provide you with quality service, we thank you for your consideration in assisting us with important matter.`],
            [`I certify that this shipment does not contain any unauthorized explosives, destructive devices or hazardous materials. I consent to a search of this shipment. I am aware that this endorsement and An ORIGINAL signature, along with other shipping documents will be retained on the file.`],
            [`DECLARATION : `],
            [`I certify that this shipment does not contain any unauthorized explosives, destructive devices or hazardous materials. I consent to a search of this shipment. I am aware that this endorsement and An ORIGINAL signature, along with other shipping documents will be retained on the file.`],
            [`${tnc.agree === true ? 'Agree? : YES' : 'Agree? : NO' }`],
            [`Name : ${tnc.name}`],
            [`Date : ${tnc.date}`],
            // [`Signature : `],
          ],
          // didDrawPage: (data) => {
          //   // if (deliverydetails.isDelivery === 'yes') {
          //     // const img = new Image()
          //     // img.src = `${tnc.signature.url}`
          //     // pdf.addImage(img, 'JPEG', 100, 105, 80, 30)
          //   // }else{
          //     if (data.pageCount === 6){
          //       console.log(data)
          //       const img = new Image()
          //       img.src = `${tnc.signature.url}`
          //       pdf.addImage(img, 'JPEG', 80, 85, 80, 30)
          //     }
          //   // }
          // },
          
        })
        pdf.autoTable({
          margin: { top: 10, left: 10, right: 10 },
          head: [[{ content: 'Signature :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          // body: [
          //   [`Signature :`],
          // ],
          didDrawCell: (data) => {
              // if (data.pageCount === 6){
                console.log(data)
                console.log('data')
                const img = new Image()
                img.src = `${tnc.signature.url}`
                pdf.addImage(img, 'JPEG', 60, data.cursor.y + 10, 50, 25)
              // }
            // }
          },
        })
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

        pdf.save(`booking-${id}.pdf`)
      },
    },
  }
</script>
