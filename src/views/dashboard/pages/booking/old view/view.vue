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
            [`Phone 1 : ${customerdetails.phone}`, `Phone 2 : ${customerdetails.phone2}`, `Phone 3 : ${customerdetails.phone3}`],
            [`Primary Email ID : ${customerdetails.email}`, `Secondary Email ID : ${customerdetails.email2}`],
            [`Official ID : ${customerdetails.officialid}`, `${customerdetails.officialid === 'EIN Tax ID' ? 'EIN Tax ID :' + customerdetails.taxid : 'Passport Number' + customerdetails.passport}`],
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
            margin: { top: 35, left: 10, right: 10 },
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
            margin: { top: 35, left: 10, right: 10 },
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
            margin: { top: 35, left: 10, right: 10 },
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
          margin: { top: 35, left: 10, right: 10 },
          head: [[{ content: 'Delivery Details :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`Type of delivery : ${deliverydetails.deliveryAddress.type}`,`Do you have a delivery address available : ${deliverydetails.isDelivery}`],
            [`First Name : ${deliverydetails.deliveryAddress.firstName}`, `Last Name : ${deliverydetails.deliveryAddress.lastName}`],
            [`Street Address : ${deliverydetails.deliveryAddress.address}`, `Address line 2 : ${deliverydetails.deliveryAddress.address2}`],
            [`City : ${deliverydetails.deliveryAddress.city}`, `State / Province / Region : ${deliverydetails.deliveryAddress.state}`],
            [`ZIP / Postal Code : ${deliverydetails.deliveryAddress.zip}`, `Country : ${deliverydetails.deliveryAddress.country}`],
            [`Phone (Mobile) : ${deliverydetails.deliveryAddress.phone}`, `Phone (Work) : ${deliverydetails.deliveryAddress.phoneWork}`],
            [`Phone (Home) : ${deliverydetails.deliveryAddress.phoneHome}`, `Email : ${deliverydetails.deliveryAddress.email}`],
            [`Secondary Email : ${deliverydetails.deliveryAddress.secondaryEmail}`]
          ],
        })
        }else{
          pdf.autoTable({
          margin: { top: 35, left: 10, right: 10 },
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
          margin: { top: 35, left: 10, right: 10 },
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
          margin: { top: 35, left: 10, right: 10 },
          head: [[{ content: 'T&C :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          didDrawPage: (data) => {
            if (deliverydetails.isDelivery === 'yes') {
              const img = new Image()
              img.src = `${tnc.signature.url}`
              pdf.addImage(img, 'JPEG', 100, 105, 80, 30)
            }else{
              // if (data.pageCount === 2){
                const img = new Image()
                img.src = `${tnc.signature.url}`
                pdf.addImage(img, 'JPEG', 80, 85, 80, 30)
              // }
            }
          },
          body: [
            [`Agree? : ${tnc.agree}` , `Signature : `],
            [`Name : ${tnc.name}`],
            [`Date : ${tnc.date}`],
          ],
          
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
