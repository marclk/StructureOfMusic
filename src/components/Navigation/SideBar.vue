<template>
	<section class="navMain">

		<header>
			<section class="logo">
				<span>Structure of Sound</span>
			</section>
			
			<section class="home navBlock">
				<h3>Home</h3>
				<nav class="home-nav">
					<ul>
						<li @click="changePage('home', 0)"><a href="#">Introduction</a></li>
					</ul>
				</nav>
			</section>
			
			<section class="lessons navBlock">
				<h3>Lessons</h3>
				<nav class="lessons-nav">
					<ul>
						<li @click="changePage('lessonOverview', 0)"><a href="#">Overview		</a></li>
						<li @click="changePage('lessons', 0)"><a href="#">1: Notes					</a></li>
						<li @click="changePage('lessons', 1)"><a href="#">2: Scales					</a></li>
						<li @click="changePage('lessons', 2)"><a href="#">3: Chords					</a></li>
						<li @click="changePage('lessons', 3)"><a href="#">4: Minor & Major	</a></li>
						<li @click="changePage('lessons', 4)"><a href="#">5: Melodies				</a></li>
						<li @click="changePage('lessons', 5)"><a href="#">6: Rhythm					</a></li>
					</ul>
				</nav>
			</section>
			
			<section class="playground navBlock">
				<h3>Playground</h3>
				<nav class="playground-nav">
					<ul>
						<li @click="changePage('playground', 0)"><a href="#">Freestyle</a></li>
						<li @click="changePage('playground', 1)"><a href="#">Eartraining</a></li>
					</ul>
				</nav>
			</section>

			<section class="hub navBlock">
				<h3>Knowledge Hub</h3>
				<nav class="hub-nav">
					<ul>
						<li @click="changePage('hub', 0)"><a href="#"></a>Sources</li>
					</ul>
				</nav>
			</section>
			
		</header>
	</section>
</template>

<script>
	export default{
		data(){

		},

		methods:{
			changePage(page, lessonNum){
				console.log("nav link clicked!")
				switch(page){
					case 'home':
						break;
					case 'lessons':
						this.$emit('setCurrentPage', 'app-lesson-page', lessonNum);
						break;
					case 'playground':
						break;
					case 'hub':
						break;
					default:
						break;
				}
				
			}
		}

	}

</script>

<style lang="scss">
	.navMain{
		background-color: rgb(70, 70, 70);
	}

	header {
		width:auto;
		height: 100vw;
	}

	.logo{
		background-color: #212121;
		text-align: center;
		padding: 1rem;
	}

	h3{
		font-size: 2rem!important;
		font-weight: 700!important;
	}

	.navBlock{
		padding: 1rem 3rem;
		
		& > nav {

			& > ul{

				& > li{
					font-size: 1.5rem;
					padding: 0.5rem;
					color: white;
					
					&:hover{
						cursor: pointer;
						background-color: rgb(170,25,25);
					}

					& > a{
						color: white;
					}
				}
			}
		}	
	}
	


</style>