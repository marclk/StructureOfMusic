<template>
	<section class="home">
		<section class="home-heading">
			<h1 class="home-heading-title"><span style=" color: #121212; text-shadow: 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white; ">Welcome to the</span> <br/> Structure of Music</h1>
			<p class="home-heading-paragraph">{{paragraph}}</p>
		</section>
		<section class="home-content">
			<p>Get started with our <br/> <a href="#">Lessons</a></p>
			<p>Play around in our <br/> <a href="#">Playground</a></p>
			<p>Find inspiration in our <br/> <a href="#">Knowledge Hub</a></p>
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
	},
	methods:{
		formatTitle(){
			let splitted = this.title.split('~');
			let subString = splitted[0];
			let newString = subString += '\n';
			
			let fullString = newString += splitted[1];
			console.log(fullString);
			
			return fullString;
		},
	}

}
</script>

<style lang="scss">

h1{
	font-size: 3rem!important;
}

	.home-heading{
		padding: 5rem 0 3rem 0;
	}

	.home-heading-links-label{
		background-color: rgb(170,25,25);
	}

	.home-heading-title{
		font-size: 4rem;
		font-weight: 600;
		margin-bottom: 3rem;
		line-height: 4.5rem
	}

	.home-heading-paragraph{
		width: 80%;
		font-weight:300;
	}

	.home-content{
		width: 90%;
		display: flex;
		& >p{
			width: 30%;
			font-size: 1.5rem;
			&>a{
				color: white;
				font-weight: 700;
				text-decoration: underline;

				&:hover{
					background-color: rgb(170,25,25);
					color: #121212;
				}
			}
		}
	}

</style>