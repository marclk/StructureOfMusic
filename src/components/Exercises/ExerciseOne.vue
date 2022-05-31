<template>
	<section class="exercise">
		<section class="exercise_one">
			<section class="exercise_one_heading">
				<h3>SCORE: 0/12</h3>
				<p>Highscore: 6/12</p>
			</section>
			<section class="exercise_one_button_wrapper">
				<button class="button" @click="practiceNote()">play note</button>
			</section>
		</section>
		<!-- <section class="exercise_divider">
			
		</section>
		<section class="exercise_two">

		</section> -->
		<section>

		</section>
	</section>
</template>

<script>
export default {
	methods:{
		practiceNote(){
			this.$emit('practiceNote');
		}
	}
	
}
</script>

<style lang="scss">
	.exercise{
		padding: 1rem;

		&_divider{
			width:2px;
			height: 100%;
			background-color: white;
		}
	}

	.exercise_one{
		// width: 48%;
		text-align: center;

		&_button_wrapper{
			margin: 1rem;
		}
	}

</style>