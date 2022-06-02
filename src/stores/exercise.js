import {defineStore} from 'pinia';

export const useExerciseStore = defineStore("exercise", {
	state: () =>{
		return {
			notes:{
				started: false,
				attempts: null,
				round: 0,
				score: null,
				highScore: null,
				noteToPlay: null,
				playedNote: null,
			},
		};
	},
	actions: {
		setGameState(gameState){
			this.notes.started = gameState;
			if(gameState){
				console.log("game Started!")
				this.notes.round = 1;
				this.notes.score = 0;
				this.notes.attempts = 2;
			}else{
				this.notes.round = 0;
				this.notes.score = null;
				this.notes.noteToPlay = null;
				this.notes.playedNote = null;
				this.notes.attempts = null;
			}
		},

		incrementScore(){
			this.notes.score++;
		},
		incorrect(){
			if(this.notes.attempts > 1){
				this.notes.attempts--;
			}else{
				if(this.notes.round < 12){
					this.notes.round++;
					this.notes.attempts = 2;
					this.notes.noteToPlay = null;
				}else{
					this.setGameState(false);
				}
			}
		},
		correct(){
			this.notes.score++;
			if(this.notes.score > this.notes.highScore){
				this.notes.highScore = this.notes.score;
			}

			if(this.notes.round < 12){
				this.notes.round++;
				this.notes.attempts = 2;
				this.notes.noteToPlay = null;
			}else{
				this.setGameState(false);
			}
			
			
		},
		noteToPlay(randomNote){
			console.log("Note set: " + randomNote);
			this.notes.noteToPlay = randomNote;
		},
		playedNote(note){
			this.notes.playedNote = note;
		}
			


	},
	getters:{
		doubleNoteScore: (state) => state.notes.score * 2,
	}
});