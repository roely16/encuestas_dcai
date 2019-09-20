<template>
    <b-container class="bv-example-row">
        <b-row>
            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <FormEncuesta mode="edit" :data="data"></FormEncuesta>
            </b-col>
        </b-row>
    </b-container>
    
</template>

<script>

    import FormEncuesta from '@/components/FormEncuesta.vue'

    export default {
        components: {
            FormEncuesta
        },
        data() {
            return {
                items: [
                {
                    text: 'Encuestas',
                    to: { name: 'home' }
                },
                {
                    text: 'Editar Encuesta',
                    active: true
                }],
                data: this.$route.params.row
            }
        },
        mounted(){


        }
    }
</script>