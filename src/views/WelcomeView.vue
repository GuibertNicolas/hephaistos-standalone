<template>
    <v-app-bar>
    </v-app-bar>
</template>
<script>
import { mapState, mapActions } from 'vuex' // add mapGetters after mapActions
// import ModuleCard from '../components/'
export default {
  data: () => ({

  }),
  computed: {
    ...mapState('modules', ['modules']),
    ...mapState('sessions', ['sessions']),
    ...mapState('exercises', ['exercises']),
    ...mapState('sessions', ['getSessionsByModuleId']),
    ...mapState('exercises', ['getExercisesBySessionId'])
  },
  async mounted () {
    await this.fetchModules()
    await Promise.all(
      this.modules.map(m => this.fetchSessionsforModule({ moduleId: m.id }))
    )
    await Promise.all(
      this.sessions.map(s => this.fetchExercisesForSession({ sessionId: s.id }))
    )
  },
  methods: {
    ...mapActions('modules', ['fetchModules']),
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('exercises', ['fetchExercisesForSession']),
    getFirstExerciseIdOfSession (sessId) {
      const exos = this.getExercisesBySessionId(sessId)
      if (exos.length) {
        return exos[0].id
      }
    }
  }
}
</script>
