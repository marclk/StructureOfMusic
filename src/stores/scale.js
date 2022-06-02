import {defineStore} from 'pinia';

export const useScaleStore = defineStore("scale", {
	state: () =>{
		return {
			started: false,
			options: {key: 'major'},
			attempts: null,
			round: 0,
			score: null,
			highScore: null,
			rootNote: null,
			scale: [],
			step: 0,
			playedNote: null
		};
	},
	actions: {
		setGameState(gameState){
			this.started = gameState;
			if(gameState){
				console.log("Scale game Started!")
				this.round = 1;
				this.score = 0;
				this.attempts = 2;
			}else{
				this.round = 0;
				this.score = null;
				this.noteToPlay = null;
				this.playedNote = null;
				this.attempts = null;
			}
		},

		incrementScore(){
			this.score++;
		},
		incorrect(){
			if(this.attempts > 1){
				this.attempts--;
			}else{
				if(this.round < 5){
					this.round++;
					this.attempts = 2;
					this.rootNote = null;
					this.scale = [];
					this.step = 0;
				}else{
					this.setGameState(false);
				}
			}
		},
		correct(){
			this.score++;
			if(this.score > this.highScore){
				this.highScore = this.score;
			}

			if(this.round < 5){
				this.round++;
				this.attempts = 2;
				this.noteToPlay = null;
			}else{
				this.setGameState(false);
			}
			
		},
		scaleToPlay() {
			if(this.options.key == 'major' && this.rootNote !== null){
				let steps = [0, 2, 4, 5, 7, 9, 11];
				
				let scaleToPlay = [];
				for(let i = 0; i < steps.length; i++){
					scaleToPlay.push(this.rootNote + steps[i]);
				}
				this.scale = scaleToPlay;
				console.log(scaleToPlay);

			}else if(this.options.key == 'minor' && this.rootNote !== null){
				let steps = [0, 2, 3, 5, 7, 8, 10];
				
				let scaleToPlay = [];
				for(let i = 0; i < steps.length; i++){
					scaleToPlay.push(this.rootNote + steps[i]);
				}
				this.scale = scaleToPlay;
				console.log(scaleToPlay);
			} else {
				console.log("Game not properly initialised!");
			}
		},

		playedNote(note){
			this.playedNote = note;
		},

	},
	getters:{
		doubleNoteScore: (state) => state.score * 2,
	}
});