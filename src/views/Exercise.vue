<template>
<v-container>
      <v-navigation-drawer
        width="20em"
        v-model="drawer"
        :color="color"
        :right="right"
        :src="bg"
        :clipped="clipped"
        dark
        app
      >
        <v-list
          dense
          nav
          class="py-0"
        >
          <v-list-item
            v-for="exercise in getExercisesBySessionId(sessionId)"
            :key="exercise.id"
          >
            <v-list-item-content>
              <v-card
              height="5em">
              <v-card-title>
                <span class="body-2 text-truncate d-inline-block"
                style="width: 15em">
                    {{ exercise.title }} </span>
                <span class="body-2 text-right"
                style="width: auto;"
                v-if="exercise.test_names">
                        {{ exercise.test_names.length }}
                </span>
                <span class="body-2 text-right"
                style="width: auto;"
                v-else>
                        0
                </span>
              </v-card-title>
              <v-card-text>
                {{ exercise.lang }}
              </v-card-text>
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-content
      style="padding: 0px;">
      <v-container fluid>
          <v-card style="padding:15px">
              <v-row>
                  <v-col cols="12" md="6">
                    <h1>{{ exercise.title }}</h1>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h1>Tests</h1>
                  </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field v-html="exercise.instructions" class="body-2"/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <h2>Votre Solution : </h2>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn>
                        <v-icon dark>mdi-play</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-col cols="12" md="12">
                      <div id="editorTest" class="exercise-editor-ace-editor"></div>
                  </v-col>
                </v-col>
                  <v-col cols="12" md="6">
                    <v-list>
                        <v-list-item v-for="test in exercise.test_names" :key="test.id">
                            <v-card
                            height="3em"
                            width="40em"
                            style="background-color: #393939;
                            margin: 5px;
                            padding: 5px">
                                {{ test }}
                            </v-card>
                        </v-list-item>
                    </v-list>
                  </v-col>
              </v-row>
          </v-card>
      </v-container>
  </v-content>
  </v-container>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'
export default {
  name: 'Exercise',
  data: () => ({
    editorTest: null
  }),
  async mounted () {
    await this.fetchModule({ id: this.moduleId })
    await Promise.all(
      this.modules.map(m => this.fetchSessionsForModule({ moduleId: m.id }))
    )
    await Promise.all(
      this.sessions.map(s => this.fetchExercisesForSession({ sessionId: s.id }))
    )
    await this.fetchExerciseForSession({
      sessionId: this.sessionId,
      exerciseId: this.exerciseId
    })
    this.editorTest = ace.edit('editorTest')
    this.editorTest.setTheme('ace/theme/monokai')
    this.editorTest.session.setMode('ace/mode/python')
  },
  computed: {
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('exercises', ['getExercisesBySessionId']),
    ...mapGetters('exercises', ['getExerciseById']),
    ...mapState('exercise', ['exercises']),
    ...mapState('modules', ['modules']),
    module () {
      return this.getModuleById(this.moduleId) ||
        { name: 'Loading..' }
    },
    sessions () {
      return this.getSessionsByModuleId(this.moduleId)
    },
    moduleId () {
      return parseInt(this.$route.params.moduleId)
    },
    sessionId () {
      return parseInt(this.$route.params.sessionId)
    },
    exerciseId () {
      return parseInt(this.$route.params.exerciseId)
    },
    exercise () {
      return this.getExerciseById(this.exerciseId)
    }
  },
  methods: {
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('exercises', ['fetchExercisesForSession']),
    ...mapActions('exercises', ['fetchExerciseForSession'])
  }
}
</script>
<style>
.success-list-item {
    color: #99cc33;
    font-weight: bold;
}
.exercise-editor-ace-editor {
    position: relative;
    height: 20rem;
}
</style>
