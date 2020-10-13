<template dark>
  <v-container fluid>
    <v-dialog v-model="configuration.orderPickModal" persistent max-width="590">
      <v-card>
        <v-card-title class="headline grey lighten-2 mb-5" primary-title>
          Lets Draft {{ personal.user.name }}!
        </v-card-title>
        <v-card-text>
          <div v-if="$vuetify.breakpoint.name === 'xs'" class="mb-3">
            <p>
              Swipe to <b>left</b> and <b>right</b> to go to the <b>next</b> and
              <b>prev</b> pick
            </p>
            <hr />
          </div>
          <b>Public or personal config?</b>
          <v-radio-group v-model="configuration.source" row>
            <v-radio label="Public" value="public"></v-radio>
            <v-radio
              label="Personal"
              :disabled="!personal.isSigning"
              value="personal"
            ></v-radio>
          </v-radio-group>

          <div v-if="configuration.source === 'personal'">
            <v-select
              v-model="tierlistUid"
              :items="personal.tierlists"
              item-text="text"
              item-value="value"
              label="Tierlist config"
              outlined
            ></v-select>
            <v-select
              v-model="matchupUid"
              :items="personal.matchups"
              item-text="text"
              item-value="value"
              label="Matchup config"
              outlined
            ></v-select>
            <v-select
              v-model="teammateUid"
              :items="personal.teammates"
              item-text="text"
              item-value="value"
              label="Teammate config"
              outlined
            ></v-select>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue" text @click="teamOrder('first')">
            First pick
          </v-btn>
          <v-btn color="red" text @click="teamOrder('second')">
            Second pick
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="configuration.order">
      <v-row
        v-touch="{
          left: () => next(),
          right: () => prev()
        }"
      >
        <v-btn
          v-show="toTopButton"
          v-scroll="onScroll"
          fab
          dark
          fixed
          bottom
          right
          color="deep-orange"
          @click="draftToTop"
          ><v-icon>mdi-lightning-bolt</v-icon>
        </v-btn>

        <!-- order -->
        <v-col
          id="order"
          class="order d-xs-inline mb-2"
          order="2"
          order-sm="1"
          cols="12"
          sm="4"
        >
          <ul class="bans">
            <li
              v-for="ban in bansOrderTeam"
              :key="ban.id"
              :class="{ current: ban.sequence == picks.current.order }"
              :style="{
                'background-image':
                  'url(/gods/icons/' +
                  picks.pickStages[ban.id - 1].godSelected.slug +
                  '.jpg) !important'
              }"
            ></li>
          </ul>

          <v-card
            v-for="pick in orderTeam"
            :key="pick.id"
            class="mx-auto mb-3"
            :class="{ current: pick.sequence == picks.current.order }"
          >
            <div v-if="$vuetify.breakpoint.name === 'xs'">
              <v-select
                v-model="picks.pickStages[pick.id - 1].godSelected"
                placeholder="Select a god"
                :items="gods"
                :disabled="
                  picks.pickStages[pick.id - 1].sequence > picks.current.order
                "
                chips
                filled
                color="blue-grey lighten-2 mb-0"
                label="Select"
                item-text="name"
                return-object
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
                  <template>
                    <v-list-item-avatar>
                      <img :src="`/gods/icons/${data.item.slug}.jpg`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.name }}</v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        data.item.group
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-select>
            </div>

            <div v-else>
              <v-autocomplete
                v-model="picks.pickStages[pick.id - 1].godSelected"
                disable-lookup
                placeholder="Select a god"
                :items="gods"
                :disabled="
                  picks.pickStages[pick.id - 1].sequence > picks.current.order
                "
                chips
                filled
                color="blue-grey lighten-2 mb-0"
                label="Select"
                item-text="name"
                return-object
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
                  <template>
                    <v-list-item-avatar>
                      <img :src="`/gods/icons/${data.item.slug}.jpg`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.name }}</v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        data.item.group
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </div>

            <v-select
              v-model="picks.pickStages[pick.id - 1].roleSelected"
              disable-lookup
              clearable
              class="roleAutocomplete"
              placeholder="Role"
              :items="picks.roles"
              filled
              color="blue-grey lighten-2"
              label="Select"
              item-text="name"
              return-object
            >
              <template v-slot:item="data">
                <template>
                  <v-avatar left class="mr-3" size="30">
                    <v-img :src="data.item.avatar"></v-img>
                  </v-avatar>
                  <v-list-item-content
                    v-text="data.item.name"
                  ></v-list-item-content>
                </template>
              </template>
              <template v-slot:selection="data">
                <template>
                  <v-avatar left class="mr-3" size="30">
                    <v-img :src="data.item.avatar"></v-img>
                  </v-avatar>
                  <v-list-item-content
                    v-text="data.item.name"
                  ></v-list-item-content>
                </template>
              </template>
            </v-select>
            <v-switch
              v-if="configuration.source === 'personal'"
              v-model="picks.pickStages[pick.id - 1].playerSelect"
              class="userPickSwitch"
              label="Play this pick"
            ></v-switch>
          </v-card>
        </v-col>

        <!-- controller -->
        <v-col id="controller" order="1" order-sm="2" cols="12" sm="4">
          <v-card>
            <v-card-title>
              <b
                :class="{ 'blue--text': currentPhase[0].team === 'order' }"
                class="red--text mr-1"
                >{{ currentPhase[0].team }}
              </b>
              turn - {{ currentPhase[0].type }} phase</v-card-title
            >

            <div v-if="$vuetify.breakpoint.name === 'xs'">
              <v-select
                v-model="picks.pickStages[currentPhase[0].id - 1].godSelected"
                disable-lookup
                placeholder="Select"
                :disabled="currentPhase[0].type != 'ban'"
                :items="gods"
                chips
                filled
                color="blue-grey lighten-2 mb-0"
                label="Select"
                item-text="name"
                return-object
                @change="
                  $vuetify.breakpoint.name === 'xs'
                    ? $vuetify.goTo(`#${currentPhase[0].team}`)
                    : ''
                "
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
                  <template>
                    <v-list-item-avatar>
                      <img :src="`/gods/icons/${data.item.slug}.jpg`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        data.item.name
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        data.item.group
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-select>
            </div>

            <div v-else>
              <v-autocomplete
                v-model="picks.pickStages[currentPhase[0].id - 1].godSelected"
                disable-lookup
                placeholder="Select"
                :disabled="currentPhase[0].type != 'ban'"
                :items="gods"
                chips
                filled
                color="blue-grey lighten-2 mb-0"
                label="Select"
                item-text="name"
                return-object
                @change="
                  $vuetify.breakpoint.name === 'xs'
                    ? $vuetify.goTo(`#${currentPhase[0].team}`)
                    : ''
                "
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
                  <template>
                    <v-list-item-avatar>
                      <img :src="`/gods/icons/${data.item.slug}.jpg`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        data.item.name
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        data.item.group
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </div>
          </v-card>
          <v-row>
            <v-col cols="6">
              <v-btn
                width="100%"
                color="grey"
                :dark="picks.current.order !== 1"
                :disabled="picks.current.order === 1"
                @click="prev()"
              >
                <v-icon left>mdi-page-previous</v-icon> Prev</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                width="100%"
                dark
                color="teal"
                :disabled="picks.current.order === 20"
                @click="next()"
              >
                <v-icon left>mdi-page-next</v-icon> Next</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn width="100%" dark color="deep-orange" @click="draft()">
                <v-icon left>mdi-lightning-bolt</v-icon> Draft
              </v-btn>
              <div
                v-show="draftSuggest.length <= 0"
                class="text--primary mt-3 text-center"
              >
                Hit the <b class="deep-orange--text">draft</b> button <br />
                to see the top picks for this phase!
              </div>
              <v-card v-show="draftSuggest.length > 0" class="mt-5">
                <v-card-title>Suggestions</v-card-title>
                <v-list id="suggestions" flat>
                  <div v-show="!loadingDraft">
                    <div
                      v-for="(suggestion, index) in draftSuggest"
                      :key="suggestion.id"
                      @click="pickSuggest(suggestion)"
                    >
                      <v-divider v-show="index > 0"></v-divider>
                      <v-list-item-group>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-img
                              :src="'/gods/icons/' + suggestion.slug + '.jpg'"
                            ></v-img>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="suggestion.name"
                            ></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon class="fr">
                            <big>{{ suggestion.value | parseInt }}</big>
                          </v-list-item-icon>
                        </v-list-item>
                      </v-list-item-group>
                    </div>
                  </div>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <!-- chaos -->
        <v-col
          id="chaos"
          class="chaos d-xs-inline"
          order="3"
          order-sm="3"
          cols="12"
          sm="4"
        >
          <ul class="bans">
            <li
              v-for="ban in bansChaosTeam"
              :key="ban.id"
              :class="{ current: ban.sequence == picks.current.order }"
              :style="{
                'background-image':
                  'url(/gods/icons/' +
                  picks.pickStages[ban.id - 1].godSelected.slug +
                  '.jpg) !important'
              }"
            ></li>
          </ul>
          <v-card
            v-for="pick in chaosTeam"
            :key="pick.id"
            class="mx-auto mb-3"
            :class="{ current: pick.sequence == picks.current.order }"
          >
            <div v-if="$vuetify.breakpoint.name === 'xs'">
              <v-select
                v-model="picks.pickStages[pick.id - 1].godSelected"
                placeholder="Select a god"
                :items="gods"
                :disabled="
                  picks.pickStages[pick.id - 1].sequence > picks.current.order
                "
                chips
                filled
                color="blue-grey lighten-2 mb-0"
                label="Select"
                item-text="name"
                return-object
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
                  <template>
                    <v-list-item-avatar>
                      <img :src="`/gods/icons/${data.item.slug}.jpg`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.name }}</v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        data.item.group
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-select>
            </div>

            <div v-else>
              <v-autocomplete
                v-model="picks.pickStages[pick.id - 1].godSelected"
                disable-lookup
                placeholder="Select a god"
                :items="gods"
                :disabled="
                  picks.pickStages[pick.id - 1].sequence > picks.current.order
                "
                chips
                filled
                color="blue-grey lighten-2 mb-0"
                label="Select"
                item-text="name"
                return-object
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
                  <template>
                    <v-list-item-avatar>
                      <img :src="`/gods/icons/${data.item.slug}.jpg`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.item.name }}</v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        data.item.group
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </div>

            <v-select
              v-model="picks.pickStages[pick.id - 1].roleSelected"
              disable-lookup
              clearable
              class="roleAutocomplete"
              placeholder="Role"
              :items="picks.roles"
              filled
              color="blue-grey lighten-2"
              label="Select"
              item-text="name"
              return-object
            >
              <template v-slot:item="data">
                <template>
                  <v-avatar left class="mr-3" size="30">
                    <v-img :src="data.item.avatar"></v-img>
                  </v-avatar>
                  <v-list-item-content
                    v-text="data.item.name"
                  ></v-list-item-content>
                </template>
              </template>
              <template v-slot:selection="data">
                <template>
                  <v-avatar left class="mr-3" size="30">
                    <v-img :src="data.item.avatar"></v-img>
                  </v-avatar>
                  <v-list-item-content
                    v-text="data.item.name"
                  ></v-list-item-content>
                </template>
              </template>
            </v-select>

            <v-switch
              v-if="configuration.source === 'personal'"
              class="userPickSwitch"
              label="Play this pick"
            ></v-switch>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import _ from 'lodash'
import goTo from 'vuetify/es5/services/goto'
import { Touch } from 'vuetify/lib/directives'
import { stages } from '../assets/draft'

export default {
  filters: {
    parseInt(value) {
      if (!value) return ''
      return value.toFixed(2)
    }
  },
  directives: {
    Touch
  },
  data: () => ({
    toTopButton: false,
    loadingDraft: false,
    gods: [],
    personal: {
      isSigning: false,
      user: '',
      tierlists: [],
      matchups: [],
      teammates: [],
      matchupUid: '',
      teammateUid: ''
    },
    configuration: {
      endpoints: {
        tierlist: 'public/tierlist',
        matchup: 'public/matchup',
        teammate: 'public/teammate'
      },
      source: 'public',
      orderPickModal: true,
      order: '',
      preferences: '',
      rankings: {
        suggestions: [],
        tierlist: ''
      },
      weigths: {
        rulePreserveFirstPick: 0.3,
        rulePreferencePick: 0.3,
        ruleRolePick: 1.75,
        ruleMatchupPick: 1.2,
        ruleTeammatePick: 0.5
      }
    },
    picks: {
      current: {
        pick: {},
        order: 1
      },
      roles: [
        {
          name: 'support',
          avatar: '/roles/guardian.png'
        },
        {
          name: 'carry',
          avatar: '/roles/hunter.png'
        },
        {
          name: 'mid',
          avatar: '/roles/mage.png'
        },
        {
          name: 'jungle',
          avatar: '/roles/assassin.png'
        },
        {
          name: 'solo',
          avatar: '/roles/warrior.png'
        }
      ],
      pickStages: ''
    }
  }),
  computed: {
    tierlistUid: {
      get() {
        return this.getStorageConfig().personal.tierlist || null
      },
      set(value) {
        this.value = this.saveStorageConfig('tierlist', value)
      }
    },
    matchupUid: {
      get() {
        return this.getStorageConfig().personal.matchup || null
      },
      set(value) {
        this.value = this.saveStorageConfig('matchup', value)
      }
    },
    teammateUid: {
      get() {
        return this.getStorageConfig().personal.teammate || null
      },
      set(value) {
        this.value = this.saveStorageConfig('teammate', value)
      }
    },
    chaosTeam() {
      return this.picks.pickStages.filter((value) => {
        return value.team === 'chaos' && value.type === 'pick'
      })
    },
    orderTeam() {
      return this.picks.pickStages.filter((value) => {
        return value.team === 'order' && value.type === 'pick'
      })
    },
    bansChaosTeam() {
      return this.picks.pickStages.filter((value) => {
        return value.team === 'chaos' && value.type === 'ban'
      })
    },
    bansOrderTeam() {
      return this.picks.pickStages.filter((value) => {
        return value.team === 'order' && value.type === 'ban'
      })
    },
    currentPhase() {
      return this.picks.pickStages.filter((value) => {
        return value.sequence === this.picks.current.order
      })
    },
    draftSuggest() {
      let diff

      if (!_.isEmpty(this.blacklist)) {
        diff = Object.values(this.configuration.rankings.suggestions).filter(
          (value) => {
            return this.blacklist[value.id] === undefined
          }
        )
      } else {
        diff = this.configuration.rankings.suggestions
      }

      const limitSuggestions = this.$vuetify.breakpoint.name === 'xs' ? 5 : 9

      return _.orderBy(diff, ['value'], ['desc']).filter((value, index) => {
        return index <= limitSuggestions
      })
    },
    blacklist() {
      const blacklist = {}
      this.picks.pickStages.map((picks) => {
        if (!_.isEmpty(picks.godSelected) && picks !== undefined) {
          return (blacklist[picks.godSelected.id] = picks.godSelected)
        }
      })

      return _.omit(
        blacklist,
        _.filter(_.keys(blacklist), function(key) {
          return _.isUndefined(blacklist[key])
        })
      )
    }
  },
  watch: {},
  created() {
    this.createStorageConfig()
    this.verifyUser()
    this.getGods()
    this.listenKeys()
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.toTopButton = top > 100
    },
    draftToTop() {
      this.$vuetify.goTo(0)
      this.draft()
    },
    goToScroll(element) {
      if (this.$vuetify.breakpoint.name === 'xs') {
        return goTo(element)
      }
    },
    listenKeys() {
      window.addEventListener('keydown', (e) => {
        if (this.configuration.order) {
          switch (e.key) {
            case 'ArrowLeft':
              this.prev()
              break
            case 'ArrowRight':
              this.next()
              break
            case 'Enter':
              this.draft()
              break
          }
        }
      })
    },
    getStorageConfig() {
      return JSON.parse(localStorage.getItem('initialConfig'))
    },
    createStorageConfig() {
      if (!this.getStorageConfig()) {
        localStorage.setItem(
          'initialConfig',
          JSON.stringify({
            public: {},
            personal: { tierlist: null, matchup: null, teammate: null }
          })
        )
      }
    },
    saveStorageConfig(key, uid) {
      const storage = this.getStorageConfig()
      storage.personal[key] = uid
      localStorage.setItem('initialConfig', JSON.stringify(storage))
    },
    verifyUser() {
      if (localStorage.getItem('user')) {
        this.personal.isSigning = true
        this.personal.user = JSON.parse(localStorage.getItem('user')).user
        this.configuration.source = 'personal'
        this.serviceTierlistByUser()
        this.serviceMatchupByUser()
        this.serviceTeammateByUser()
      }
    },
    getGods() {
      return this.$axios.$get('/gods').then((data) => {
        this.gods = Object.values(data)
      })
    },
    serviceTierlistByUser() {
      return this.$axios
        .$get(`tierlist/user/${this.personal.user.uid}`, this.handleToken())
        .then((tierlist) => {
          const dropdown = tierlist.data.map((t) => {
            return { text: t.name, value: t.uid }
          })
          dropdown.push({ text: 'Default Tierlist', value: 'public_tierlist' })
          this.personal.tierlists = dropdown
        })
    },
    serviceMatchupByUser() {
      return this.$axios
        .$get(`matchup/user/${this.personal.user.uid}`, this.handleToken())
        .then((matchup) => {
          const dropdown = matchup.data.map((m) => {
            return { text: m.name, value: m.uid }
          })
          dropdown.push({ text: 'Default Matchup', value: 'public_matchup' })
          this.personal.matchups = dropdown
        })
    },
    serviceTeammateByUser() {
      return this.$axios
        .$get(`teammate/user/${this.personal.user.uid}`, this.handleToken())
        .then((teammate) => {
          const dropdown = teammate.data.map((t) => {
            return { text: t.name, value: t.uid }
          })
          dropdown.push({ text: 'Default Teammate', value: 'public_teammate' })
          this.personal.teammates = dropdown
        })
    },
    setPersonalEndpoints() {
      if (this.configuration.source === 'personal') {
        this.tierlistUid === 'public_tierlist'
          ? (this.configuration.endpoints.tierlist = '/public/tierlist')
          : (this.configuration.endpoints.tierlist = `tierlist/${this.tierlistUid}`)

        this.matchupUid === 'public_matchup'
          ? (this.configuration.endpoints.matchup = '/public/matchup')
          : (this.configuration.endpoints.matchup = `matchup/${this.matchupUid}`)

        this.teammateUid === 'public_teammate'
          ? (this.configuration.endpoints.teammate = '/public/teammate')
          : (this.configuration.endpoints.teammate = `teammate/${this.teammateUid}`)
      }
    },
    teamOrder(order) {
      this.setPersonalEndpoints()
      this.setTierlist()
      this.configuration.order = order
      this.configuration.orderPickModal = false
      if (order === 'first') {
        this.picks.pickStages = stages('first')
      } else {
        this.picks.pickStages = stages('second')
      }
    },
    handleToken() {
      if (this.configuration.source === 'public') return false

      const { token } = JSON.parse(localStorage.getItem('user'))
      return {
        headers: {
          'x-access-token': token
        }
      }
    },
    prev() {
      if (this.picks.current.order > 1) {
        this.picks.current.order--
        this.goToScroll(`#${this.currentPhase[0].team}`)
      }
    },
    next() {
      if (this.picks.current.order < 20) {
        this.picks.current.order++
        this.configuration.rankings.suggestions = []
        this.goToScroll(`#${this.currentPhase[0].team}`)
      }
    },
    pickSuggest(suggest) {
      const pickStage = this.picks.current.order - 1

      // the "value" property conflict with autocomplete
      delete suggest.value
      this.picks.pickStages[pickStage].godSelected = suggest
      this.next()
    },
    setTierlist() {
      return this.$axios
        .$get(this.configuration.endpoints.tierlist, this.handleToken())
        .then((response) => {
          this.configuration.rankings.tierlist = response.data[0].data
        })
    },
    serviceMatchup(id) {
      return this.$axios
        .$get(
          `${this.configuration.endpoints.matchup}?god=${id}`,
          this.handleToken()
        )
        .then((response) => {
          return response.data.data.against
        })
    },
    serviceTeammate(id) {
      return this.$axios
        .$get(
          `${this.configuration.endpoints.teammate}?god=${id}`,
          this.handleToken()
        )
        .then((response) => {
          return response.data.data
        })
    },
    servicePreference() {
      return this.$axios
        .$get(
          '/preference/7abf2e45-919f-4778-ba92-a90432ee980c',
          this.handleToken()
        )
        .then((response) => {
          return response.data[0].data
        })
    },
    prevPicks(isOpposingTeam = true) {
      const prevPicks = []
      this.picks.pickStages.map((stage) => {
        if (
          this.currentPhase[0].sequence >= stage.sequence + 1 &&
          stage.type === 'pick'
        ) {
          // get same team picks
          if (!isOpposingTeam) {
            if (this.currentPhase[0].team === stage.team) {
              prevPicks.push(stage.godSelected)
            }
          }

          // get opposite picks
          if (isOpposingTeam) {
            if (this.currentPhase[0].team !== stage.team) {
              prevPicks.push(stage.godSelected)
            }
          }
        }
      })
      return prevPicks
    },
    roleDiff() {
      const teamRoles = []
      const opposingTeamRoles = []
      this.picks.pickStages.map((stage) => {
        if (this.currentPhase[0].team === stage.team) {
          teamRoles.push(stage.roleSelected?.name)
        } else {
          opposingTeamRoles.push(stage.roleSelected?.name)
        }
      })
      const difference = teamRoles.filter((x) => !opposingTeamRoles.includes(x))
      return difference
    },
    debugRules(message, obj = '') {
      // eslint-disable-next-line no-console
      console.debug(message, obj)
    },
    ruleTierlist() {
      return new Promise((resolve, reject) => {
        this.debugRules('-> ruleTierlist', this.configuration.rankings.tierlist)
        this.configuration.rankings.suggestions = this.configuration.rankings.tierlist
        resolve()
      })
    },
    rulePreserveFirstPick(weigth) {
      if (
        this.configuration.order === 'first' &&
        this.currentPhase[0].type === 'ban'
      ) {
        if (
          (this.currentPhase[0].team === 'order' &&
            this.orderTeam[0].roleSelected?.name) ||
          (this.currentPhase[0].team === 'chaos' &&
            this.chaosTeam[0].roleSelected?.name)
        ) {
          this.debugRules('-> rulePreserveFirstPick')
          const roleFirstPick =
            this.configuration.order === 'first'
              ? this.orderTeam[0].roleSelected?.name
              : this.chaosTeam[0].roleSelected?.name
          _.mapValues(this.configuration.rankings.suggestions, (rank) => {
            return Object.assign(rank, {
              value:
                rank.value - this.gods[rank.id - 1].role[roleFirstPick] * weigth
            })
          })
        }
      }
    },
    ruleRolePick(weigth) {
      if (
        this.currentPhase[0].type === 'pick' &&
        this.currentPhase[0].roleSelected?.name
      ) {
        this.debugRules('-> ruleRolePick')
        const rolePicked = this.currentPhase[0].roleSelected?.name
        _.mapValues(this.configuration.rankings.suggestions, (rank) => {
          return Object.assign(rank, {
            value: rank.value + this.gods[rank.id - 1].role[rolePicked] * weigth
          })
        })
      }
    },
    ruleMatchupPick(weigth) {
      if (
        this.currentPhase[0].type === 'pick' &&
        this.currentPhase[0].sequence > 7
      ) {
        this.debugRules('-> ruleMatchupPick')
        this.logicMatchups(weigth)
      }
    },
    ruleTeammatePick(weigth) {
      if (
        this.currentPhase[0].type === 'pick' &&
        this.currentPhase[0].sequence > 8
      ) {
        this.debugRules('-> ruleTeammatePick')
        const prevPicks = this.prevPicks(false)

        prevPicks.map((prevPick) => {
          this.serviceTeammate(prevPick.id).then((teammate) => {
            _.mapValues(this.configuration.rankings.suggestions, (rank) => {
              return Object.assign(rank, {
                value: rank.value + teammate.teammate[rank.id].value * weigth
              })
            })
          })
        })
      }
    },
    logicPreferencePick(weigth, isPositive = true) {
      this.servicePreference().then((pref) => {
        _.mapValues(this.configuration.rankings.suggestions, (rank) => {
          const operation = isPositive
            ? rank.value + pref[rank.id].value * weigth
            : rank.value - pref[rank.id].value * weigth

          return Object.assign(rank, {
            value: operation
          })
        })
      })
    },
    logicMatchups(weigth, isPositive = true, isOpposingTeam = true) {
      const prevPicks = this.prevPicks(isOpposingTeam)

      prevPicks.map((prevPick) => {
        this.serviceMatchup(prevPick.id).then((matchup) => {
          _.mapValues(this.configuration.rankings.suggestions, (rank) => {
            const operation = isPositive
              ? rank.value + (6 - matchup[rank.id].value) * weigth
              : rank.value - (6 - matchup[rank.id].value) * weigth
            return Object.assign(rank, {
              value: operation
            })
          })
        })
      })
    },
    logicRoleDiffBan() {
      this.debugRules('-> logicRoleDiffBan')
      const rolesDiff = this.roleDiff()
      if (rolesDiff.length > 0) {
        _.mapValues(this.configuration.rankings.suggestions, (rank) => {
          rolesDiff.map((role) => {
            return Object.assign(rank, {
              value: rank.value + this.gods[rank.id - 1].role[role] * 2
            })
          })
        })
      }
    },
    conditionFirstPickBan() {
      let isValid = false
      isValid = !!(
        this.currentPhase[0].type === 'ban' &&
        this.configuration.order === 'first' &&
        this.currentPhase[0].team === 'order' &&
        this.currentPhase[0].sequence <= 6
      )
      return isValid
    },
    conditionFirstPickPlayer() {
      let isValid = false
      isValid = !!this.picks.pickStages[6].playerSelect
      return isValid
    },
    conditionCurrentPlayerPick() {
      let isValid = false
      isValid = !!(
        this.currentPhase[0].type === 'pick' &&
        this.currentPhase[0].playerSelect
      )
      return isValid
    },
    conditionSecondBanPhase() {
      let isValid = false
      isValid = !!(
        this.currentPhase[0].type === 'ban' &&
        this.currentPhase[0].sequence >= 6
      )
      return isValid
    },
    rulePreservePreferencePick(weigth) {
      const conditions = [
        this.conditionFirstPickBan(),
        this.conditionFirstPickPlayer()
      ]
      if (!conditions.includes(false)) {
        this.debugRules('-> rulePreferencePick()')
        this.logicPreferencePick(weigth, false)
      }
    },
    rulePreferencePick(weigth) {
      if (this.conditionCurrentPlayerPick()) {
        this.debugRules('-> rulePreferencePick')
        this.logicPreferencePick(weigth, true)
      }
    },
    ruleSecondBanPhase(weigth) {
      if (this.conditionSecondBanPhase()) {
        this.roleDiff()
        this.logicRoleDiffBan()
        this.logicMatchups(weigth, true, false)
      }
    },
    draft() {
      this.debugRules('----- BEGIN -----')
      this.loadingDraft = true
      this.setTierlist()
      this.ruleTierlist()
        .then(
          this.rulePreservePreferencePick(
            this.configuration.weigths.rulePreferencePick
          )
        )
        .then(
          this.rulePreferencePick(this.configuration.weigths.rulePreferencePick)
        )
        .then(this.ruleRolePick(2.25))
        .then(this.ruleMatchupPick(1.7))
        .then(this.ruleTeammatePick(1))
        .then(this.ruleSecondBanPhase(1.7))
        .then(() => (this.loadingDraft = false))
        .then(this.debugRules('----- END -----'))
    }
  }
}
</script>

<style lang="scss">
.roleAutocomplete {
  margin-top: -29px !important;
}
.userPickSwitch {
  margin-top: -20px !important;
  margin-left: 20px;
}
.draft-control {
  padding: 20px;
  width: 100%;
}
.order,
.chaos {
  border-radius: 10px;

  .bans {
    .current {
      border-width: 5px;
    }
  }
  .current {
    border-width: 11px;
    border-style: outset;
  }
}
.order {
  background: rgb(75, 189, 208);
  background: linear-gradient(
    90deg,
    rgba(75, 189, 208, 1) 0%,
    rgba(18, 80, 177, 1) 100%
  );

  .current {
    border-color: #ffdd2b;
  }

  .bans li {
    background-image: url('../static/draft/blueoverlay.png');
  }
}
.chaos {
  background: rgb(227, 161, 7);
  background: linear-gradient(
    90deg,
    rgba(227, 161, 7, 1) 0%,
    rgba(224, 69, 31, 1) 100%
  );

  .current {
    border-color: #22ce90;
  }

  .bans li {
    background-image: url('../static/draft/redoverlay.png');
  }
}
.bans {
  padding-left: 0 !important;
  display: flex;
  list-style: none;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 0 0 20px 0;
  li {
    width: 18%;
    height: 50px;
    background: #0000007a;
    background-size: cover;
    background-position: center;
  }
}
</style>
