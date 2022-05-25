<!-- 

	current bugs:
		- When mousedown and mouseup on another key, mouse up doesnt fire for the mousedown 

-->
<template lang="pug">

	section
		.container
			each octave in [1,2,3,4,5,6]
				each note in [0,1,2,3,4,5,6,7,8,9,10,11]
					- var input = note + 1 ;
					- var noteName = ['"C"', '"C#"', '"D"', '"D#"', '"E"', '"F"', '"F#"', '"G"', '"G#"', '"A"', '"A#"', '"B"'];
					if note == 0 || note == 2 || note == 4 || note == 5 || note == 7 || note == 9 || note == 11 
						.white_key.key(style={'--note-name':  `${noteName[note]}`, 'animation-delay': 'calc( 0.02s * (( 12 * '+ `${octave}` + ' - 12 ) + ' + `${note}` + '))' } data-note=`${note}` data-octave=`${octave}` data-noteName=`${noteName[note]}` v-on:mousedown.prevent=`sendSound(${octave}, ${note}, 127), stopAnimation();`, v-on:mouseup=`sendSound(${octave}, ${note}, 0), stopAnimation();`, v-on:mouseout=`sendSound(${octave}, ${note}, 0);`) 
					else if  note == 1 || note == 3 || note == 6 || note == 8 || note == 10
						.black_key.key(style={'--note-name':  `${noteName[note]}`, 'animation-delay': 'calc( 0.02s * (( 12 * '+ `${octave}` + ' - 12 ) + ' + `${note}` + '))' } data-note=`${note}` data-octave=`${octave}` data-noteName=`${noteName[note]}` v-on:mousedown=`sendSound(${octave}, ${note}, 127), stopAnimation();`, v-on:mouseup=`stopSound(${octave}, ${note}, 0), stopAnimation();`, v-on:mouseout=`sendSound(${octave}, ${note}, 0);`) 
	
</template>

<script>
export default {
	data(){
		return{
			octave: null,
			isClicked: false
		}
	},
	methods: {
		sendSound(octave, note, velocity){
			
			this.$emit('onKeyboardInput', {octave, note, velocity});
		},
		stopSound(octave, note, velocity){
			this.$emit('onKeyboardInput', {octave, note, velocity});
		},
		stopAnimation(){
			if(!this.isClicked){
				
				let whiteKeys = document.getElementsByClassName("white_key");
				let blackKeys = document.getElementsByClassName("black_key");

				[].forEach.bind(whiteKeys,function(key){
					key.style.animationFillMode = "forwards";
					key.addEventListener('animationiteration',function(){
						key.style.animation = "none";
					});
				})();

				[].forEach.bind(blackKeys,function(key){
					key.style.animationFillMode = "forwards";
					key.addEventListener('animationiteration',function(){
						key.style.animation = "none";
					});
				})();

				this.isClicked = true;
			}
		},

		keyPressed(note, octave, value){
			let whiteKeys = document.getElementsByClassName("white_key");
			let blackKeys = document.getElementsByClassName("black_key");

			[].forEach.bind(whiteKeys,function(key){
				if(key.dataset.note == note && key.dataset.octave == octave){
					if(value > 0){
						key.classList.add("active");
					}else{
						key.classList.remove("active");
					}
					// console.log(key);
					// console.log("WHITE NOTE PLAYED ON MIDI: " + note, octave);
				}
			})();

			[].forEach.bind(blackKeys,function(key){
				if(key.dataset.note == note && key.dataset.octave == octave){
					if(value > 0){
						key.classList.add("active");
					}else{
						key.classList.remove("active");
					}
					// console.log(key);
					// console.log("BLACK NOTE PLAYED ON MIDI: " + note, octave);
				}
			})();
		},
		
	},
	created(){
		const keyCodes = ['a','w','s','e','d','f','t','g','y','h','u','j'];
		const notes = ['0','1','2','3','4','5','6','7','8','9','10','11'];
		
		window.addEventListener('keydown', (e) => {

			for(let i = 0; i < keyCodes.length; i++){
				if(e.key == keyCodes[i] && e.repeat === false){
					this.stopAnimation();
					this.$emit('onKeyboardInput', {octave: 4, note: notes[i], velocity: 127 });
				}
			}
		});

		window.addEventListener('keyup', (e) => {
			for(let i = 0; i < keyCodes.length; i++){
				if(e.key == keyCodes[i]){
					
					this.$emit('onKeyboardInput', {octave: 4, note: notes[i], velocity: 0 });
				}
			}
		});
	}
}
</script>

<style scoped>
section {
  margin: auto;
  width: 100%;
  height: 175px;
  border-radius: 4px;
}

.container {
  margin: auto;
  overflow: overlay;
  width: calc((49px * 19px)+(35px * 16px));
	margin: 0 auto;
  padding-top: 15px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px;
	height: 100%;
	padding-top: 30px;
}

.key {
  float: left;
  position: relative;
  border-radius: 2px;
}

.white_key {
  background-color: rgba(0,0,0,0);
  border:1px solid white;
  height: 100px;
  width: calc(12px * 1.6);
  z-index: 1;

	animation: pulseWhite 1.66s infinite;
	box-shadow:
		0 0 .1rem rgba(255, 255, 255, 1),
		inset 0 0 .1rem rgba(255, 255, 255, 1),
		0 0 .5rem  rgba(0, 136, 255, 1),
		inset 0 0 .5rem  rgba(0, 136, 255, 1),
		0 0 1rem  rgba(0, 136, 255, 1),
		inset 0 0 1rem  rgba(0, 136, 255, 1);
}

.white_key:active {
  height: 98px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(255, 131, 0, 1),
			inset 0 0 .5rem  rgba(255, 131, 0, 1),
			0 0 1rem rgba(255, 131, 0, 1),
			inset 0 0 1rem  rgba(255, 131, 0, 1);
}

.white_key.active::before{ 
	content: var(--note-name);
	display: block;
	margin-top: -30px;
	text-align: center;
}

.white_key.active {
  height: 98px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(255, 131, 0, 1),
			inset 0 0 .5rem  rgba(255, 131, 0, 1),
			0 0 1rem rgba(255, 131, 0, 1),
			inset 0 0 1rem  rgba(255, 131, 0, 1);
}

.black_key {
  background-color: black;
  height: 70px;
  width: calc(10px * 1.6);
  margin-left: -5px;
  margin-right: -5px;
  z-index: 2;

	animation: pulseBlack 1.66s infinite;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(68, 0, 204, 1),
			inset 0 0 .5rem  rgba(68, 0, 204, 1),
			0 0 1rem  rgba(68, 0, 204, 1),
			inset 0 0 1rem  rgba(68, 0, 204, 1);
	
}

.black_key:active {
  height: 68px;
  border-radius: 2.5px;

	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(255, 0, 204, 1),
			inset 0 0 .5rem  rgba(255, 0, 204, 1),
			0 0 1rem rgba(255, 0, 204, 1),
			inset 0 0 1rem  rgba(255, 0, 204, 1);
}

.black_key.active {
  height: 68px;
  border-radius: 2.5px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(255, 0, 204, 1),
			inset 0 0 .5rem  rgba(255, 0, 204, 1),
			0 0 1rem rgba(255, 0, 204, 1),
			inset 0 0 1rem  rgba(255, 0, 204, 1);
}

.black_key.active::before{ 
	content: var(--note-name);
	display: block;
	text-align: center;
	margin-top: -30px;
}

@keyframes pulseWhite{
	0% {
		
		transform: scale(1.0);

		box-shadow:
		0 0 .1rem rgba(255, 255, 255, 1),
		inset 0 0 .1rem rgba(255, 255, 255, 1),
		0 0 .5rem  rgba(0, 136, 255, 1),
		inset 0 0 .5rem  rgba(0, 136, 255, 1),
		0 0 1rem  rgba(0, 136, 255, 1),
		inset 0 0 1rem  rgba(0, 136, 255, 1);
	}

	33% {
		
		transform: scale(1.03);

		box-shadow:
		0 0 .1rem rgba(255, 255, 255, 0.25),
		inset 0 0 .1rem rgba(255, 255, 255, 0.25),
		0 0 .5rem  rgba(0, 136, 255, 0.25),
		inset 0 0 .5rem  rgba(0, 136, 255, 0.25),
		0 0 1rem  rgba(0, 136, 255, 0.25),
		inset 0 0 1rem  rgba(0, 136, 255, 0.25);
	}

	100% {

		transform: scale(1.0);
		box-shadow:
		0 0 .1rem rgba(255, 255, 255, 1),
		inset 0 0 .1rem rgba(255, 255, 255, 1),
		0 0 .5rem  rgba(0, 136, 255, 1),
		inset 0 0 .5rem  rgba(0, 136, 255, 1),
		0 0 1rem  rgba(0, 136, 255, 1),
		inset 0 0 1rem  rgba(0, 136, 255, 1);
	}
}

@keyframes pulseBlack{
	0%{
		
		transform: scale(1.0);

		box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(68, 0, 204, 1),
			inset 0 0 .5rem  rgba(68, 0, 204, 1),
			0 0 1rem  rgba(68, 0, 204, 1),
			inset 0 0 1rem  rgba(68, 0, 204, 1);
	}

	33%{

		transform: scale(1.03);		

		box-shadow:
			0 0 .25rem rgba(255, 255, 255, 0.25),
			inset 0 0 .25rem rgba(255, 255, 255, 0.25),
			0 0 .5rem  rgba(68, 0, 204, 0.25),
			inset 0 0 .5rem  rgba(68, 0, 204, 0.25),
			0 0 1rem  rgba(68, 0, 204, 0.25),
			inset 0 0 1rem  rgba(68, 0, 204, 0.25);
	}

	100%{
		
		transform: scale(1.0);

		box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(68, 0, 204, 1),
			inset 0 0 .5rem  rgba(68, 0, 204, 1),
			0 0 1rem  rgba(68, 0, 204, 1),
			inset 0 0 1rem  rgba(68, 0, 204, 1);
	}
}

</style>