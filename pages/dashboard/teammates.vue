<template>
  <div>
    <v-row>
      <h1>Teammates</h1>
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
      <v-autocomplete
        v-model="godDropdown.selected"
        placeholder="Choose a god to compare"
        :disabled="godDropdown.disabled"
        :items="gods"
        chips
        filled
        color="blue-grey lighten-2"
        label="Select"
        item-text="name"
        return-object
        @change="changeGod"
      >
        <template v-slot:selection="data">
          <v-chip>
            <v-avatar left size="30">
              <v-img :src="`/gods/icons/${data.item.slug}.jpg`"></v-img>
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-avatar>
              <img :src="`/gods/icons/${data.item.slug}.jpg`" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.group"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
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
              <div
                v-for="god in gods"
                v-show="god.id !== godDropdown.selected.id"
                :key="god.id"
                class="god"
              >
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
    <v-dialog v-model="modalNewConfig" persistent max-width="600px">
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
                  v-model="config.name"
                  label="Teammate name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn @click="create()">CREATE</v-btn>
                <v-btn @click="modalNewConfig = false">CANCEL</v-btn>
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
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
      type: 'teammate',
      uidSelected: '',
      name: ''
    },
    godDropdown: {
      selected: {},
      disabled: true
    },
    gods: [],
    tableRow: {
      a: {
        name: '💖',
        class: 'category-a',
        data: []
      },
      b: {
        name: '🤗',
        class: 'category-b',
        data: []
      },
      c: {
        name: '😐',
        class: 'category-c',
        data: []
      },
      d: {
        name: '😵',
        class: 'category-d',
        data: []
      },
      e: {
        name: '💔',
        class: 'category-e',
        data: []
      }
    },
    dropdownConfigState: 0,
    currentConfig: '',
    modalNewConfig: false,
    snackbar: {
      status: false,
      text: 'Teammate created!',
      color: 'teal',
      time: 5000
    },
    overlay: false
  }),
  computed: {
    godsArray() {
      return Object.values(this.gods)
    }
  },
  created() {
    this.config.uidSelected = 1
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
      const tableValues = []
      _.forEach(this.tableRow, (line, key) => {
        line.data.map((item) => {
          switch (key) {
            case 'a':
              item.value = 5
              break
            case 'b':
              item.value = 4
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

          tableValues.push({
            id: item.id,
            name: item.name,
            value: item.value
          })
        })
      })

      return [
        {
          id: this.godDropdown.selected.id,
          name: this.godDropdown.selected.name,
          teammate: Object.values(tableValues)
        }
      ]
    },
    async createService(name, data) {
      return await this.$axios.$post(
        '/teammate',
        { name, data },
        this.handleToken()
      )
    },
    async create() {
      this.overlay = true
      const data = this.handlerDataTierlist()
      const ret = await this.createService(this.config.name, data)
      if (ret.message === 'success') {
        this.modalNewConfig = false
        this.snackbar.text = 'Teammate created!'
        this.snackbar.status = true
      }
      this.dropdownConfigState += 1
      this.clearTable()
      this.overlay = false
    },
    async save() {
      if (this.config.uidSelected) {
        if (this.config.uidSelected === 1) {
          this.modalNewConfig = true
        } else {
          this.overlay = true
          const data = this.handlerDataTierlist()
          const ret = await this.updateService(this.config.name, data)
          if (ret.data.message === 'success') {
            this.snackbar.status = true
            this.snackbar.text = 'Updated!'
          }
          this.overlay = false
        }
      }
    },
    async updateService(name, data) {
      const options = {
        method: 'patch',
        url: `/teammate/${this.config.uidSelected}`,
        data: {
          name,
          data
        },
        ...this.handleToken()
      }
      return await this.$axios(options)
    },
    clearTable() {
      this.tableRow.a.data = []
      this.tableRow.b.data = []
      this.tableRow.c.data = []
      this.tableRow.d.data = []
      this.tableRow.e.data = []
    },
    clearGodDropdown() {
      this.godDropdown.selected = {}
    },
    changeConfig({ value, name }) {
      this.config.uidSelected = value
      this.config.name = name
      this.godDropdown.disabled = false
      this.clearTable()
    },
    changeGod() {
      this.clearTable()
      if (this.config.uidSelected !== 1) {
        this.getMatchupByUid(
          this.config.uidSelected,
          this.godDropdown.selected.id
        )
      }
    },
    getMatchupByUid(uid, godId) {
      this.$axios
        .$get(`/teammate/${uid}?god=${godId}`, this.handleToken())
        .then((ret) => {
          if (ret.message === 'success') {
            Object.values(ret.data.data.teammate).map((god, index) => {
              const obj = {
                id: god.id,
                name: god.name,
                slug: toSlug(god.name),
                value: god.value
              }

              switch (god.value) {
                case 5:
                  this.tableRow.a.data.push(obj)
                  break
                case 4:
                  this.tableRow.b.data.push(obj)
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
<style lang="scss" scoped>
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
</style>
