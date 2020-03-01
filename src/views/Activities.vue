<template>
    <v-app>
        <v-container fluid>
            <v-row>
                <v-col class="d-flex" cols="12" sm="2">
                    <v-select
                    v-on:change="changeText"
                    :items="items"
                    @change="changedLabel"
                    label="Langage"
                    solo
                    ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                            v-model="title"
                            label="title"
                            name="title"
                            type="text"
                    />
                </v-col>
                <v-btn color="primary"
                    @click="save">
                        Save
                </v-btn>
                <v-btn color="primary"
                    @click="runSandBox">
                        run sandbox code
                </v-btn>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <div class="headline">Consignes : </div>
                    <v-textarea
                    solo
                    v-model="consigne"
                    name="consigne"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="headline">Tests : </div>
                    <div id="editorTest" class="exercise-editor-ace-editor"></div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="headline">SandBox : </div>
                    <div id="editorSandbox" class="exercise-editor-ace-editor"></div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="headline">Resultats des tests : </div>
                    <v-list-item id="resultats" v-for="(item) in resultatsTest" :key="item.id">
                        <div v-if="item.failure !== undefinded">
                            <v-list-item-content class="fail-list-item">
                                {{item.failure.message}}
                                <p>{{item.file}} - {{item.name}} - {{item.time}}s</p>
                            </v-list-item-content>
                        </div>
                        <div v-else>
                            <v-list-item-content class="success-list-item">
                                <p>{{item.file}} - {{item.name}} - {{item.time}}s</p>
                            </v-list-item-content>
                        </div>
                    </v-list-item>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>
<style>
.fail-list-item {
    color : #cc3300;
    font-weight: bold;
}

.success-list-item {
    color: #99cc33;
    font-weight: bold;
}
.exercise-editor-ace-editor {
    position: relative;
    height: 20rem;
}
</style>

<script>
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'
export default {
  data: () => ({
    items: ['python', 'c'],
    editorTest: null,
    editorSandbox: null,
    lang: '',
    resultatsTest: [],
    solution: '',
    tests: '',
    title: '',
    consigne: ''
  }),
  mounted () {
    this.editorTest = ace.edit('editorTest')
    this.editorTest.setTheme('ace/theme/monokai')
    this.editorSandbox = ace.edit('editorSandbox')
    this.editorSandbox.setTheme('ace/theme/monokai')
  },
  methods: {
    changedLabel (label) {
      this.lang = label
      this.editorTest.session.setMode(`ace/mode/${label}`)
      this.editorSandbox.session.setMode(`ace/mode/${label}`)
    },
    async runSandBox () {
      this.resultatsTest.splice(0, this.resultatsTest.length)
      this.tests = this.editorTest.getValue()
      this.solution = this.editorSandbox.getValue()
      try {
        const response = await this.axios.post('http://localhost:3000/api/v1/exercise/sandbox', {
          lang: this.lang,
          tests: this.tests,
          solution: this.solution
        })
        this.resultatsTest.push(...response.data.result.tests)
      } catch (err) {
        console.log(err)
      }
    },
    async save () {
      try {
        const response = await this.axios.post('http://localhost:3000/api/v1/exercise', {
          instructions: this.consigne,
          lang: this.lang,
          title: this.title,
          tests: this.editorTest.getValue(),
          solution: this.editorSandbox.getValue(),
          template_regions: {},
          template_regions_rw: {},
          difficulty: 0,
          score: 0,
          creation_date: new Date()
        })
        alert('Création de l\'exercice n°' + response.data.id + ' : ' + response.data.title)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
