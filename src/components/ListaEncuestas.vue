<template>
    <div>
		<b-table responsive  :filter="busqueda" :items="items" :fields="fields" show-empty empty-text="No se han registrado encuestas." :per-page="perPage" :current-page="currentPage" id="tabla-encuestas" empty-filtered-text="No se ha encontradod ninguna encuesta que coincida con su busqueda." @filtered="onFiltered">
			
			<template slot="index" slot-scope="data">
				{{ data.index + 1 }}
			</template>

			<template slot="accion" slot-scope="row">
				<div  class="text-right">
					<b-button @click="row.toggleDetails" variant="secondary" >
						<font-awesome-icon icon="info-circle"  />
					</b-button>
					<b-button variant="primary" style="margin-left: 5px" v-on:click="editarEncuesta(row)">
						<font-awesome-icon icon="edit"  />
					</b-button>
					<b-button variant="danger" v-on:click="eliminarEncuesta(row.index)" style="margin-left: 5px">
						<font-awesome-icon icon="trash-alt"  />
					</b-button>
				</div>
				
			</template>

			<template slot="upload" slot-scope="data">
				<b-badge v-if="data.item.upload == false" variant="success">Local</b-badge>
				<b-badge v-if="data.item.upload == true" variant="primary">Subida</b-badge>
			</template>

			<template slot="row-details" slot-scope="row">
				<b-card>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>Proceso:</b></b-col>
						<b-col>{{ row.item.proceso }}</b-col>
					</b-row>
					<b-row class="mb-2">
						<b-col sm="3" class="text-sm-right"><b>Técnico:</b></b-col>
						<b-col>{{ row.item.tecnico }}</b-col>
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
							label: "Fecha"
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
					}
				], 
				perPage: 10,
				currentPage: 1,
				totalRows: 1,
				busqueda: ''
			}
		},
		methods: {
			obtenerEncuestas(){
				let encuestas = JSON.parse(localStorage.getItem("encuestas"));

				if (!encuestas) {
					encuestas = []
					this.items = []
				}else{
					this.items = encuestas
				}

				this.totalRows = this.items.length
			},
			editarEncuesta(row){

				this.$router.push({ name: 'editar_encuesta', params: {
					row: row
				}})

			},
			eliminarEncuesta(index){

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

						this.$delete(this.items, index)

						localStorage.setItem("encuestas", JSON.stringify(this.items));

						this.$root.$emit('encuestasPendientes');

						Swal.fire(
                            'Excelente!',
                            'La encuesta han sido eliminada exitosamente.',
                            'success'
                        )

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
				this.items = JSON.parse(localStorage.getItem("encuestas"))
			})

			// Buscar en lista de encuestas

			this.$root.$on('buscarEncuesta', (search) => { 
				this.busqueda = search
			})

		},
	}
</script>