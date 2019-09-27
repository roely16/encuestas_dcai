<template>

    <b-card bg-variant="light" :header="no_encuestas" header-class="font-weight-bold" v-if="!isLoading">

        <b-row>
            <b-col>
                <b-form-group label="No." label-class="font-weight-bold">
                    {{ encuesta.ID}}
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Fecha" label-class="font-weight-bold">
                    {{ encuesta.FECHA_CREACION}}
                </b-form-group> 
            </b-col>
        </b-row>

        <b-form @submit.prevent="registrarEncuesta">

            <!-- Creación de preguntas -->

            <b-row>
                <b-col>
                    <b-form-group
                        id="input-group-1"
                        label="Proceso"
                        label-for="input-1"
                        label-class="font-weight-bold"
                    >
                        <multiselect @select="seleccionarProceso" v-model="proceso" :options="procesos" :value="proceso" label="text" selectLabel="" placeholder="--Seleccione un proceso--" deselectLabel="Eliminar" track-by="text" selectedLabel="Seleccionado" :disabled="!isEditing"></multiselect>
                    </b-form-group>
                </b-col>
                
            </b-row>

            <b-row>
                <b-col>
                    <b-form-group
                        id="input-group-1"
                        label="Técnico"
                        label-for="input-1"
                        label-class="font-weight-bold"
                    >
                       <multiselect v-model="tecnico" :value="tecnico" :options="tecnicos" label="text" selectLabel="" placeholder="--Seleccione un técnico--" track-by="text" selectedLabel="Seleccionado" deselectLabel="" :disabled="tecnicos.length <= 0 || !isEditing"  required></multiselect>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row v-for="(pregunta, index) in preguntas" class="mb-4" :key="index">
                <b-col>
                    <b-form-group label-class="font-weight-bold" :label="pregunta.text">
                        
                        <b-form-radio-group
                            v-model="respuestas[(index)].RESPUESTA"
                            :options="options"
                            size="lg"
                            required
                            :name="`pregunta${index}`"
                            v-if="pregunta.type == 'option'"
                            :disabled="!isEditing"
                        ></b-form-radio-group>

                        <b-form-textarea
                            rows="4"
                            max-rows="6"
                            v-if="pregunta.type == 'text-area'"
                            v-model="respuestas[(index)].RESPUESTA"
                            :disabled="!isEditing"
                        ></b-form-textarea>

                    </b-form-group>
                </b-col>
            </b-row>

            <b-row class="text-center">
                <b-col>

                    <b-button v-on:click="cancelarEncuesta" variant="danger" size="lg">Cancelar 
                        <font-awesome-icon icon="times-circle" />
                    </b-button>
                    <b-button v-if="isEditing" @click="editarEncuesta" variant="success" style="margin-left: 10px" size="lg">Guardar 
                        <font-awesome-icon icon="save" />
                    </b-button>

                    <b-button v-if="!isEditing" variant="primary" style="margin-left: 10px" size="lg" v-on:click="editarEncuesta">Editar 
                        <font-awesome-icon icon="edit" />
                    </b-button>
                </b-col>
            </b-row>

        </b-form>
    </b-card>

</template>

<script>

    import axios from 'axios'

    export default {
        data() {
            return {
                proceso: 3,
                tecnico: null,
                options: [
                    { text: '1', value: '1' },
                    { text: '2', value: '2' },
                    { text: '3', value: '3' },
                    { text: '4', value: '4' },
                    { text: '5', value: '5' },
                    { text: '6', value: '6' },
                    { text: '7', value: '7' },
                    { text: '8', value: '8' },
                    { text: '9', value: '9' },
                    { text: '10', value: '10' }
                ],
                preguntas: [
                    {
                        "text": "1. ¿El técnico le recibió su solicitud con educación, amabilidad y esmero",
                        "type": "option"
                    },
                    {
                        "text": "2. ¿El Técnico que recibió su solicitud le dio información y requisitos claros?",
                        "type": "option"
                    },
                    {
                        "text": "3. ¿Obtuvo el servicio o producto solicitado rapidamente?",
                        "type": "option"
                    },
                    {
                        "text": "4. ¿Cómo califica el servicio brindado?",
                        "type": "option"
                    },
                    {
                        "text": "5. Desea ampliar su opinión o añadir alguna queja o sugerencia:",
                        "type": "text-area"
                    }
                ],
                // respuestas: {},
                respuestas: [],
                procesos: [],
                tecnicos: [],
                no_encuestas: '',
                isEditing: false,
                procesoSelecionado: [],
                encuesta: {},
                isLoading: false
            } 
        },
        props: {
            mode: String,
            data: Object
        },
        methods: {
            registrarEncuesta(){

                this.isEditing = false
            
            },
            seleccionarProceso(item){
                
                let data = {
                    name: 'tecnicosProceso',
                    param: {
                        id_proceso: item.value
                    }
                }

                axios({
                    method: 'POST',
                    url: process.env.VUE_APP_API_URL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                })
                .then(response => {
                    
                    console.log(response.data)
                    this.tecnico = null
                    this.tecnicos = response.data.response.result
                    
                })

                console.log(data)
            },
            cancelarEncuesta(){
                this.$router.push({ name: 'home'})
            },
            editarEncuesta(){

                this.isEditing = !this.isEditing

                if(!this.isEditing){
                    
                    let data = {

                        name: 'editarEncuesta',
                        param: {
                            encuesta: this.encuesta, 
                            respuestas: this.respuestas,
                            proceso: this.proceso, 
                            tecnico: this.tecnico
                        }

                    }

                    axios({
                        method: 'POST',
                        url: process.env.VUE_APP_API_URL,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data
                    })
                    .then(response => {

                        Swal.fire(
                            'Excelente!',
                            'La encuesta ha sigo editada exitosamente!',
                            'success'
                        )
                        console.log(response.data)

                    })

                }

            }
            
        },
        mounted(){

            this.isLoading = !this.isLoading

            let data = {
                name: "detallesEncuesta",
                param: {
                    id_encuesta: this.$route.params.id
                }
            }

            axios({
                method: 'POST',
                url: process.env.VUE_APP_API_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
            .then(response => {
                
                this.procesos = response.data.response.result.procesos
                this.encuesta = response.data.response.result.encuesta
                this.respuestas = response.data.response.result.respuestas

                this.tecnico = {
                    text: this.encuesta.TECNICO,
                    value: this.encuesta.ID_TECNICO
                }
                
                // this.encuesta.ID_TECNICO
                this.proceso = {
                    text: this.encuesta.PROCESO,
                    value: this.encuesta.ID_PROCESO
                }

                // Realizar la peticion de los tecnicos
                let data = {
                    name: 'tecnicosProceso',
                    param: {
                        id_proceso: this.encuesta.ID_PROCESO
                    }
                }

                axios({
                    method: 'POST',
                    url: process.env.VUE_APP_API_URL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                })
                .then(response => {
                    
                    this.tecnicos = response.data.response.result
                    
                })
            })

            this.mounted = true
            this.isLoading = !this.isLoading
        
            
        }
    }
</script>