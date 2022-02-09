<template>
	<section>
		
		<!-- 
			TODO: Maak een column row met Bulma Classes voor 5 effects 
						Maak eerst voor reverb een column en design basic layout
						
						Hou in mind dat er nog meer effects kunnen worden toegevoegd
						denk na of er aparte template components moeten komen per effect
		-->

		<div class="columns">
			<app-effect 
			name="Distortion" 
			@effect="updateEffect"
			:effects="effects.Distortion" 		
			:parameters="['distortion', 'wet']" 
			:ranges="['1', '1']" 
			:rangeTypes="['nr', 'nr']"
			color="#FF0000"
			:valueNames="['dist', 'wet']" 
			v-model="effects.Distortion"/>

			<app-effect 
			name="Vibrato" 					
			@effect="updateEffect"
			:effects="effects.Vibrato" 			
			:parameters="['frequency', 'depth', 'wet']" 
			:ranges="['5', '1', '1']" 
			:rangeTypes="['freq', 'nr', 'nr']"
			color="#1b03a3"
			:valueNames="['freq', 'depth', 'wet']" 
			v-model="effects.Vibrato"/>

			<app-effect 
			name="Phaser"  		
			@effect="updateEffect"
			:effects="effects.Phaser" 				
			:parameters="['frequency', 'octaves', 'baseFrequency']" 
			:ranges="['25', '10', '2000']" 
			:rangeTypes="['freq', 'oct', 'freq']" 
			color="#01FFC3"
			:valueNames="['freq', 'oct', 'baseFreq']"
			v-model="effects.Phaser"/>

			<app-effect 
			name="Reverb" 		
			@effect="updateEffect"
			:effects="effects.Reverb"				
			:parameters="['decay','preDelay', 'wet']" 
			:ranges="['5', '0.25', '1']" 
			:rangeTypes="['s','s', 'nr']"
			color="#8A2BE2"
			:valueNames="['decay', 'preDelay', 'wet']" 
			v-model="effects.Reverb"/>

			<app-effect 
			name="PingPongDelay"
			@effect="updateEffect"
			:effects="effects.PingPongDelay" 
			:parameters="['delayTime', 'feedback', 'wet']" 
			:ranges="['32', '1', '1']"
			:rangeTypes="['time', 'nr', 'nr']"
			color="#B8FB3C"
			:valueNames="['delayTime', 'feedback', 'wet']" 
			v-model="effects.PingPongDelay"/>
		</div>
	</section>
</template>

<script>
import * as Tone from 'tone';

import Effect from '../synthComponents/Effect'

import 'precision-inputs/css/precision-inputs.fl-controls.css';
import 'precision-inputs/scripts/precision-inputs.fl-controls.js';

export default {
	data(){
		return{
			effects:{
				PingPongDelay: null,
				Reverb: null,
				Phaser: null,
				Vibrato: null,
				Distortion: null
			}
		}
	},
	components: {
		appEffect: Effect
	},
	methods:{
		init(){
			this.effects.Reverb = new Tone.Reverb({
				decay: 0.4,
				preDelay: 0.001,
				wet: 0.5
			});
			
			this.effects.PingPongDelay = new Tone.PingPongDelay({
				delayTime: 4,
				feedback: 0.6,
				wet: 0.5
			});

			this.effects.Phaser = new Tone.Phaser({
				frequency: 15,
				octaves: 5,
				baseFrequency: 1000
			});

			this.effects.Vibrato = new Tone.Vibrato({
				frequency: 5,
				depth: 0.2,
				wet: 0.5
			});

			this.effects.Distortion = new Tone.Distortion({
				distortion: 0.2,
				wet: 0.2
			});
		},

		setEffect(value, effectName){
			console.log("Effect Name: ", effectName);
			console.log("Effect value: ", value);
			this.$emit('initializeEffects', this.effects, effectName);
		},

		updateEffect(effectPacket) {
			console.log('i made it');
			console.log(effectPacket);
			this.$emit('initializeEffects', this.effects, effectPacket);
		}
	},
	created(){
		this.init();
	}
}
</script>

<style lang="scss">

.column.main-column.is-one-fifth.is-mobile.neon-border.disabled-effect {
    transform: scale(0.95);
}

.column.main-column.is-one-fifth.is-mobile.neon-border {
    transform: scale(0.97);
}

.main-column{

	& > h2{
		text-align: center;
		font-weight: 700;
		font-size: 18px;
		width: 100%;
	}
}

</style>

