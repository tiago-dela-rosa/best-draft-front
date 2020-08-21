<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <h1 class="text-center">Make the best draft for your team</h1>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn nuxt to="/login" class="mr-2">My preferences</v-btn>
      <v-btn nuxt to="/draft">Start draft</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>
