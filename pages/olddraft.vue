<template dark>
  <div id="draft-page">
    <v-row justify="center">
      <v-dialog v-model="configuration.modalState" persistent max-width="290">
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

      <v-dialog v-model="configuration.modalSelection.state" persistent>
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="configuration.modalSelection.godDropdown.selected"
                  placeholder="Choose a god to compare"
                  :disabled="configuration.modalSelection.godDropdown.disabled"
                  :items="configuration.modalSelection.gods"
                  chips
                  filled
                  color="blue-grey lighten-2"
                  label="Select"
                  item-text="name"
                  return-object
                >
                  <template v-slot:selection="data">
                    <v-chip>
                      <v-avatar left size="30">
                        <v-img
                          :src="`/gods/icons/${data.item.slug}.jpg`"
                        ></v-img>
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-item-content
                        v-text="data.item"
                      ></v-list-item-content>
                    </template>
                    <template v-else>
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
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-row>

    <div v-show="configuration.team" id="draft">
      <h1>{{ phase.current }}</h1>

      <ul class="bans order">
        <li v-for="(ban, index) in firstOrderBans" :key="index" class=""></li>
      </ul>

      <ul class="bans chaos">
        <li v-for="(ban, index) in firstChaosBans" :key="index" class=""></li>
      </ul>

      <ul class="picks">
        <li
          v-for="(pick, index) in draft"
          :key="index"
          :class="pick.team"
          @click="selectPick(pick)"
        >
          <img
            v-show="pick.userSelected"
            class="user-selected"
            src="../static/roles/coin.png"
            alt=""
            @click="selectRole(pick)"
          />
          <img class="avatar" :src="godImageSource(pick)" alt="Agni" />
          <span>{{ pick.name }}</span>
          <img class="role" :src="roleImageSource(pick)" alt="mid" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import { orderPicks, orderBans } from '../assets/draft'

export default {
  data: () => ({
    configuration: {
      modalState: true,
      modalSelection: {
        state: false,
        gods: [],
        godDropdown: {
          selected: {},
          disabled: true
        }
      },
      team: ''
    },
    phase: {
      current: 'Ban phase'
    },
    bans: {},
    draft: {
      pick1: {
        team: ''
      }
    }
  }),
  computed: {
    firstOrderBans() {
      return this.handlerOrderBans('order', 1)
    },
    firstChaosBans() {
      return this.handlerOrderBans('chaos', 1)
    },
    lastOrderBans() {
      return this.handlerOrderBans('order', 2)
    },
    lastChaosBans() {
      return this.handlerOrderBans('chaos', 2)
    }
  },
  mounted() {
    // just to test
    // this.modalState = false
    // this.teamOrder('first')
  },
  methods: {
    roleImageSource(pick) {
      return pick.role ? pick.role : '/roles/unknown.png'
    },
    godImageSource(pick) {
      if (pick.role) {
        return pick.role
      } else {
        if (pick.team === 'order') return '/draft/blueoverlay.png'
        if (pick.team === 'chaos') return '/draft/redoverlay.png'
      }
    },
    pickOrderHandler() {
      // const order = orderPicks(this.configuration.team)
      // this.draft = { ...order }
    },
    banOrderHandler() {
      // const order = orderBans(this.configuration.team)
      // this.bans = { ...order }
    },
    teamOrder(order) {
      this.configuration.modalState = false
      this.configuration.team = order
      this.banOrderHandler()
      this.pickOrderHandler()
    },
    selectPick(pick) {
      this.configuration.modalSelection.state = true
    },
    gods() {
      this.$axios.$get('/gods').then((data) => {
        this.gods = Object.values(data)
      })
    },
    handlerOrderBans(team, stage) {
      return Object.values(this.bans).filter((value) => {
        return value.team === team && value.stage === stage
      })
    }
  },
  layout: 'draft'
}
</script>

<style lang="scss">
#draft {
  margin: 20px 0;

  h1 {
    text-align: center;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
  }

  .picks {
    margin: 0 0 20px 0;
    padding: 0;

    li {
      width: 90%;
      padding: 0;
      display: flex;
      margin: inherit;
      flex-direction: row;
      align-items: center;
      position: relative;

      &:nth-child(6n) {
        margin-bottom: 100px;
        &::after {
          position: absolute;
          width: 100%;
          height: 7px;
          background: #727272;
          content: '';
          top: 160%;
          left: 0;
          margin: 0;
          padding: 0;
          border-bottom: 3px solid #494949;
        }
      }
      .user-selected {
        width: 50px;
        position: absolute;
      }

      .role {
        width: 50px;
        float: right;
      }

      &.chaos {
        border: 2px solid #8b0d00;
        background-color: #422b2b;
        border-right: none;
        float: right;
        .user-selected {
          left: -20px;
          top: -20px;
        }
        span {
          margin-left: 20px;
        }
      }

      &.order {
        border: 2px solid #006b8b;
        background-color: #2b2c42;
        border-left: none;
        flex-direction: row-reverse;
        .user-selected {
          right: -20px;
          top: -20px;
        }
        span {
          margin-right: 20px;
          text-align: right;
        }
      }

      span {
        width: 50%;
        font-size: 22px;
        align-self: center;
      }
      .avatar {
        width: 80px;
        background: #111;
      }
    }
  }

  .bans {
    display: flex;
    flex-direction: row;
    list-style: none;
    margin-bottom: 20px;

    &.order {
      li {
        background-image: url('/draft/blueoverlay.png');
        background-color: #000;
        background-size: cover;
        border: 1px solid #006b8b;
      }
    }

    &.chaos {
      flex-direction: row-reverse;
      li {
        background-image: url('/draft/redoverlay.png');
        background-color: #000;
        background-size: cover;
        border: 1px solid #8b0d00;
      }
    }

    li {
      width: 70px;
      height: 70px;
      margin: 5px;
      text-align: center;
    }
    li.current {
      border: 2px solid #ffcd18;
      border-style: outset;
    }
  }
}
</style>
