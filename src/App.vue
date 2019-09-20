<template>
	<div id="app">
		<NavBar class="mb-4"></NavBar>
		<router-view/>
	</div>
</template>

<script>

    import NavBar from './components/NavBar'

    export default {
		components: {
			NavBar
		}
    }
</script>
