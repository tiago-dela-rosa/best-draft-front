<template>
  <div>
    <nuxt />
    <v-container fluid>
      <v-card class="mx-auto" max-width="450" flat>
        <v-card-title>Sign in to start make your own config</v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  ref="email"
                  v-model="email.value"
                  :rules="email.rules"
                  :error-messages="email.error"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password.value"
                  type="password"
                  :rules="password.rules"
                  :error-messages="password.error"
                  label="Password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn @click="signin">Sign-in</v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-btn text>Create Account</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  layout: 'website',
  data: () => ({
    valid: false,
    errors: [],
    email: {
      value: '',
      error: '',
      rules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    },
    password: {
      value: '',
      error: '',
      rules: [
        (v) => !!v || 'Password is required',
        (v) => v.length >= 6 || 'Password must be grather than 6 characters',
        (v) => v.length <= 20 || 'Password cannot be grather than 20 characters'
      ]
    }
  }),
  beforeCreate: () => {
    if (localStorage.getItem('user')) {
      window.location = '/dashboard/home'
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    async validateOnApi() {
      try {
        const data = await this.$axios.$post('/login', {
          email: this.email.value,
          password: this.password.value
        })
        localStorage.setItem('user', JSON.stringify(data))
        window.location = '/dashboard/home'
        return data
      } catch (error) {
        if (error.response.data.error) {
          const errorResponse =
            typeof error.response.data.error === 'string'
              ? JSON.parse(error.response.data.error)
              : error.response.data.error
          if (errorResponse.type === 'email') {
            this.email.error = errorResponse.message
          }
          if (errorResponse.type === 'password') {
            this.password.error = errorResponse.message
          }
        }
        this.resetValidation()
        return error
      }
    },
    async signin() {
      this.validate()
      if (this.valid) {
        await this.validateOnApi()
        // return { ip }
      }
    }
  }
}
</script>
