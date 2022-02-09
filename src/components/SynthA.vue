<template>
	<section>
		<div class="field">
			<label for="synth-type" class="label">Synth Type</label>
			<span class="select is-fullwidth">
				<select name="synthType" ref="synthType" @change="update()" id="synth-type">
					<option value="Synth" >Synth</option>
					<option value="AMSynth">AM Synth</option>
					<option value="FMSynth">FM Synth</option>
				</select>
			</span>
		</div>
		<hr>
		<div class="field">
			<label for="oscillator-type" class="label">Oscillator</label>
			<span class="select is-fullwidth">
				<select name="oscillator-type" ref="oscillatorType" @change="update()" id="oscillator-type">
					<option value="triangle" selected> Triangle </option>
					<option value="sine"> Sine </option>
					<option value="sawtooth"> Sawtooth </option>
					<option value="square"> Square </option>
					<option value="pulse"> Pulse </option>
				</select>
			</span>
		</div>
		<div class="field">
			<label for="oscillator-partials" class="label">Partial</label>
			<span class="select is-fullwidth">
				<select name="oscillator-partials" ref="oscillatorPartial" :disabled="isDisabled" @change="update()" id="oscillator-partials">
					<option value="none"> none </option>
					<option value="2"> 2 </option>
					<option value="4"> 4 </option>
					<option value="8"> 8 </option>
					<option value="16"> 16 </option>
					<option value="32"> 32 </option>
					<option value="64"> 64 </option>
				</select>
			</span>
		</div>
		<hr>
		<app-envelope-slider 
			name="attack" 	
			range="2"	
			rangeType="s" 
			:value="envelopeValues.attack" 
			v-model="envelopeValues.attack"/>
		<app-envelope-slider 
			name="decay"  	
			range="2" 
			rangeType="s" 
			:value="envelopeValues.decay" 
			v-model="envelopeValues.decay"/>
		<app-envelope-slider 
			name="sustain" 
			range="1" 
			rangeType="nR" 
			:value="envelopeValues.sustain" 
			v-model="envelopeValues.sustain"/>
		<app-envelope-slider 
			name="release" 
			range="5" 
			rangeType="s" 
			:value="envelopeValues.release" 
			v-model="envelopeValues.release"/>
		
		<br><br>
		<button id="toggle" @click="toggle()" class="button" :class="{active: isActive, 'is-danger': isActive, 'is-success': !isActive} ">
			<span>Play da synth man</span>
			<span>Stop da synth man</span>
		</button>
	</section>
</template>

<script>
import * as Tone from 'tone';

import EnvelopeSlider from '../components/synthComponents/EnvelopeSlider.vue';

export default {
	data(){
		return{
			isPlaying: false,
			synth: null,
			filter: new Tone.Filter(),
			volume: new Tone.Gain(),
			oscillatorType: null,
			oscillatorPartial: null,
			oscillator: null,
			isDisabled: false,
			tick: 0,
			isActive: false,
			envelopeValues: {
				attack: 0.005,
				decay: 0.1,
				sustain: 0.3,
				release: 0.5
			}
		}
	},
	components: {
		appEnvelopeSlider: EnvelopeSlider
	},
	methods: {
		//initialize the main synth
		init(){
			let settings = this.getDefaultSettings["Synth"] || {};
			let newSynth = new Tone["Synth"](settings);

			this.synth = newSynth;

			console.log(this.synth);
			
			this.synth.connect(this.filter);
			this.filter.connect(this.volume)

			this.oscillatorType = "triangle";
			this.oscillatorPartial = "none";

			this.filter.frequency.value = 15000;//200 - 15000
			this.volume.gain.value = 0.8; //0-0.8
			
			this.volume.toDestination();

			this.initializeTransport(); 
		},
		//Turn the synth on / off
		toggle(){
			this.isPlaying = !this.isPlaying;
			if(this.isPlaying){
				this.isActive = true;
				Tone.start();
				Tone.Transport.start();
			}else{
				this.isActive = false;
				Tone.Transport.stop();
			}
		},
		
		//Call all update functions for Synth, OscillatorType & OscillatorPartial when values change
		update(){
			this._updateSynthType(this.$refs.synthType.value);
			this._updateOscillatorType(this.$refs.oscillatorType.value);
			this._updateOscillatorPartial(this.$refs.oscillatorPartial.value);

		},
		
		//Set up the default tone
		initializeTransport(){
			let notes = "CDEFGAB".split('').map(n=> `${n}4`);
			Tone.Transport.scheduleRepeat(time =>{
				let note = notes[this.tick * 2 % notes.length];
				if(this.synth)this.synth.triggerAttackRelease(note, '8n', time);
				this.tick++;
			}, '4n');
			
		},

		//Update the synth when it changes
		_updateSynthType(synthType){

			//Check if the synth actually changes, if not then return
			if (
				this.synth !== undefined &&
				this.synth.name === synthType
			) {
				return;
			}
		
		//if a synth has already been defined
			if(this.synth){
				this.synth.disconnect(this.filter);
				this.synth.dispose();
			}
		
			// The new synth
			let settings = this.getDefaultSettings[synthType] || {};
			let newSynth = new Tone[synthType](settings);

			this.synth = newSynth;
			this.synth.connect(this.filter);

			//Set the default envelope settings for getDefaultSettings()
			this.envelopeValues.attack = settings.envelope.attack;
			this.envelopeValues.decay = settings.envelope.decay;
			this.envelopeValues.sustain = settings.envelope.sustain;
			this.envelopeValues.release = settings.envelope.release;

		},
		//Set the new oscillatorType
		_updateOscillatorType(oscillatorType){
			this.oscillatorType = oscillatorType;
		},
		//Set the new oscillatorPartial
		_updateOscillatorPartial(oscillatorPartial){
			this.oscillatorPartial = oscillatorPartial;

		},

		//User Input here
		play(input, octave, value){
			const tones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map(n => `${n}` + octave);
			let note = input % 12;
			
			if(value >= 1) this.synth.triggerAttack(tones[note]);
			else this.synth.triggerRelease();
			
		},
		handleVolume(value){
			let val = value / 127 * 0.8;
			this.volume.gain.value = val;
		},

		handleFilter(value){
			let val = value / 127 * 14800 + 200;
			this.filter.frequency.value = val;
		}


	},
	watch: {
		//watch if either OscillatorType and/or OscillatorPartial change
		oscTypeAndOscPartial(value){
			const [oscillatorType, oscillatorPartial] = value.split('|');

			//disable OscillatorPartial input if Type is Pulse
			if(oscillatorType == 'pulse'){
				this.isDisabled = true;
			}else{
				this.isDisabled = false;
			}
			//if oscillatorpartial is none or type is pulse, ignore partial
			if(oscillatorPartial == 'none' || oscillatorType == 'pulse'){
				this.oscillator = oscillatorType;
				this.synth.oscillator.type = this.oscillator;

			}else{
				if(this.isDisabled){
					!this.isDisabled;
					
				}
				//combine oscillatorType and oscillatorPartial together
				this.oscillator = oscillatorType + oscillatorPartial;
				this.synth.oscillator.type = this.oscillator;

			}
		},
		//watch if the values in envelopeValues changes
		attack(value){
			this.synth.envelope.attack = value;
		},

		decay(value){
			this.synth.envelope.decay = value;
		},

		sustain(value){
			this.synth.envelope.sustain = value;
		},
		
		release(value){
			this.synth.envelope.release = value;
		}
	},

	computed: {
		//define the envelopeValues to computed values
		
		oscTypeAndOscPartial(){
			return `${this.oscillatorType}|${this.oscillatorPartial}`;
		},
		
		attack(){
			return this.envelopeValues.attack;
		},

		decay(){
			return this.envelopeValues.decay;
		},

		sustain(){
			return this.envelopeValues.sustain;
		},

		release(){
			return this.envelopeValues.release;
		},
		
		//define the default settings for synths
		getDefaultSettings(){
			return{
				Synth:{
					oscillator: {type: 'triangle'},
					envelope: {
						attack	: 0.005,
						decay		: 0.1,
						sustain	: 0.3,
						release	: 1
					}
				},
				FMSynth: {
					harmonicity	: 3,
					modulationIndex	: 10,
					detune	: 0,
					oscillator	: {
						type: 'sine'
					},
					envelope: {
						attack	: 0.01,
						decay		: 0.01,
						sustain	: 1,
						release	: 0.5
					},
					modulation	: {
						type	: 'square'
					},
					modulationEnvelope	: {
						attack	: 0.5,
						decay		: 0,
						sustain	: 1,
						release	: 0.5	
					}
				},
				AMSynth:	{
					harmonicity	: 3,
					detune	: 0,
					oscillator	: {
						type: 'sine'
					},
					envelope: {
						attack	: 0.01,
						decay		: 0.01,
						sustain	: 1,
						release	: 0.5
					},
					modulation	: {
						type	: 'square'
					},
					modulationEnvelope	: {
						attack	: 0.5,
						decay		: 0,
						sustain	: 1,
						release	: 0.5	
					}
				}
			}
		}
	},
	mounted(){
		this.init(); 
	}
}
</script>

<style lang="scss" scope
	d>

	body{
		padding: 1rem;
	}


	#toggle{
		&.active span:first-child{display: none;}
		&:not(.active) span:last-child{display: none;}
	}

	.button{
		border-radius: 5px;
		border-color: black; 
		background-color:grey;
		padding: 5px;
		color: white!important;
		
	}

</style>



