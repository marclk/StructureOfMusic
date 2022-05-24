<template>
	<section>
		<section class="lesson-heading">
			<span class="lesson-heading-label">Practice!</span>
			<h3 class="lesson-heading-title">{{number}}: {{title}}</h3>
			<p class="lesson-heading-paragraph">{{paragraph}}</p>
		</section>
		<section class="lesson-content">
			<youtube :video-id="videoId" :player-vars="playerVars" autoplay="0" ref="youtube" @playing="playing"></youtube>
		</section>
		<section>
			<button @click="startPractice()">Next Lesson!</button>
		</section>
	</section>
</template>

<script>
import Vue from 'vue';
import VueYoutube from 'vue-youtube';

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
	methods: {
		setVideoTiming(){
			this.$refs.youtube.player.loadVideoById({'videoId': 'rgaTLrZGlk0', 'autoplay': 0, 'startSeconds': 156, 'endSeconds': 612});
		},
		
		startPractice(){
			console.log(this.id + "= ID!!!!!!!!!!!!!!!!!!!!");
			this.$emit('setCurrentPage', ('app-practice-page', this.id));
		}
	},
	mounted(){
		this.setVideoTiming();
		console.log("Triggered!")
	}
}

</script>

<style>

</style> 