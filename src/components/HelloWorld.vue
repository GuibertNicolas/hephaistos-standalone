<template>
  <v-app>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer />
                <v-tooltip bottom>
                  <span>Source</span>
                </v-tooltip>
                </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="username"
                    label="username"
                    name="username"
                    type="text"
                  />

                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Password"
                    name="password"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"
                @click="login">
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
    data: () => ({
      username: '',
      password: ''
    })
  },
  methods: {
    async login () {
      try {
        await this.axios.post('http://localhost:3000/api/v1/login', {
          username: this.username,
          password: this.password
        }).then(() => {
          try {
            this.$router.push({ name: 'Activities' })
          } catch (errr) {
            console.log(errr)
          }
        })
      } catch (err) {
        this.errorLogin = err
      }
    }
  }
}
</script>
