<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="#">Encuestas DCAI</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                
                <b-navbar-nav class="ml-auto">
                    <b-nav-item href="#" v-on:click="mostrarConfig" right>
                        <font-awesome-icon icon="cog" size="lg" />
                    </b-nav-item>
                </b-navbar-nav>

            </b-collapse>
        </b-navbar>

        <b-modal ref="my-modal" title="Configuración" hide-footer title-class="font-weight-bold">
            
            <div>
                <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    label="Procesos y técnicos"
                    label-for="input-horizontal"
                >
                    <div class="text-right">
                        <b-button v-on:click="obtenerProcesos" :disabled="loading" variant="primary"><b-spinner v-if="loading" small type="grow"></b-spinner> Actualizar 
                            <font-awesome-icon icon="cloud-download-alt"  />
                        </b-button>
                    </div>
                    
                </b-form-group>

                <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    label="Subir encuestas a base de datos"
                    label-for="input-horizontal"
                >
                    <div class="text-right">
                        <b-button v-on:click="subirEncuestas" variant="primary" :disabled="encuestas_pendientes <= 0 || uploading"><b-spinner v-if="uploading"  small type="grow"></b-spinner> Subir  
                            <font-awesome-icon icon="cloud-upload-alt" />
                        </b-button>
                    </div>
                    
                </b-form-group>

                <b-form-group
                    label-cols-sm="6"
                    label-cols-lg="6"
                    label="Encuestas subidas"
                    label-for="input-horizontal"
                >
                    <div class="text-right">
                        <b-button v-on:click="eliminarEncuestas" :disabled="removing || encuestas_subidas <= 0" variant="danger"><b-spinner v-if="removing" small type="grow"></b-spinner> Eliminar 
                            <font-awesome-icon icon="trash-alt"  />
                        </b-button>
                    </div>
                    
                </b-form-group>

                

            </div>

        </b-modal>

    </div>
    
</template>

<script>

    import axios from 'axios'

    export default {
        data() {
            return {
                loading: false,
                removing: false,
                encuestas_subidas: null,
                uploading: false,
                encuestas_pendientes: null
            } 
        },
        methods: {
            mostrarConfig(){

                // Validar si existen encuestas pendientes de subir
                let encuestas = JSON.parse(localStorage.getItem("encuestas"))

                if (!encuestas) {
                    this.encuestas_subidas = 0
                }else{
                    this.encuestas_subidas = encuestas.filter(value => value.upload ).length
                }

                if (!encuestas) {
                    this.encuestas_pendientes = 0
                }else{
                    this.encuestas_pendientes = encuestas.filter(value => !value.upload ).length
                }

                this.$refs['my-modal'].show()
                
            },
            obtenerProcesos(){

                this.loading = true

                let data = {
                    "name": "obtenerProcesos",
                    "param": {}
                }

                axios({
					method: 'POST',
                    url: 'https://udicat.muniguate.com/apps/api_encuestas/',
                    headers: {
                        'Content-Type': 'application/json'
					},
					data: data
                })
                .then(data => {
                    
                    let response = data.data.response.result

                    localStorage.setItem("procesos", JSON.stringify(response));

                    Swal.fire(
                        'Excelente!',
                        'Los procesos y técnicos han sido actualizados!',
                        'success'
                    )

                    this.loading = false

                    this.$root.$emit('procesosDescargados');
                    
                })
                .catch(error => {
                    
                    this.loading = false
                    
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: 'Existe un problema con su conexión a internet!',
                    })

				});
                
            },
            eliminarEncuestas(){

                this.removing = true

                Swal.fire({
                    title: '¿Está seguro?',
                    text: "Una vez eliminadas no se podrán recuperar!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {

                    if (result.value) {
                        
                        let encuestas = JSON.parse(localStorage.getItem("encuestas"))

                        let encuestas_pendientes = encuestas.filter(value => !value.upload)

                        // Colocar unicamente las pendientes
                        localStorage.setItem("encuestas", JSON.stringify(encuestas_pendientes));

                        this.removing = false

                        this.$root.$emit('eliminarLista');

                        Swal.fire(
                            'Excelente!',
                            'Las encuestas han sido eliminadas exitosamente.',
                            'success'
                        ).then((result) => {
                    
                            this.$refs['my-modal'].hide()

                        })
                            
                    }else{

                        this.removing = false

                    }

                })

            },
            subirEncuestas(){

				Swal.fire({
                    title: '¿Está seguro?',
                    text: "Las encuestas serán subidas a la base de datos",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, subir!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {

                    if (result.value) {
						
						this.uploading = true

						let encuestas = JSON.parse(localStorage.getItem("encuestas"))

                        console.log(encuestas)

						let data = {
							"name": "subirEncuestas",
							"param": {
								"encuestas" : encuestas
							}
						}
						
						axios({

							method: 'POST',
							url: 'https://udicat.muniguate.com/apps/api_encuestas/',
							headers: {
								'Content-Type': 'application/json'
							},
							data: data

						})
						.then(data => {
							
							this.uploading = false

							localStorage.setItem("encuestas", JSON.stringify(data.data.response.result));
							this.$root.$emit('actualizarLista');

							let encuestas = JSON.parse(localStorage.getItem("encuestas"))
							this.encuestas_pendientes = encuestas.filter(value => !value.upload ).length

							Swal.fire(
								'Excelente!',
								'Las encuestas han sido subidas exitosamente!',
								'success'
							)
					
						})
						.catch(error => {
                            
							this.uploading = false

							Swal.fire({
								type: 'error',
								title: 'Error',
								text: 'Existe un problema con su conexión a internet!',
							})

						});

                    }

				})
				

			},
        }, 
    }
</script>