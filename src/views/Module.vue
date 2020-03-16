<template>
<v-layout column justify-center align-center>
<h1>{{ module.name }}</h1>
    <v-row xs12 sm8 md12 style="max-width: 88rem">
     <v-col v-for="session in sessions" :key="session.id" cols="12">
       <h2>{{ session.name }}</h2>
       <v-row justify="start">
        <v-card
        class="ma-2"
        height="10em"
        width="16em"
        v-for="exercise in getExercisesBySessionId(session.id)"
        :key="exercise.id"
        >
          <v-card-title class="subtitle-2 text-truncate d-inline-block"
          style="max-width: 16em;">{{ exercise.title }}</v-card-title>
          <v-card-text>{{ exercise.lang }}</v-card-text>
          <v-card-text class="d-inline-block"
          style="width: auto;"
          v-if="exercise.test_names">
            {{ exercise.test_names.length }} exercise(s)
          </v-card-text>
          <v-card-text class="d-inline-block"
          style="width: auto;"
          v-else>
            0 exercise
          </v-card-text>
          <v-btn class="ma-1" dark @click="goExercise(moduleId, session.id, exercise.id)">
                <v-icon dark right>mdi-pencil</v-icon>
          </v-btn>
        </v-card>
       </v-row>
      </v-col>
    </v-row>
</v-layout>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Module',
  data: () => ({
  }),
  computed: {
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('exercises', ['getExercisesBySessionId']),
    ...mapState('modules', ['modules']),
    module () {
      return this.getModuleById(this.moduleId) ||
        { name: 'Loading...' }
    },
    moduleId () {
      return parseInt(this.$route.params.id)
    },
    sessions () {
      return this.getSessionsByModuleId(this.moduleId)
    }
  },
  async mounted () {
    await this.fetchModule({ id: this.moduleId })
    await Promise.all(
      this.modules.map(m => this.fetchSessionsForModule({ moduleId: m.id }))
    )
    await Promise.all(
      this.sessions.map(s => this.fetchExercisesForSession({ sessionId: s.id }))
    )
  },
  methods: {
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('exercises', ['fetchExercisesForSession']),
    goExercise (moduleId, sessionId, exerciseId) {
      this.$router.push('/module/' + moduleId + '/session/' + sessionId + '/exercise/' + exerciseId)
    }
  }
}
</script>
