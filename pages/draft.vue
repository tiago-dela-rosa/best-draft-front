<template dark>
  <v-container fluid>
    <v-dialog v-model="configuration.orderPickModal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Lets Draft!
        </v-card-title>
        <v-card-text>
          <br />To help the system make the right choice select what team goes
          first and select the position and role you gonna play in this draft
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

    <v-row v-if="configuration.order">
      <!-- order -->
      <v-col class="order" cols="4">
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
          max-width="400"
        >
          <v-autocomplete
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
                  <v-list-item-title
                    v-html="data.item.name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="data.item.group"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
          <v-autocomplete
            v-model="picks.pickStages[pick.id - 1].roleSelected"
            class="roleAutocomplete"
            placeholder="Role"
            :items="picks.roles"
            filled
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            return-object
          >
          </v-autocomplete>
          <v-switch
            v-model="picks.pickStages[pick.id - 1].playerSelect"
            class="userPickSwitch"
            label="Play this pick"
          ></v-switch>
        </v-card>
      </v-col>

      <!-- controller -->
      <v-col cols="4">
        <div class="draft-control">
          <v-card>
            <v-card-title>
              {{ currentPhase[0].type }} phase
              {{ currentPhase[0].sequence }}</v-card-title
            >
            <v-autocomplete
              v-model="picks.pickStages[currentPhase[0].id - 1].godSelected"
              placeholder="Select"
              :disabled="currentPhase[0].type != 'ban'"
              :items="gods"
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
                    <v-list-item-title
                      v-html="data.item.name"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="data.item.group"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </v-card>
          <v-row>
            <v-col cols="6">
              <v-btn
                width="100%"
                color="grey"
                :dark="picks.current.order >= 1"
                :disabled="picks.current.order < 1"
                @click="picks.current.order--"
              >
                <v-icon left>mdi-page-previous</v-icon> Prev</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn width="100%" dark color="teal" @click="next()">
                <v-icon left>mdi-page-next</v-icon> Next</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-btn width="100%" dark color="deep-orange" @click="draft()">
                <v-icon left>mdi-alert-octagram</v-icon> Draft
              </v-btn>
              <v-card class="mt-5">
                <v-card-title>Suggestions</v-card-title>
                <v-list id="suggestions" flat>
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
                          <big>{{ suggestion.value }}</big>
                        </v-list-item-icon>
                      </v-list-item>
                    </v-list-item-group>
                  </div>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- chaos -->
      <v-col class="chaos" cols="4">
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
          max-width="400"
        >
          <v-autocomplete
            v-model="picks.pickStages[pick.id - 1].godSelected"
            placeholder="Select a god"
            :disabled="
              picks.pickStages[pick.id - 1].sequence > picks.current.order
            "
            :items="gods"
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
                  <v-list-item-title
                    v-html="data.item.name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="data.item.group"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
          <v-autocomplete
            v-model="picks.pickStages[pick.id - 1].roleSelected"
            class="roleAutocomplete"
            placeholder="Role"
            :items="picks.roles"
            filled
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            return-object
          >
          </v-autocomplete>
          <v-switch class="userPickSwitch" label="Play this pick"></v-switch>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'lodash'
import { stages } from '../assets/draft'

export default {
  data: () => ({
    gods: [],
    configuration: {
      orderPickModal: true,
      order: '',
      endpoints: {
        tierlist: '/tierlist/e1b16694-805f-4919-a80d-a09b50afd81a'
      },
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
      roles: ['support', 'carry', 'mid', 'jungle', 'solo'],
      pickStages: ''
    }
  }),
  computed: {
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

      return _.orderBy(diff, ['value'], ['desc']).filter((value, index) => {
        return index <= 9
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
    this.getGods()
    this.setTierlist()
  },
  methods: {
    getGods() {
      return this.$axios.$get('/gods').then((data) => {
        this.gods = Object.values(data)
      })
    },
    teamOrder(order) {
      this.configuration.order = order
      this.configuration.orderPickModal = false
      if (order === 'first') {
        this.picks.pickStages = stages('first')
      } else {
        this.picks.pickStages = stages('second')
      }
    },
    handleToken() {
      const { token } = JSON.parse(localStorage.getItem('user'))
      return {
        headers: {
          'x-access-token': token
        }
      }
    },
    next() {
      this.picks.current.order++
      this.configuration.rankings.suggestions = []
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
        .$get(
          '/tierlist/e1b16694-805f-4919-a80d-a09b50afd81a',
          this.handleToken()
        )
        .then((response) => {
          this.configuration.rankings.tierlist = response.data[0].data
        })
    },
    serviceMatchup(id) {
      return this.$axios
        .$get(
          `http://localhost:8888/api/v1/matchup/78a9ee1d-6ce5-4a43-9a82-a190daccac4a?god=${id}`,
          this.handleToken()
        )
        .then((response) => {
          return response.data.data.against
        })
    },
    serviceTeammate(id) {
      return this.$axios
        .$get(
          `http://localhost:8888/api/v1/teammate/b161afd9-7b65-439f-8af2-8761cd2495e7?god=${id}`,
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
          teamRoles.push(stage.roleSelected)
        } else {
          opposingTeamRoles.push(stage.roleSelected)
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
            this.orderTeam[0].roleSelected) ||
          (this.currentPhase[0].team === 'chaos' &&
            this.chaosTeam[0].roleSelected)
        ) {
          this.debugRules('-> rulePreserveFirstPick')
          const roleFirstPick =
            this.configuration.order === 'first'
              ? this.orderTeam[0].roleSelected
              : this.chaosTeam[0].roleSelected
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
        this.currentPhase[0].roleSelected
      ) {
        this.debugRules('-> ruleRolePick')
        const rolePicked = this.currentPhase[0].roleSelected
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
            console.log(teammate)
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
              value: rank.value + this.gods[rank.id - 1].role[role] * 1.5
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
        .then(this.ruleRolePick(1.75))
        .then(this.ruleMatchupPick(1.2))
        .then(this.ruleTeammatePick(0.5))
        .then(this.ruleSecondBanPhase(1.2))
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
#suggestions {
  overflow-y: scroll;
  height: 600px;
}
</style>
