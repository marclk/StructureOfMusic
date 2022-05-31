import {defineStore} from "pinia";

export const useExercisesStore = defineStore("exercises", {
	state: () =>{
		return {
			score: 0
		}
	},
	actions: {
		incrementScore(){
			this.score++;
		}
	},
	getters:{
		doubleScore: (state) => state.score * 2,
	}
});