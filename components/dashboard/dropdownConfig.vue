<template>
  <v-select
    v-model="value"
    auto-select-first="true"
    :items="config.options"
    item-text="name"
    label="Choose a config"
    return-object
    @change="openDropdown"
  ></v-select>
</template>

<script>
export default {
  props: {
    configType: {
      type: String,
      required: true
    }
  },
  data: () => ({
    value: { name: 'New Config', value: 1 },
    endpoint: '',
    config: {
      options: []
    }
  }),
  mounted() {
    this.loadConfigs(this.configType)
  },
  methods: {
    loadConfigs(type) {
      switch (this.configType) {
        case 'tierlist':
          this.endpoint = '/tierlist/user'
          break
        case 'matchup':
          this.endpoint = '/matchup/user'
          break
        case 'teammate':
          this.endpoint = '/teammate/user'
          break
      }

      const { user, token } = JSON.parse(localStorage.getItem('user'))
      const header = {
        headers: {
          'x-access-token': token
        }
      }

      this.config.options.push({ name: 'New config', value: 1 })
      return this.$axios
        .$get(`${this.endpoint}/${user.uid}`, header)
        .then((data) => {
          data.data.map((value) => {
            this.config.options.push({ name: value.name, value: value.uid })
          })
        })
    },
    openDropdown(option) {
      this.$emit('change', { value: option.value, name: option.name })
    }
  }
}
</script>
