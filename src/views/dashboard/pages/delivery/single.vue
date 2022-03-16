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
        :to="{ name: 'Edit Delivery', params: { id: $route.params.id }}"
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
        @click="generatePDF"
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
      :fields="delivery"
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
    computed: mapGetters(['delivery']),
    watch: {
      delivery () {
        this.loader = false
      },
    },
    created () {
      this.getDelivery({ id: this.$route.params.id })
    },
    methods: {
      ...mapActions(['getDelivery', 'error']),
      generatePDF () {
        const id = this.$route.params.id
        const { customer, residence, access } = this.delivery
        const floorImg = `${this.publicPath}floor-species.JPG`
        var pdf = new JsPdf({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
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

        // pdf.setFontSize(25).text(`Delivery & Access #${id}`, 70, 52)

        pdf.autoTable({
          margin: { top: 35, left: 10 },
          head: [[{ content: 'CUSTOMER DETAILS :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: [
            [`First Name : ${customer.firstname}`, `Last Name : ${customer.firstname}`],
            [`Delivery Address : ${customer.address}`, `DATE AVAILABILITY : ${customer.date}`],
            [`BEST DAYTIME PHONE : ${customer.phone}`, `OTHER CONTACT DETAILS : ${customer.phone2}`],
          ],
        })

        pdf.autoTable({
          margin: { top: 35, left: 10 },
          head: [[{ content: 'TYPE OF RESIDENCE :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
            valign: 'middle',
          },
          body: [
            [
              `Residence Type : ${residence.residencetype.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}`,
              { content: '', rowSpan: 3, styles: { minCellHeight: 100, minCellWidth: 95, cellPadding: 0 } },
            ],
            [`Specify which American Floor : ${residence.floor}`],
            [`Specify walking distance : ${residence.walkingdistance}`],
          ],
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) {
              const img = new Image()
              img.src = floorImg
              pdf.addImage(img, 'JPEG', data.cell.x, data.cell.y, 95, 100)
            }
          },
        })

        const accessBody = [
          ['Street AddressDoes your building have elevator?', `${access.elevator === 'yes' ? 'Yes' : 'No'}`],
          ['Can the elevator accommodate bulky items?', `${access.bulky === 'yes' ? 'Yes' : 'No'}`],
          ['Do any bulky items require outside elevator?', `${access.outside === 'yes' ? 'Yes' : 'No'}`],
          ['Do any items require delivery via stairs?', `${access.stairs === 'yes' ? 'Yes' : 'No'}`],
          access.stairs === 'yes' ? ['Please Specify', access.stairsdesc] : '',
          ['Does your HOA have restrictions on day & time of delivery?', `${access.hoa === 'yes' ? 'Yes' : 'No'}`],
          access.hoa === 'yes' ? ['Please Specify', access.hoadesc] : '',
          ['Other Details', `${access.otherdetails || ''}`],
        ]
        pdf.autoTable({
          margin: { top: 35, left: 10 },
          head: [[{ content: 'ACCESS DETAILS :', colSpan: 2 }]],
          bodyStyles: {
            cellWidth: 95,
          },
          body: accessBody.filter(i => i),
        })
        pdf.text('Other Details', 10, 0)
        pdf.text(access.otherdetails, 10, 0)

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

        pdf.save(`delivery&access-${id}.pdf`)
      },
    },
  }
</script>
