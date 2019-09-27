<template>
    <div>
		<b-table responsive  :filter="busqueda" :items="items" :fields="fields" show-empty empty-text="No se han registrado encuestas." :per-page="perPage" :current-page="currentPage" id="tabla-encuestas" empty-filtered-text="No se ha encontrado ninguna encuesta que coincida con su busqueda." @filtered="onFiltered">
			
			<template slot="index" slot-scope="data">
				{{ data.item.ID }}
			</template>

			<template slot="accion" slot-scope="row">
				<div  class="text-right">
					<b-button @click="row.toggleDetails" variant="secondary" >
						<font-awesome-icon icon="info-circle"  />
					</b-button>
					<b-button variant="primary" style="margin-left: 5px" :to="{ name: 'editar_encuesta', params: {id: row.item.ID}}">
						<font-awesome-icon icon="edit"  />
					</b-button>
					<b-button variant="danger" v-on:click="eliminarEncuesta(row.item.ID)" style="margin-left: 5px">
						<font-awesome-icon icon="trash-alt"  />
					</b-button>
				</div>
				
			</template>

			<template slot="upload">
				<b-badge variant="primary">Subida</b-badge>
			</template>

			<template slot="row-details" slot-scope="row">
				<b-card>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>Proceso:</b></b-col>
						<b-col>{{ row.item.PROCESO }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>Técnico:</b></b-col>
						<b-col>{{ row.item.TECNICO }}</b-col>
					</b-row>

					<!-- <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button> -->
				</b-card>
			</template>

		</b-table>

		<div class="mt-3" v-if="totalRows > perPage">
			<b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="tabla-encuestas" align="center"></b-pagination>
		</div>
	</div>
</template>

<script>

	import axios from 'axios'

	export default {
		data(){
			return {
				items: [],
				fields: [
					{
						index: {
							label: "No."
						}
					},
					{
						fecha: {
							label: "Fecha",
							key: 'FECHA'
						}
					},
					{
						upload: {
							label: "Estado",
							sortable: true
						}
					},
					{
						accion: {
							label: "Acción",
							class: "text-right"
						}
					},
				], 
				perPage: 10,
				currentPage: 1,
				totalRows: 1,
				busqueda: '',
			}
		},
		methods: {
			obtenerEncuestas(){
				// let encuestas = JSON.parse(localStorage.getItem("encuestas"));

				// if (!encuestas) {
				// 	encuestas = []
				// 	this.items = []
				// }else{
				// 	this.items = encuestas
				// }

				// this.totalRows = this.items.length

				let data = {
                    "name": "listaEncuestas",
                    "param": {}
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
				   this.items = response.data.response.result
                    
                })
                .catch(error => {
					
					console.log(error)

                    this.loading = false
                    
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: 'Existe un problema con su conexión a internet!',
                    })

				});
			},
			editarEncuesta(row){

				this.$router.push({ name: 'editar_encuesta', params: {
					row: row
				}})

			},
			eliminarEncuesta(id){

				Swal.fire({
                    title: '¿Está seguro?',
                    text: "Una vez eliminada no se podrán recuperar!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {

					if (result.value) {

						console.log(id)

						let data = {
							name: 'eliminarEncuesta',
							param: {
								id_encuesta: id
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
								'La encuesta ha sigo eliminada exitosamente!',
								'success'
							)

							this.obtenerEncuestas()

							console.log(response.data)

						})

					}

				})
			},
			onFiltered(filteredItems) {
				this.totalRows = filteredItems.length
				this.currentPage = 1
			}
		},
		mounted(){
			this.obtenerEncuestas()

			this.$root.$on('eliminarLista', () => { 
				this.items = JSON.parse(localStorage.getItem("encuestas"))
				this.totalRows = this.items.length
			})

			this.$root.$on('actualizarLista', () => { 
				// this.items = JSON.parse(localStorage.getItem("encuestas"))
				this.obtenerEncuestas()
			})

			// Buscar en lista de encuestas

			this.$root.$on('buscarEncuesta', (search) => { 
				this.busqueda = search
			})

		},
	}
</script>