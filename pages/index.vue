<template dark>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <v-card class="main-card" color="#00AEEF" dark flat>
          <h1 class="text-center">
            <img width="200px" class="logo" src="bestdraft-logo.svg" /> Best
            Draft <span>win before playing</span>
          </h1>
          <v-card-actions>
            <div class="mx-auto">
              <v-btn
                x-large
                nuxt
                block
                color="deep-orange"
                class="mt-5 d-flex"
                to="/draft"
              >
                <v-icon left>mdi-lightning-bolt</v-icon> Start Draft
              </v-btn>
              <v-btn
                x-large
                nuxt
                color="blue-grey darken-4"
                class="mt-5 d-flex"
                to="/login"
              >
                <v-icon left>mdi-account</v-icon>Login
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'website'
}
</script>

<style lang="css">
.main-card {
  padding: 30px;
  opacity: 0.9;
}

.logo {
  width: 200px;
  margin-right: -100px;
  margin-bottom: -20px;
}

h1 {
  color: #fff;
}

h1 span {
  font-size: 18px;
}

@media only screen and (max-width: 600px) {
  h1 span {
    display: none;
  }
}
</style>
