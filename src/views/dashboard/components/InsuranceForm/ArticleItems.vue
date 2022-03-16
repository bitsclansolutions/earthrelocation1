<template>
  <div>
    <div>
      <p><b>Note:</b></p>
      <p>
        All claims for high-value items will require proof of valuation in terms of purchase receipt(s) or published valuation in the public domain. If no such proof is available, a professional appraisal by a licensed appraiser is mandatory prior to pickup.
      </p>
    </div>
    <div v-if="format !== 'pdf'">
      <v-row>
        <v-col cols="9">
          <v-card-title>
            Articles
            <v-btn
              v-if="!disable && !inputs.length"
              fab
              dark
              small
              color="primary"
              class="ml-4"
              @click="add"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-card-title>
        </v-col>
      </v-row>
      <div v-if="!disable">
        <v-row
          v-for="(item,i,ind) in inputs"
          :key="ind"
        >
          <v-col cols="4">
            <v-combobox
              ref="cats"
              v-model="item.cat"
              :items="Object.keys(articles)"
              :search-input.sync="item.catSearch"
              label="Article Category"
              persistent-hint
              dense
              small-chips
              @change="updateAmount();item.name = ''"
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      No results matching "<strong>{{ item.catSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
            <!-- <v-select
          ref="cats"
          v-model="item.cat"
          :items="Object.keys(articles)"
          :rules="[rules.required]"
          label="Article Category"
          dense
          outlined
          @change="updateAmount"
        /> -->
          </v-col>
          <v-col cols="3">
            <!-- <v-autocomplete
          v-model="item.name"
          dense
          :allow-overflow="false"
          :items="articles[item.cat]"
          label="Article"
          small-chips
          @change="updateAmount"
        /> -->
            <v-combobox
              ref="artclname"
              v-model="item.name"
              :items="articles[item.cat] || []"
              :search-input.sync="item.artlSearch"
              label="Article"
              persistent-hint
              dense
              small-chips
              @change="updateAmount"
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      No results in that Category. "<strong>{{ item.artlSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="2">
            <v-text-field
              ref="number"
              v-model="item.number"
              :items="numbers"
              :rules="[rules.required]"
              label="Number"
              type="Number"
              dense
              @input="updateAmount"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              ref="repvalue"
              v-model="item.value"
              :rules="[rules.required]"
              label="Replacement Value"
              dense
              @input="updateAmount"
            >
              <template #append-outer>
                <v-btn-toggle
                  v-if="!disable"
                >
                  <v-btn
                    color="red"
                    small
                    @click="remove(i);updateAmount()"
                  >
                    <v-icon dark>
                      mdi-minus
                    </v-icon>
                  </v-btn>

                  <v-btn
                    color="primary"
                    small
                    @click="add"
                  >
                    <v-icon dark>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-btn-toggle>
                <!-- <v-btn
                  fab
                  dark
                  x-small
                  color="red"
                  @click="remove(i);updateAmount()"
                >
                  <v-icon dark>
                    mdi-minus
                  </v-icon>
                </v-btn> -->
              </template>
            </v-text-field>
          </v-col>
          <v-col
            v-if="item.value >= 2500"
            cols="10"
          >
            <v-file-input
              ref="doc"
              v-model="item.doc"
              :loading="item.loader"
              prepend-icon="mdi-camera"
              :label="item.placeholder || 'Upload Document'"
              @change="changeFile(item, i)"
              @click:clear="removeDoc(i)"
            />
          </v-col>
          <!-- <v-col cols="2">
        <v-btn
          fab
          dark
          x-small
          color="red"
          @click="remove(i);updateAmount()"
        >
          <v-icon dark>
            mdi-minus
          </v-icon>
        </v-btn>
      </v-col> -->
        </v-row>
      </div>
    </div>
    <v-card v-if="inputs.length">
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th>
                Category
              </th>
              <th>
                Article
              </th>
              <th>
                Number
              </th>
              <th>
                Value
              </th>
              <th v-if="format !== 'pdf'">
                Doc
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tblItem, i) in inputs"
              :key="i"
              :class="tblItem.value >= 2500 ? 'above2500' : ''"
            >
              <td>{{ tblItem.cat }}</td>
              <td>{{ tblItem.name }}</td>
              <td>{{ tblItem.number }}</td>
              <td>{{ tblItem.value }}</td>
              <td v-if="format !== 'pdf'">
                <v-btn
                  v-if="tblItem.file"
                  x-small
                  color="primary"
                  :href="tblItem.file"
                  target="_blank"
                >
                  <v-icon dark>
                    mdi-file-link
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-dialog
      v-model="dialogDlt"
      max-width="450"
    >
      <v-card>
        <v-card-title>
          <v-icon
            aria-label="Close"
            @click="dialogDlt = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text style="font-size:15px">
          All claims for high-value items will require proof of valuation in terms of purchase receipt(s) or published
          valuation in the public domain. If no such proof is available, a professional appraisal by a licensed appraiser
          is mandatory prior to pickup.
        </v-card-text>

        <v-card-text class="pb-6 text-center">
          <v-btn
            color="success"
            text
            @click="dialogDlt = false"
          >
            I agree
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    props: {
      items: {
        type: Array,
        default: () => [
          {
            name: '',
            number: 1,
            value: 0,
            doc: {},
            loader: false,
            file: '',
          },
        ],
      },
      disable: {
        type: Boolean,
        default: false,
      },
      format: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        catSearch: '',
        artlSearch: '',
        articleCount: 3,
        dialogDlt: false,
        articles: {
          ANTIQUES: [],
          SILVER: [],
          CHINA: [],
          'GLASS/CRYSTAL': ['cups'],
          PAINTINGS: [],
          'KITCHEN/UTILITY ROOM': [
            'Refrigerator',
            'Stove/Oven',
            'Deep Freezer',
            'Chairs',
            'Tables',
            'Utensils',
            'Dishes',
            'Supplies/Foods',
            'Radios',
            'Microwave',
            'Dishwasher',
            'Washing Machine',
            'Dryer',
            'Ironing Board',
            'Bread Cutter',
            'Lamp',
          ],
          'DINING ROOM': [
            'Tables',
            'Chairs',
            'Cabinet/Hutch',
            'Sideboard/Buffet Antique',
            'Server',
            'Trolley',
            'Rugs',
            'Carpets',
            'Curtains',
            'Pictures',
            'Mirrors',
            'Lamps and Shades',
            'Cutlery',
            'Wall Units',
          ],
          'FAMILY ROOM/STUDY': [
            'Chairs Antique',
            'Tables',
            'Desks Antique',
            'Sofas',
            'Rugs',
            'Carpets',
            'Desk Lamp',
            'Lamp Antique',
            'Radios',
            'Record Players',
            'Records',
            'Mirrors',
            'Clocks',
            'Bookcase',
            'Books/Professional Journals',
            'Curtains',
            'TV Sets',
            'Stereos',
            'VCR',
            'Video Tapes',
            'DVD Player',
            'DVD’s',
            'Cassette Players',
            'Cassettes',
            'Compact Discs',
            'Wall Units',
            'Speakers',
            'TV/Stereo Cabinet',
            'Bar',
          ],
          'LIVING ROOM': [
            'Chairs',
            'Tables',
            'Sofas',
            'Rugs',
            'Carpets',
            'Lamp Artemide Tolomeo',
            'Pictures/Paintings',
            'Mirrors',
            'Piano',
            'Organ',
            'Radios',
            'Clocks',
            'Curtains',
            'Cassette Players',
            'Cassettes',
            'Compact Disc Player',
            'Compact Discs',
            'CD Rack',
            'TV Sets',
            'Record Player',
            'Records',
            'Hi-Fi',
            'Stereos',
            'VCR',
            'Video Tapes',
            'Wall Units',
            'Books',
            'Speakers',
            'TV/Stereo Cabinet Antique',
            'DVD Player',
            'DVD’s',
            'Cabinet with Mirror Antique',
          ],
          'HALLS/STAIRS/LANDING': [],
          'BEDROOM 1': [
            'Beds',
            'Headboards',
            'Chest of Drawers',
            'Chairs',
            'Dressing Table',
            'Clocks',
            'Rugs',
            'Carpets',
            'Lamps and Shades',
            'Pictures/Paintings',
            'Night Tables',
            'Curtains',
            'Radios',
            'Mirrors',
            'Wardrobes',
            'TV Sets',
            'VCR',
            'DVD Player',
          ],
          'BEDROOM 2': [
            'Crib',
            'Headboards',
            'Chest of Drawers',
            'Chairs',
            'Dressing Tables',
            'Clocks',
            'Rugs',
            'Carpets',
            'Lamps and Shades',
            'Pictures/Paintings',
            'Night Tables',
            'Curtains',
            'Radios',
            'Mirrors',
            'Wardrobes',
            'Bed',
          ],
          'BEDROOM 3': [
            'Beds',
            'Headboards',
            'Chest of Drawers',
            'Chairs',
            'Dressing Tables',
            'Clocks',
            'Rugs',
            'Carpets',
            'Lamps and Shades',
            'Pictures/Paintings',
            'Night Tables',
            'Curtains',
            'Radios',
            'Mirrors',
            'Wardrobes',
          ],
          'BEDROOM 4 AND 5': [
            'Beds',
            'Headboards',
            'Chest of Drawers',
            'Chairs',
            'Dressing Tables',
            'Clocks',
            'Rugs',
            'Carpets',
            'Lamps and Shades',
            'Pictures/Paintings',
            'Night Tables',
            'Curtains',
            'Radios',
            'Mirrors',
            'Wardrobes',
          ],
          'CLOTHING - LADIES': [
            'Coats',
            'Jackets',
            'Blazers',
            'Suits',
            'Dresses',
            'Slacks',
            'Sweaters',
            'Blouses',
            'Skirts',
            'Sleepwear',
            'Shoes',
            'Boots',
            'Hosiery/Socks',
            'Scarves/Ties',
            'Underwear',
            'Lingerie',
            'Sportswear',
            'Gloves',
            'Hats',
            'Purses',
            'Handbags',
            'Belts',
            'Shirts',
            'Furs +/Not For Storage, Transit Only',
          ],
          'CLOTHING – MEN’S': [
            'Coats',
            'Jackets',
            'Sports Coats',
            'Trousers',
            'Sweaters',
            'Shirts',
            'Sleepwear',
            'Shoes',
            'Boots',
            'Socks',
            'Ties/Scarves',
            'Underwear',
            'Sportswear',
            'Gloves',
            'Hats',
            'Belts',
          ],
          'CLOTHING - CHILDREN': [
            'Coats',
            'Jackets',
            'Pants/Shorts',
            'Sweaters',
            'Blouses',
            'Shirts',
            'Sleepwear',
            'Shoes',
            'Boots',
            'Socks',
            'Scarves',
            'Underwear',
            'Sportswear',
            'Hats',
            'Belts',
          ],
          LINENS: [
            'Sheets',
            'Pillowcases',
            'Blankets',
            'Bedspreads/Quilts',
            'Tablecloths',
            'Napkins',
            'Towels',
            'Duvets',
          ],
          'SPORTS EQUIPMENT': [
            'Golf Clubs',
            'Skis / Snow Boards',
            'Ski Equipment',
            'Scuba Equipment',
            'Wind Surfer',
            'Fitness Equipment',
            'Tennis/Squash Equipment',
            'Skates',
            'Spinning Bicycle',
          ],
          'PERSONAL BELONGINGS': [
            'Luggage',
            'Bicycle (Adult)',
            'Bicycle (Children)',
            'Toys/Games',
            'Baby Equipment',
          ],
          'GARDEN/BASEMENT/GARAGE': [
            'Chairs Balcony',
            'Tables Balcony',
            'Lounge Chairs',
            'Barbecue',
            'Swings',
            'Gym Sets',
            'Lawn Mowers',
            'Garden Tools',
            'Snow Blower',
            'Ladder',
          ],
          MACHINERY: [
            'Sewing Machine',
            'Vacuum Cleaner',
            'Woodworking Equip',
            'Power Tools +',
          ],
          'HAND TOOLS': [
            'Saws',
            'Drills',
            'Tool Box',
          ],
          'COMPUTER EQUIPMENT': [
            'Computer/CPU',
            'Monitor',
            'Keyboard',
            'Modem',
            'Printer',
            'Speakers',
            'Work Station',
            'Laptop',
            'Scanner',
            'Fax Machine',
            'Telephone/Answering Mach.',
            'Digital Camera',
            'Software/Supplies',
            'Video Game Console',
            'Video Games',
            'Other',
          ],
          'WINE AND SPIRITS': [
            'Items Insured Against Loss or Breakage Only',
          ],
          'ELECTRONIC EQUIPMENT': [],
          'PHOTOGRAPHIC EQUIPMENT': [],
          'MUSICAL INSTRUMENTS': [],
          'COLLECTOR ITEMS': [],
          'OWNER PACKED ITEMS': {},
          'MISCELLANEOUS ITEMS': [],
          MISCELLANEOUS: [],
        },
        inputs: this.items,
        numbers: [],
        rules: {
          required: v => !!v || 'Required',
          docRequired: item => !!item.file || 'Required',
          maximum: v => v <= 2500 || 'Maximum value should be less then 2500',
        },
      }
    },
    watch: {
      items (v) { this.inputs = v },
    },
    mounted () {
      this.updateAmount()
    },
    methods: {
      ...mapActions(['uploadFile']),
      validate () {
        return this.inpValidate(this.$refs)
      },
      add () {
        this.inputs.push({ cat: '', name: '', number: 1, value: 0, doc: {}, file: '', loader: false })
      },
      remove (i) {
        this.inputs.splice(i, 1)
      },
      async changeFile (item, ind) {
        if (item.doc) {
          const self = this
          this.inputs[ind].loader = true
          const allInputs = self.inputs
          allInputs[ind].placeholder = 'Uploading...'
          const formData = new FormData()
          formData.append('file', item.doc)
          this.uploadFile(formData)
            .then((data) => {
              item.file = data
              allInputs[ind].placeholder = 'Uploaded'
              allInputs[ind].file = data
              allInputs[ind].loader = false
              self.inputs = allInputs
            })
        }
      },
      isFileBlank (ind) {
        return !!this.inputs[ind].file || 'Document Required'
      },
      removeDoc (ind) {
        const allInputs = this.inputs
        allInputs[ind].file = ''
        this.inputs = allInputs
      },
      updateAmount (e = null) {
        if (e && e >= 2500) this.dialogDlt = true
        const amt = Number(this.inputs.reduce((a, b) => { return Number(a) + Number(b.value) * Number(b.number) }, 0))
        this.$emit('updateAmount', amt)
        this.changeField(this.inputs, 'article')
      },
      changeField (val, name) {
        this.$emit('updateField', val, name)
      },
    },
  }
</script>

<style scoped>
  tr.above2500{
    background: #e2cfa1;
  }
</style>
