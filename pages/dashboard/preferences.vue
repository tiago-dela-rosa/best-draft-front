<template>
  <div>
    <v-row>
      <h1>Preferences</h1>
    </v-row>
    <v-row>
      <v-col cols="9">
        <v-btn class="fr" @click="save()">Save</v-btn>
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
import tableRanking from '../../components/dashboard/tableRanking'
import { toSlug } from '../../assets/tools'

export default {
  components: {
    draggable,
    tableRanking
  },
  data: () => ({
    config: {
      statePreference: '',
      preferenceUid: ''
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
    tierlistName: '',
    currentConfig: '',
    snackbar: {
      status: false,
      text: 'Tierlist created!',
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
  mounted() {
    this.$axios.$get('/gods').then((data) => {
      this.gods = Object.values(data)
    })
    this.getPreferencesService().then((ret) => {
      this.config.statePreference = ret.data.length <= 0 ? 'new' : 'dirty'
      this.config.preferenceUid = ret.data[0].uid
      if (this.config.statePreference === 'dirty') {
        this.getPreferenceByUid(this.config.preferenceUid)
        this.gods = []
      }
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
    userConfig() {
      const { user } = JSON.parse(localStorage.getItem('user'))
      return user
    },
    handlerPreference() {
      const preferenceValues = []
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
          preferenceValues.push({
            id: item.id,
            name: item.name,
            slug: toSlug(item.name),
            value: item.value
          })
        })
      })
      return Object.values(preferenceValues)
    },
    async getPreferencesService() {
      const { uid } = this.userConfig()
      return await this.$axios.$get(
        `/preference/user/${uid}`,
        this.handleToken()
      )
    },
    async createService(data) {
      return await this.$axios.$post(
        '/preference',
        { data },
        this.handleToken()
      )
    },
    async create() {
      this.overlay = true
      const data = this.handlerPreference()
      const retPreference = await this.createService(data)
      if (retPreference.message === 'success') {
        this.snackbar.text = 'Preference has ben created!'
        this.snackbar.status = true
        this.config.statePreference = 'dirty'
        this.dropdownConfigState += 1
        this.clearTierlist()
      }
      this.overlay = false
    },
    save() {
      if (this.config.statePreference === 'new') {
        this.create()
      } else {
        this.update()
      }
    },
    async updateService(data) {
      const options = {
        method: 'patch',
        url: `/preference/${this.config.preferenceUid}`,
        data: {
          data
        },
        ...this.handleToken()
      }
      return await this.$axios(options)
    },
    async update() {
      this.overlay = true
      const data = this.handlerPreference()
      const retPreference = await this.updateService(data)
      if (retPreference.message === 'success') {
        this.snackbar.text = 'Preference has ben updated!'
        this.snackbar.status = true
        this.config.statePreference = 'dirty'
        this.dropdownConfigState += 1
      }
      this.overlay = false
    },
    clearTierlist() {
      this.tableRow.a.data = []
      this.tableRow.b.data = []
      this.tableRow.c.data = []
      this.tableRow.d.data = []
      this.tableRow.e.data = []
    },
    getPreferenceByUid(uid) {
      this.$axios.$get(`/preference/${uid}`, this.handleToken()).then((ret) => {
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
