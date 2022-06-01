import {defineStore} from 'pinia';

export const useScoreStore = defineStore("score", {
	state: () =>{
		return {
			scores: {
				noteScore: 0,
			}
		};
	},
	actions: {
		increment(){
			this.store.scores.noteScore++;
		}
	},
	getters:{
		doubleScore: (state) => state.scores.noteScore * 2,
	}
});