<template>
  <v-autocomplete
    v-model="model"
    placeholder="Choose a god to compare"
    :disabled="disable"
    :items="godList"
    chips
    filled
    color="blue-grey lighten-2"
    label="Select"
    item-text="name"
    return-object
  >
    <!-- <template v-slot:selection="gods">
      <v-chip>
        <v-avatar left size="30">
          <v-img :src="`/gods/icons/${gods.slug}.jpg`"></v-img>
        </v-avatar>
        {{ gods }}
      </v-chip>
    </template>
    <template v-slot:item="gods">
      <template v-if="typeof gods !== 'object'">
        <v-list-item-content v-text="gods"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img :src="`/gods/icons/${gods.slug}.jpg`" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="gods.name"></v-list-item-title>
          <v-list-item-subtitle v-html="gods.group"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template> -->
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    disable: {
      type: Boolean,
      default: false
    },
    godList: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  data: () => ({}),
  mounted() {},
  methods: {}
}
</script>
