<template>
	<section class="practice">
		<section class="practice-heading">
			<section class="practice-heading-links">
				<span class="practice-heading-links-label">Practice!</span>
				<span class="practice-heading-links-back" @click="backToLesson()"><a href="#"> previous lesson</a></span>
				<span> / </span>
				<span class="practice-heading-links-next" @click="nextLesson()"><a href="#">next lesson</a></span>
			</section>
			<h3 class="practice-heading-title">{{number}}: {{title}}</h3>
			<p class="practice-heading-paragraph">{{paragraph}}</p>
		</section>
		<section class="practice-content"> 
			<template>
				<app-exercise @practiceNote="practiceNote"></app-exercise>
			</template>
		</section>
	</section>
</template>

<script>
import Vue from 'vue';
import VueYoutube from 'vue-youtube';

import Exercise from '../Exercises/Exercise.vue';

Vue.use(VueYoutube)

export default{
	props: {
		id: Number,
		number: String,
		title: String,
		paragraph: String,
		videoData: {
			videoId: String,
			startSeconds: Number,
			endSeconds: Number,
		},
		practiceLink: String,
	},
	data(){
		return{
			videoId: this.videoData.videoId, //rgaTLrZGlk0
			playerVars:{
				autoplay: 0,
			}
		};
	},
	components: {
		appExercise: Exercise
	},
	methods: {
		setVideoTiming(){
			this.$refs.youtube.player.cueVideoById({'videoId': 'rgaTLrZGlk0', 'autoplay': 0, 'startSeconds': 156, 'endSeconds': 612});
		},
		
		nextLesson(){
			let nextId = parseInt(this.id+1);
			this.$emit('setCurrentPage', 'app-lesson-page', nextId);
		},

		backToLesson(){
			this.$emit('setCurrentPage', 'app-lesson-page', this.id);
		},

		practiceNote(){
			this.$emit('playRandomNote');
		}
	},
	mounted(){
		this.setVideoTiming();
		console.log("Triggered!")
	}
}

</script>

<style>

	.practice{
		width: 80%;
	}

	.practice-heading{
		padding: 5rem 0 3rem 0;
	}

	.practice-heading-links-label{
		background-color: rgb(170,25,25);
	}

	.practice-heading-title{
		font-size: 2rem;
		font-weight: 700;
	}

	.practice-heading-paragraph{
		font-weight:500;
	}

	.practice-content{
		border: 1px solid white;
		margin: 0 1rem;
	}

</style> 