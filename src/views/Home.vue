<template>
	<b-container class="bv-example-row">
		<b-row class="mb-4">
			<b-col cols="5">
				<b-input-group>
					<b-input-group-text slot="append">
						<font-awesome-icon icon="search" />
					</b-input-group-text>
					<b-form-input v-model="buscar" placeholder="Buscar encuesta"></b-form-input>
				</b-input-group>
			</b-col>
			<b-col cols="7" class="text-right">
				<!-- <b-button v-on:click="subirEncuestas" style="margin-right: 10px" variant="primary" :disabled="encuestas_pendientes <= 0 || uploading"><b-spinner v-if="uploading" small type="grow"></b-spinner> Subir Encuestas 
					<font-awesome-icon icon="cloud-upload-alt" />
				</b-button> -->

				<b-button variant="success" @click="reload"> 
					<font-awesome-icon icon="sync-alt" />
				</b-button>
			</b-col>
			
		</b-row>
		<b-row>
			<b-col>
				<div class="home">
					<ListaEncuestas></ListaEncuestas>
				</div>
			</b-col>
			
		</b-row>
	</b-container>
	
</template>

<script>
	// @ is an alias to /src
	import HelloWorld from '@/components/HelloWorld.vue'
	import ListaEncuestas from '@/components/ListaEncuestas.vue'
	import axios from 'axios'

	export default {
		name: 'home',
		components: {
			ListaEncuestas
		},
		data(){
			return{
				encuestas_pendientes: 0,
				procesos_descargados: false,
				buscar: '',
				uploading: false
			}
		},
		methods: {
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
			reload(){

				this.$root.$emit('actualizarLista');

			}
		}, 
		mounted(){
			let encuestas = JSON.parse(localStorage.getItem("encuestas"))

			if (!encuestas) {
				this.encuestas_pendientes = 0
			}else{
				this.encuestas_pendientes = encuestas.filter(value => !value.upload ).length
			}

			// Validar si ya se  han descargado los procesos y técnicos
			let procesos = JSON.parse(localStorage.getItem("procesos"))
			
			if (procesos) {
				this.procesos_descargados = true
			}

			this.$root.$on('procesosDescargados', () => { // here you need to use the arrow function
				this.procesos_descargados = true
			})

			this.$root.$on('encuestasPendientes', () => { // here you need to use the arrow function
				
				let encuestas = JSON.parse(localStorage.getItem("encuestas"))

				if (!encuestas) {
					this.encuestas_pendientes = 0
				}else{
					this.encuestas_pendientes = encuestas.filter(value => !value.upload ).length
				}

			})
		},
		watch: {
			buscar: function(val){
				this.$root.$emit('buscarEncuesta', val);
			}
		}
		
	}
</script>
