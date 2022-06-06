<!-- 

	current bugs:
		- When mousedown and mouseup on another key, mouse up doesnt fire for the mousedown 

-->
<script setup>

</script>

<template lang="pug">
section
	.container
		each octave in [ 4,5]
			each note in [0,1,2,3,4,5,6,7,8,9,10,11]
				- var input = note + 1 ;
				- var noteName = ['"C"', '"C#"', '"D"', '"D#"', '"E"', '"F"', '"F#"', '"G"', '"G#"', '"A"', '"A#"', '"B"'];
				if note == 0 || note == 2 || note == 4 || note == 5 || note == 7 || note == 9 || note == 11 
					.white_key.key(style={'--note-name':  `${noteName[note]}`, 'animation-delay': 'calc( 0.02s * (( 12 * '+ `${octave}` + ' - 12 ) + ' + `${note}` + '))' } data-note=`${note}` data-octave=`${octave}` data-noteName=`${noteName[note]}` v-on:mousedown.prevent=`sendSound(${octave}, ${note}, 127), stopAnimation();`, v-on:mouseup=`sendSound(${octave}, ${note}, 0), stopAnimation();`,'') 
				else if  note == 1 || note == 3 || note == 6 || note == 8 || note == 10
					.black_key.key(style={'--note-name':  `${noteName[note]}`, 'animation-delay': 'calc( 0.02s * (( 12 * '+ `${octave}` + ' - 12 ) + ' + `${note}` + '))' } data-note=`${note}` data-octave=`${octave}` data-noteName=`${noteName[note]}` v-on:mousedown=`sendSound(${octave}, ${note}, 127), stopAnimation();`, v-on:mouseup=`stopSound(${octave}, ${note}, 0), stopAnimation();`,'') 
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

			if(this.store.notes.started == true){
				this.notesGameCheck(note, value); 
			}else{
				
				this.setKeyStyle(note, octave, value);
			}

			if(this.scaleStore.started == true){
				console.log("note: " + note + "val: " + value)
				this.scaleGameCheck(note, octave, value);
			}else{
				console.log("KeyStyle Trigger")
				this.setKeyStyle(note, octave, value);
			}
		
		},

		notesGameCheck(note, value){
			if(value > 0 && this.store.notes.noteToPlay !== null){
				console.log(this.store.notes.noteToPlay + '<- toPlay, ' + note + '<- played note')
				if(this.store.notes.noteToPlay == note){
					console.log("Correct!");
					this.store.correct();
				}else{
					console.log("incorrect!");
					this.store.incorrect();

				}
			}
		},

		scaleGameCheck(note, octave, value){
			if(this.scaleStore.rootNote !== null){
				let convertNote = {12: 0, 13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7}
				if(this.scaleStore.scale[this.scaleStore.step] > 11){
					if(note == convertNote[this.scaleStore.scale[this.scaleStore.step]]){
						console.log('good converted note: ' + note);
						this.setKeyStyle(note, octave, value, 'correct');
						if(value > 0){
							this.scaleStore.step += 1;
							if(this.scaleStore.step == this.scaleStore.scale.length){
								this.scaleStore.correct();
								this.resetKeyStyle();
							}
						}
						
					// }else if(note == convertNote[this.scaleStore.scale[this.scaleStore.step-1]]){
					// 	this.setKeyStyle(note, octave, value, 'correct');
					}else {
						console.log('bad converted note: ' + note);
						this.setKeyStyle(note, octave, value, 'incorrect');
						if(value > 0){
							if(this.scaleStore.attempts > 1){
								this.scaleStore.attempts--;
							}else{
								this.resetKeyStyle();
								this.scaleStore.incorrect();	
							}
							
						}else{
							if(note == convertNote[this.scaleStore.scale[this.scaleStore.step-1]]){
								this.setKeyStyle(note, octave, value, 'incorrect')
							}
						}
						
					}
				}else{
					if(note == this.scaleStore.scale[this.scaleStore.step]){
						console.log('good note : ' + note);
						this.setKeyStyle(note, octave, value, 'correct')
						if(value > 0){
							this.scaleStore.step += 1;
							if(this.scaleStore.step == this.scaleStore.scale.length){
								this.scaleStore.correct();
								this.resetKeyStyle();
							}
						}else{
							
						}
					// }else if(note == this.scaleStore.scale[this.scaleStore.step-1]){
					// 	this.setKeyStyle(note, octave, value, 'correct');
					}else {
						console.log('bad note: ' + note);
						this.setKeyStyle(note, octave, value, 'incorrect')
						if(value > 0){
							if(this.scaleStore.attempts > 1){
								this.scaleStore.attempts--;
							}else{
								this.resetKeyStyle();
								this.scaleStore.incorrect();	
							}
						}else{
							if(note == this.scaleStore.scale[this.scaleStore.step-1]){
								this.setKeyStyle(note, octave, value, 'incorrect')
							}
						}

					}
				}
			}
		},

		setKeyStyle(note, octave, value, state = 'null'){
			let whiteKeys = document.getElementsByClassName("white_key");
			let blackKeys = document.getElementsByClassName("black_key");
				
			[].forEach.bind(whiteKeys,function(key){
				if(key.dataset.note == note && key.dataset.octave == octave){
					if(value > 0){
						if(state == 'correct'){key.classList.add("correct")}else if(state == 'incorrect'){key.classList.add("incorrect")}else{key.classList.add("active")}
					}else{
						if(state == 'correct'){key.classList.remove("correct")}else if(state == 'incorrect'){key.classList.remove("incorrect")}else{key.classList.remove("active")}
					}
					// console.log(key);
					// console.log("WHITE NOTE PLAYED ON MIDI: " + note, octave);
				}
			})();

			[].forEach.bind(blackKeys,function(key){
				if(key.dataset.note == note && key.dataset.octave == octave){
					if(value > 0){
						if(state == 'correct'){key.classList.add("correct")}else if(state == 'incorrect'){key.classList.add("incorrect")}else{key.classList.add("active")}
					}else{
						if(state == 'correct'){key.classList.remove("correct")}else if(state == 'incorrect'){key.classList.remove("incorrect")}else{key.classList.remove("active")}
					}
					// console.log(key);
					// console.log("BLACK NOTE PLAYED ON MIDI: " + note, octave);
				}
			})();	
		},

		resetKeyStyle(){
			let whiteKeys = document.getElementsByClassName("white_key");
			let blackKeys = document.getElementsByClassName("black_key");
			let classNames = ['active', 'correct', 'incorrect'];
				
			[].forEach.bind(whiteKeys,function(key){
				if(classNames.some(className => key.classList.contains(className))){
					console.log("GHET OUTTA HERE")
					classNames.some(className => key.classList.remove(className));
				}
			})();

			[].forEach.bind(blackKeys,function(key){
				if(classNames.some(className => key.classList.contains(className))){
					console.log("GHET OUTTA HERE")
					classNames.some(className => key.classList.remove(className));
				}
			})();	
		},
	},
	created(){
		const keyCodes = ['q','2','w','3','e','r','5','t','6','y','7','u','i','9','o','0','p','[','=',']'];
		const notes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
		
		window.addEventListener('keydown', (e) => {
			for(let i = 0; i < keyCodes.length; i++){
				if(e.key.toLowerCase() == keyCodes[i] && e.repeat === false){
					this.stopAnimation();
					if(i <= 11){
						this.$emit('onKeyboardInput', {octave: 4, note: notes[i], velocity: 127 });
					}else{
						let convertNote = {12: 0, 13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19:7}
						this.$emit('onKeyboardInput', {octave: 5, note: convertNote[notes[i]], velocity: 127 });
						
					}
				}
			}
		});

		window.addEventListener('keyup', (e) => {
			for(let i = 0; i < keyCodes.length; i++){
				if(e.key.toLowerCase() == keyCodes[i]){
					if(i <= 11){
						this.$emit('onKeyboardInput', {octave: 4, note: notes[i], velocity: 0 });
					}else{
						let convertNote = {12: 0, 13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19:7}
						this.$emit('onKeyboardInput', {octave: 5, note: convertNote[notes[i]], velocity: 0 });
					}
				}
			}
		});
	}
}
</script>

<style lang="scss" scoped>
section {
  margin: auto;
  width: 100%;
  height: 175px;
  border-radius: 4px;
	margin-bottom: 3rem;
}

.container {
  margin: auto;
  /* overflow: overlay; */
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
  height: 170px;
  width: calc(12px * 5);
  z-index: 1;

	animation: none;
	box-shadow:
		0 0 .1rem rgba(255, 255, 255, 1),
		inset 0 0 .1rem rgba(255, 255, 255, 1),
		0 0 .5rem  rgba(0, 136, 255, 1),
		inset 0 0 .5rem  rgba(0, 136, 255, 1),
		0 0 1rem  rgba(0, 136, 255, 1),
		inset 0 0 1rem  rgba(0, 136, 255, 1);
}

.white_key:active {
  height: 165px;
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
	transform: scale(2);
	display: block;
	margin-top: -50px;
	text-align: center;
}

.white_key.active {
  height: 165px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(255, 131, 0, 1),
			inset 0 0 .5rem  rgba(255, 131, 0, 1),
			0 0 1rem rgba(255, 131, 0, 1),
			inset 0 0 1rem  rgba(255, 131, 0, 1);
}

.white_key.correct {
  height: 165px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(57, 255, 20, 1),
			inset 0 0 .5rem  rgba(57, 255, 20, 1),
			0 0 1rem rgba(57, 255, 20, 1),
			inset 0 0 1rem  rgba(57, 255, 20, 1)!important;
	background-color: rgba(57, 255, 20, 0.2);
}

.white_key.incorrect {
  height: 165px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(247, 33, 25, 1),
			inset 0 0 .5rem  rgba(247, 33, 25, 1),
			0 0 1rem rgba(247, 33, 25, 1),
			inset 0 0 1rem  rgba(247, 33, 25, 1)!important;
			background-color: rgba(247, 33, 25, .2);
}


.black_key {
  background-color: black;
  height: 120px;
  width: calc(10px * 5);
  margin-left: -23px;
  margin-right: -23px;
  z-index: 2;

	animation: none;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(68, 0, 204, 1),
			inset 0 0 .5rem  rgba(68, 0, 204, 1),
			0 0 1rem  rgba(68, 0, 204, 1),
			inset 0 0 1rem  rgba(68, 0, 204, 1);
	
}

.black_key:active {
  height: 115px;
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
  height: 115px;
  border-radius: 2.5px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(255, 0, 204, 1),
			inset 0 0 .5rem  rgba(255, 0, 204, 1),
			0 0 1rem rgba(255, 0, 204, 1),
			inset 0 0 1rem  rgba(255, 0, 204, 1);
}

.black_key.correct {
  height: 115px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(57, 255, 20, 1),
			inset 0 0 .5rem  rgba(57, 255, 20, 1),
			0 0 1rem rgba(57, 255, 20, 1),
			inset 0 0 1rem  rgba(57, 255, 20, 1)!important;
	background-color: #0b3003;
}

.black_key.incorrect {
  height: 115px;
  border-radius: 3px;
	box-shadow:
			0 0 .25rem rgba(255, 255, 255, 1),
			inset 0 0 .25rem rgba(255, 255, 255, 1),
			0 0 .5rem  rgba(247, 33, 25, 1),
			inset 0 0 .5rem  rgba(247, 33, 25, 1),
			0 0 1rem rgba(247, 33, 25, 1),
			inset 0 0 1rem  rgba(247, 33, 25, 1)!important;


}

.black_key.active::before{ 
	content: var(--note-name);
	transform: scale(2);
	display: block;
	text-align: center;
	margin-top: -55px;
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