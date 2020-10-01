<template>
  <v-app dark>
    <v-container fluid>
      <v-row class="ml-6">
        <v-col cols="9">
          <nuxt />
        </v-col>
        <v-col cols="3">
          <v-navigation-drawer dark absolute permanent right color="#071325">
            <template v-slot:prepend>
              <v-list-item two-line>
                <v-list-item-avatar>
                  <img
                    src="https://store.playstation.com/store/api/chihiro/00_09_000/container/BR/pt/999/UP0334-CUSA02328_00-AV00000000000026/1584499523000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{
                    userData.user.name
                  }}</v-list-item-title>
                  <v-list-item-subtitle>Logged In</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item-group v-model="currentItem" color="primary">
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  :to="item.url"
                  @click="changeCurrentItem(item)"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('user')),
      currentItem: 2,
      items: [
        {
          id: 0,
          title: 'Dashboard',
          icon: 'mdi-home-city',
          url: '/dashboard/home'
        },
        {
          id: 1,
          title: 'Tierlist',
          icon: 'mdi-view-list-outline',
          url: '/dashboard/tierlist'
        },
        {
          id: 2,
          title: 'Matchups',
          icon: 'mdi-fencing',
          url: '/dashboard/matchups'
        },
        {
          id: 3,
          title: 'Teammates',
          icon: 'mdi-handshake',
          url: '/dashboard/teammates'
        },
        {
          id: 4,
          title: 'Preferences',
          icon: 'mdi-star-circle',
          url: '/dashboard/preferences'
        },
        {
          id: 5,
          title: 'Draft',
          icon: 'mdi-lightning-bolt',
          url: '/draft'
        },
        {
          id: 6,
          title: 'Logout',
          icon: 'mdi-logout',
          url: '/login'
        }
      ]
    }
  },
  beforeCreate: () => {
    if (!localStorage.getItem('user')) {
      window.location = '/login'
    }
  },
  methods: {
    changeCurrentItem(item) {
      if (item.title === 'Logout') {
        this.logout()
      }
      this.currentItem = item.id
    },
    logout() {
      localStorage.removeItem('user')
    }
  }
}
</script>
