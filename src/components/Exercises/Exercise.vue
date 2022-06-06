<script setup>

</script>

<template>
	<section class="exercise">
		<section class="exercise_one">
			<section v-if="this.store.notes.started == true" class="exercise_one_heading">
				<p>Round: {{store.notes.round}} / 12</p>
				<span>Attempts left: {{store.notes.attempts}} </span>
				<h3>SCORE: {{store.notes.score || 0}}</h3>
			</section>
			<p>High score: <span style="font-weight: 700">{{store.notes.highScore || 0}}</span></p>
			<section class="exercise_one_button_wrapper">
				<section>
					<button v-if="store.notes.started == true && store.notes.noteToPlay !== null" class="button" @click="practiceNote()">Listen Again</button>
					<button v-else-if="store.notes.started == true && store.notes.noteToPlay == null" class="button" @click="practiceNote()">Play Note</button>
					<button v-else class="button" @click="startGame">Start Game</button>
				</section>
			</section>
		</section>
		<section class="exercise_divider">

		</section>
		
		<section class="exercise_two">
			<p>High score: <span style="font-weight: 700">{{scaleStore.highScore || 0}}</span></p>
			<section v-if="scaleStore.started == true" class="exercise_two_heading">
				<span class="exercise_two_heading_round">Round: {{scaleStore.round}} / 5</span>
				<h3>SCORE: {{scaleStore.score || 0}}</h3>
				<span class="exercise_two_heading_attempts">Attempts left: {{scaleStore.attempts}} </span>
			</section>
			<section class="exercise_two_options">
				
				<select v-if="this.scaleStore.started == true" v-model="scaleStore.options.key">
					<option v-if="this.scaleStore.rootNote == null" value="major">Major</option>
					<option v-else disabled value="major">Major</option>

					<option v-if="this.scaleStore.rootNote == null" value="minor">Minor</option>
					<option v-else disabled value="minor">Minor</option>
				</select>

				<select v-if="this.scaleStore.started == true" v-model="scaleStore.options.mode">
					<option v-if="this.scaleStore.rootNote == null" value="blind">Blind</option>
					<option v-else disabled value="blind">blind </option>

					<option v-if="this.scaleStore.rootNote == null" value="listen">Listen</option>
					<option v-else disabled value="listen">listen</option>
				</select>

			</section>
			<section v-if="this.scaleStore.started == true" class="exercise_two_note">
				<p>Play the correct <b>{{scaleStore.options.key}}</b> scale with root note: {{scaleStore.nameRootNote}} {{scaleStore.rootNote}}</p>
				<br/>
				<div class="exercise_two_note_tip">
					<p v-if="scaleStore.options.key == 'major'">tip: the formula for the Major scale is: <br/><span class="w">W</span> <span class="w">W</span> <span class="h">H</span> <span class="w">W</span> <span class="w">W</span> <span class="w">W</span> <span class="h">H</span></p>
					<p v-else-if="scaleStore.options.key == 'minor'">tip: the formula for the Minor scale is: <br/><span class="w">W</span> <span class="h">H</span> <span class="w">W</span> <span class="w">W</span> <span class="h">H</span> <span class="w">W</span> <span class="w">W</span></p>
				</div>
				<p ></p>
			</section>
			
			<section class="exercise_two_button_wrapper">
				<section>
					<button v-if="scaleStore.started == true && scaleStore.rootNote !== null" class="button" @click="practiceScale()">Listen Again</button>
					<button v-else-if="scaleStore.started == true && scaleStore.rootNote == null" class="button" @click="practiceScale()">Play Note</button>
					<button v-else class="button" @click="startScaleGame">Start Game</button>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
import { useExerciseStore } from '@/stores/exercise';
import { useScaleStore } from '@/stores/scale';

export default {
	setup(){
		const store = useExerciseStore();
		const scaleStore = useScaleStore();

      return{
        store,
				scaleStore
      }
	},
	methods:{
		practiceNote(){
			this.$emit('practiceNote');
		},
		practiceScale(){
			this.$emit('practiceScale');
		},
		startGame(){
			if(this.scaleStore.started){
				this.scaleStore.setGameState(false);
			}
			this.store.setGameState(true);
		},
		startScaleGame(){
			if(this.store.notes.started){
				this.store.setGameState(false);
			}
			this.scaleStore.setGameState(true)
		}
	}
	
}
</script>

<style lang="scss">
	.exercise{
		padding: 1rem;
		display: flex;
		background-color: #212121;

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

	.exercise_two{
		width: 48%;
		text-align: center;
	

		&_heading{
			display: flex;
				justify-content: space-between;
			
			& > h3{
				width: 100%;
			}

			& > span{
				width: 4rem;
			}
		}

		&_button_wrapper{
			margin: 1rem;
		}

		&_options > select{
			color: white;
			padding: .5rem;
			margin: 1rem;
			background-color: black;
			border: 2px solid white;
			border-radius: .25rem;
		}

		.w{
			color: rgba(0, 136, 255, 1);
			font-weight: 700;
		}

		.h{
			color: rgba(255, 131, 0, 1);
			font-weight: 700;
		}
	}

</style>