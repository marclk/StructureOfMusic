<script setup>

</script>

<template>
	<section class="exercise">
		<section class="exercise_one">
			<section v-if="this.store.notes.started == true" class="exercise_one_heading">
				<p>Round: {{store.notes.round}} / 12</p>
				<span>Attempts left: {{store.notes.attempts}} </span>
				<h3>SCORE: {{store.notes.score || 0}}</h3>
				<p>Highscore: <span style="font-weight: 700">{{store.notes.highScore || 0}}</span></p>
			</section>
			<section class="exercise_one_button_wrapper">
				<section>
					<button v-if="store.notes.started == true && store.notes.noteToPlay !== null" class="button" @click="practiceNote()">listen again</button>
					<button v-else-if="store.notes.started == true && store.notes.noteToPlay == null" class="button" @click="practiceNote()">Play Note</button>
					<button v-else class="button" @click="startGame">Start Game</button>
				</section>
				
				
			</section>
		</section>
		<section class="exercise_divider">

		</section>
		<section class="exercise_two">

		</section>
		<section>

		</section>
	</section>
</template>

<script>
import { useExerciseStore } from '@/stores/exercise';

export default {
	setup(){
		const store = useExerciseStore();

      return{
        store
      }
	},
	methods:{
		practiceNote(){
			this.$emit('practiceNote');
		},
		startGame(){
			this.store.setGameState(true);
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
		width: 48%;
		text-align: center;


		&_button_wrapper{
			margin: 1rem;
		}
	}

</style>