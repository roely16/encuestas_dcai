<template>

    <b-card bg-variant="light" :header="no_encuestas" header-class="font-weight-bold">
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
                       <!-- <b-form-select v-model="proceso" :options="procesos" v-on:change="seleccionarProceso" required :disabled="uploaded">
                           <template slot="first">
                                <option :value="null" disabled>-- Seleccione un proceso --</option>
                            </template>
                       </b-form-select> -->

                        <multiselect v-if="mounted" @select="seleccionarProceso" v-model="procesoSelecionado" :options="procesos" :value="procesoSelecionado" label="text" selectLabel="" placeholder="--Seleccione un proceso--" deselectLabel="Eliminar" track-by="text" selectedLabel="Seleccionado" :disabled="uploaded"></multiselect>
                       
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
                       <!-- <b-form-select v-model="tecnico" :options="tecnicos" :disabled="tecnicos.length <= 0 || uploaded" required>
                           <template slot="first">
                                <option :value="null" disabled>-- Seleccione un técnico --</option>
                            </template>
                       </b-form-select> -->

                       <multiselect v-model="tecnico" :options="tecnicos" label="text" selectLabel="" placeholder="--Seleccione un técnico--" track-by="text" selectedLabel="Seleccionado" deselectLabel="" :disabled="tecnicos.length <= 0 || uploaded"  required></multiselect>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row v-for="(pregunta, index) in preguntas" class="mb-4" :key="index">
                <b-col>
                    <b-form-group label-class="font-weight-bold" :label="pregunta.text">
                        
                        <b-form-radio-group
                            v-model="respuestas['pregunta' + (index + 1)]"
                            :options="options"
                            size="lg"
                            required
                            :name="`pregunta${index}`"
                            v-if="pregunta.type == 'option'"
                            :disabled="uploaded"
                        ></b-form-radio-group>

                        <b-form-textarea
                            rows="4"
                            max-rows="6"
                            v-if="pregunta.type == 'text-area'"
                            v-model="respuestas['pregunta' + (index + 1)]"
                            :disabled="uploaded"
                        ></b-form-textarea>

                    </b-form-group>
                </b-col>
            </b-row>

            <b-row class="text-center">
                <b-col>
                    <b-button v-on:click="cancelarEncuesta" variant="danger" size="lg">Cancelar 
                        <font-awesome-icon icon="times-circle" />
                    </b-button>
                    <b-button v-if="mode != 'edit'" type="submit" variant="success" style="margin-left: 10px" size="lg">Guardar 
                        <font-awesome-icon icon="save" />
                    </b-button>

                    <b-button v-if="mode == 'edit'" variant="success" style="margin-left: 10px" size="lg" :disabled="uploaded" v-on:click="editarEncuesta">Editar 
                        <font-awesome-icon icon="save" />
                    </b-button>
                </b-col>
            </b-row>

        </b-form>
    </b-card>

</template>

<script>

    export default {
        data() {
            return {
                proceso: [],
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
                respuestas: {
                },
                procesos: [],
                tecnicos: [],
                no_encuestas: '',
                uploaded: false,
                procesoSelecionado: [],
                mounted: false
            } 
        },
        props: {
            mode: String,
            data: Object
        },
        methods: {
            registrarEncuesta(){

                // Obtener la fecha y hora
                let fecha = moment().format('DD/MM/YYYY HH:mm:ss')

                let nueva_encuesta = {
                    respuestas: this.respuestas,
                    fecha: fecha,
                    upload: false,
                    id_proceso: this.proceso.value.value,
                    proceso: this.proceso.text,
                    id_tecnico: this.tecnico.NIT,
                    tecnico: this.tecnico.text,
                    proceso_obj: this.proceso,
                    tecnico_obj: this.tecnico
                }

                let encuestas = JSON.parse(localStorage.getItem("encuestas"));

                if (!encuestas) {
                    encuestas = []
                }

                encuestas.push(nueva_encuesta)

                localStorage.setItem("encuestas", JSON.stringify(encuestas));

                Swal.fire(
                    'Excelente!',
                    'La encuesta ha sigo registrada exitosamente!',
                    'success'
                ).then((result) => {
                    this.$router.push({ name: 'home'})
                })

            },
            seleccionarProceso(item){
                this.proceso = item
                this.tecnico = null
                this.tecnicos = item.value.TECNICOS
            },
            cancelarEncuesta(){
                this.$router.push({ name: 'home'})
            },
            editarEncuesta(){

                let fecha = moment().format('DD/MM/YYYY HH:mm:ss')

                let encuesta_editada = {
                    respuestas: this.respuestas,
                    fecha: fecha,
                    upload: false,
                    id_proceso: this.proceso.value.value,
                    proceso: this.proceso.text,
                    id_tecnico: this.tecnico.NIT,
                    tecnico: this.tecnico.text,
                    proceso_obj: this.proceso,
                    tecnico_obj: this.tecnico
                }

                console.log(encuesta_editada)

                let encuestas = JSON.parse(localStorage.getItem("encuestas"));

                this.$set(encuestas, this.data.index, encuesta_editada)

                localStorage.setItem("encuestas", JSON.stringify(encuestas));

                Swal.fire(
                    'Excelente!',
                    'La encuesta ha sigo editada exitosamente!',
                    'success'
                ).then((result) => {
                    this.$router.push({ name: 'home'})
                })

            },
            inputOption(value){
                console.log(value)
            }
        },
        mounted(){

            this.procesos = JSON.parse(localStorage.getItem("procesos"));

            console.log(this.procesos)

            if(this.mode == 'edit'){

                this.no_encuestas = "Encuesta No. " + (this.data.index + 1)
                this.respuestas = this.data.item.respuestas

                this.procesoSelecionado = this.data.item.proceso_obj
                this.proceso = this.data.item.proceso_obj

                console.log(this.procesoSelecionado)

                this.tecnicos = this.procesoSelecionado.value.TECNICOS
                this.tecnico = this.data.item.tecnico_obj
                this.uploaded = this.data.item.upload

            }else{

                let encuestas = JSON.parse(localStorage.getItem("encuestas"));

                if (!encuestas) {
                    this.no_encuestas = "Encuesta No. 1"
                }else{
                    this.no_encuestas = "Encuesta No. " +  (encuestas.length + 1)
                }

            }

            this.mounted = true
            
        }
    }
</script>