<template>
  <div>
    <v-row>
      <h1>Tier List</h1>
    </v-row>
    <v-row>
      <v-col cols="9">
        <dropdownConfig
          :key="dropdownConfigState"
          :config-type="config.type"
          @change="changeConfig"
        />
      </v-col>
      <v-col cols="3">
        <v-btn @click="save()">Save</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <tableRanking :rows="tableRow" />
      </v-col>
      <v-col cols="3">
        <h3>Gods</h3>
        <v-row>
          <draggable id="godSelection" group="tier" :list="gods">
            <transition-group>
              <div v-for="god in gods" :key="god.id" class="god">
                <v-img
                  :src="`/gods/icons/${god.slug}.jpg`"
                  aspect-ratio="1"
                  :title="`${god.name}`"
                >
                </v-img>
              </div>
            </transition-group>
          </draggable>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="modalNewTierlist" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Did you want create a new config?
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="tierlistName"
                  label="Tierlist name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn @click="create()">CREATE</v-btn>
                <v-btn @click="modalNewTierlist = false">CANCEL</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.status"
      :color="snackbar.color"
      top
      :timeout="snackbar.time"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar.status = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import _ from 'lodash'
import dropdownConfig from '../../components/dashboard/dropdownConfig'
import tableRanking from '../../components/dashboard/tableRanking'
import { toSlug } from '../../assets/tools'

export default {
  components: {
    draggable,
    dropdownConfig,
    tableRanking
  },
  data: () => ({
    config: {
      type: 'tierlist',
      uidSelected: '',
      name: ''
    },
    gods: [],
    tableRow: {
      s: {
        name: 'S',
        class: 'category-s',
        data: []
      },
      a: {
        name: 'A',
        class: 'category-a',
        data: []
      },
      b_plus: {
        name: 'B+',
        class: 'category-bplus',
        data: []
      },
      b_minus: {
        name: 'B-',
        class: 'category-bminus',
        data: []
      },
      c: {
        name: 'C',
        class: 'category-c',
        data: []
      },
      d: {
        name: 'D',
        class: 'category-d',
        data: []
      },
      e: {
        name: 'E',
        class: 'category-e',
        data: []
      }
    },
    dropdownConfigState: 0,
    tierlistName: '',
    currentConfig: '',
    modalNewTierlist: false,
    snackbar: {
      status: false,
      text: 'Tierlist created!',
      color: 'teal',
      time: 5000
    }
  }),
  computed: {
    godsArray() {
      return Object.values(this.gods)
    }
  },
  mounted() {
    this.$axios.$get('/gods').then((data) => {
      this.gods = Object.values(data)
    })
  },
  methods: {
    handleToken() {
      const { token } = JSON.parse(localStorage.getItem('user'))
      return {
        headers: {
          'x-access-token': token
        }
      }
    },
    handlerDataTierlist() {
      const tierlistValues = []
      _.forEach(this.tableRow, (line, key) => {
        line.data.map((item) => {
          switch (key) {
            case 's':
              item.value = 5
              break
            case 'a':
              item.value = 4.5
              break
            case 'b_plus':
              item.value = 4
              break
            case 'b_minus':
              item.value = 3.5
              break
            case 'c':
              item.value = 3
              break
            case 'd':
              item.value = 2
              break
            case 'e':
              item.value = 1
              break
          }

          tierlistValues.push({
            id: item.id,
            name: item.name,
            slug: toSlug(item.name),
            value: item.value
          })
        })
      })
      return Object.values(tierlistValues)
    },
    async createService(name, data) {
      return await this.$axios.$post(
        '/tierlist',
        { name, data },
        this.handleToken()
      )
    },
    async create() {
      const data = this.handlerDataTierlist()
      const tierlist = await this.createService(this.tierlistName, data)
      if (tierlist.message === 'success') {
        this.modalNewTierlist = false
        this.snackbar.text = 'Tierlist created!'
        this.snackbar.status = true
      }
      this.dropdownConfigState += 1
      this.clearTierlist()
    },
    async save() {
      if (this.config.uidSelected) {
        if (this.config.uidSelected === 1) {
          this.modalNewTierlist = true
        } else {
          const data = this.handlerDataTierlist()
          const ret = await this.updateService(this.config.name, data)
          if (ret.data.message === 'success') {
            this.snackbar.status = true
            this.snackbar.text = 'Updated!'
          }
        }
      }
    },
    async updateService(name, data) {
      const options = {
        method: 'patch',
        url: `/tierlist/${this.config.uidSelected}`,
        data: {
          name,
          data
        },
        ...this.handleToken()
      }
      return await this.$axios(options)
    },
    clearTierlist() {
      this.tableRow.s.data = []
      this.tableRow.a.data = []
      this.tableRow.b_plus.data = []
      this.tableRow.b_minus.data = []
      this.tableRow.c.data = []
      this.tableRow.d.data = []
      this.tableRow.e.data = []
    },
    changeConfig({ value, name }) {
      this.config.uidSelected = value
      this.config.name = name
      this.clearTierlist()
      if (value !== 1) {
        this.getTierlistByUid(this.config.uidSelected)
      }
    },
    getTierlistByUid(uid) {
      this.$axios.$get(`/tierlist/${uid}`, this.handleToken()).then((ret) => {
        if (ret.message === 'success') {
          Object.values(ret.data[0].data).map((god, index) => {
            const obj = {
              id: god.id,
              name: god.name,
              slug: toSlug(god.name),
              value: god.value
            }

            switch (god.value) {
              case 5:
                this.tableRow.s.data.push(obj)
                break
              case 4.5:
                this.tableRow.a.data.push(obj)
                break
              case 4:
                this.tableRow.b_plus.data.push(obj)
                break
              case 3.5:
                this.tableRow.b_minus.data.push(obj)
                break
              case 3:
                this.tableRow.c.data.push(obj)
                break
              case 2:
                this.tableRow.d.data.push(obj)
                break
              case 1:
                this.tableRow.e.data.push(obj)
                break
            }
          })
        }
      })
    }
  },
  layout: 'dashboard'
}
</script>
<style lang="scss">
.god {
  width: 50px;
  float: left;
  margin-right: 3px;
  margin-top: 1.5px;
  margin-bottom: 1.5px;
  cursor: pointer;
}

#godSelection {
  overflow-y: scroll;
  height: 500px;
}

table tr:hover {
  cursor: pointer;
  filter: contrast(1.5);
}

table {
  .category-s:hover,
  .category-s {
    background: rgb(250, 158, 0);
    background: linear-gradient(
      90deg,
      rgb(201, 33, 3) 0%,
      rgb(241, 64, 64) 100%
    ) !important;
  }

  .category-bplus:hover,
  .category-bplus {
    background: rgb(250, 158, 0);
    background: linear-gradient(
      90deg,
      rgb(218, 118, 5) 0%,
      rgb(235, 184, 14) 100%
    ) !important;
  }

  .category-bminus:hover,
  .category-bminus {
    background: rgb(159, 245, 0);
    background: linear-gradient(
      90deg,
      rgb(236, 213, 4) 0%,
      rgb(246, 248, 126) 100%
    ) !important;
  }
}
</style>
