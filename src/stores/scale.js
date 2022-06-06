import {defineStore} from 'pinia';

export const useScaleStore = defineStore("scale", {
	state: () =>{
		return {
			started: false,
			options: {
				key: 'major',
				mode: 'listen'
			},
			attempts: null,
			round: 0,
			score: null,
			highScore: null,
			rootNote: null,
			scale: [],
			step: 0,
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
				this.rootNote = null;
				this.playedNote = null;
				this.attempts = null;
			}
		},

		incrementScore(){
			this.score++;
		},
		incorrect(){
				if(this.round < 5){
					this.round++;
					this.attempts = 2;
					this.rootNote = null;
					this.scale = [];
					this.step = 0;
				}else{
					this.setGameState(false);
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
				this.rootNote = null;
			}else{
				this.setGameState(false);
			}
			
		},
		scaleToPlay() {
      this.rootNote = Math.floor(Math.random() * (11 - 1 + 1)) + 1;
			
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

	},
	getters:{
		doubleNoteScore: (state) => state.score * 2,
		nameRootNote(){
			let noteName = ['"C"', '"C#"', '"D"', '"D#"', '"E"', '"F"', '"F#"', '"G"', '"G#"', '"A"', '"A#"', '"B"'];
			return noteName[this.rootNote];
		}
	}
});