<template>
	<section>
		<div class="columns is-3">
			<div class="column is-one-third neon-border margin-right-1-rem">
				<section>
					<div class="field field--transform-scale">
						<label for="synth-type" class="label">Synth Type</label>
						<span class="custom-dropdown">
							<select name="synthType" ref="synthType" @change="update('synthType')" id="synth-type">
								<option value="Synth" >Synth</option>
								<option value="AMSynth">AM Synth</option>
								<option value="FMSynth">FM Synth</option>
							</select>
						</span>
					</div>
					<hr>
					<div class="field field--transform-scale">
						<label for="oscillator-type" class="label">Oscillator</label>
						<span class="custom-dropdown">
							<select name="oscillator-type" ref="oscillatorType" @change="update('oscType')" id="oscillator-type">
								<option value="triangle" selected> Triangle </option>
								<option value="sine"> Sine </option>
								<option value="sawtooth"> Sawtooth </option>
								<option value="square"> Square </option>
								<option value="pulse"> Pulse </option>
							</select>
						</span>
					</div>
					<div class="field field--transform-scale">
						<label for="oscillator-partials" class="label">Partial</label>
						<span class="custom-dropdown">
							<select name="oscillator-partials" ref="oscillatorPartial" :disabled="isDisabled" @change="update('oscPart')" id="oscillator-partials">
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
				</section>
			</div>
			<div class="column neon-border margin-left-1-rem">
				<section>
					<app-envelope-slider 
						name="attack" 	
						range="2"	
						rangeType="s"
						v-model="envelopeValues.attack"/>
					<app-envelope-slider 
						name="decay"  	
						range="2" 
						rangeType="s" 
						v-model="envelopeValues.decay"/>
					<app-envelope-slider 
						name="sustain" 
						range="1" 
						rangeType="nR" 
						v-model="envelopeValues.sustain"/>
					<app-envelope-slider 
						name="release" 
						range="5" 
						rangeType="s" 
						v-model="envelopeValues.release"/>
				</section>
			</div>
		</div>
	</section>
</template>

<script>
import * as Tone from 'tone';

import EnvelopeSlider from '../synthComponents/EnvelopeSlider.vue';

export default {
	props: ['effect', 'effectPacket', 'generalOptionsPacket'],
	data(){
		return{
			synth: null,
			oscillatorType: null,
			oscillatorPartial: null,
			oscillator: null,
			isDisabled: false,
			isRunning: false,
			audioPlayer: null,
			recordDest: null,
			initBool: false,
			metronomeBool: null,
			activeEffects: {},
			chunks: [],
			generalOptions: {
				lowpass: null,
				highpass: null,
				volume: null,
			},
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
		init(){
			let settings = this.getDefaultSettings["Synth"];
			let newSynth = new Tone.PolySynth(Tone["Synth"],(settings));
			
			this.synth = newSynth;

			console.log(this.synth);
			
			this.generalOptions.lowpass = this.generalOptionsPacket.filter.lowpass;
			this.generalOptions.highpass = this.generalOptionsPacket.filter.highpass;
			this.generalOptions.volume = this.generalOptionsPacket.volume;

			this.recordDest = this.generalOptionsPacket.destination;

			this.oscillatorType = "triangle";
			this.oscillatorPartial = "none";

			this.synth.connect(this.generalOptions.lowpass);
			this.generalOptions.lowpass.connect(this.generalOptions.highpass);
			this.generalOptions.highpass.connect(this.generalOptions.volume);

			this.generalOptions.volume.toDestination();		
				
			console.log("BPM: ",Tone.Transport.bpm.value);
		},

		play(input, octave, value){
			const tones = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map(n => `${n}` + octave);
			let note = input % 12;
			
			if(value >= 1) this.synth.triggerAttack(tones[note]);
			else this.synth.triggerRelease(tones[note]);

			console.log("PLAY SYNTH VAL ATTACK: ", this.synth.options.envelope.attack, "ENVELOPEVALUE ATTACK: ", this.envelopeValues.attack);
			
		},
		handleVolume(value){
			let volume = this.generalOptionsPacket.volume;
			let val = value / 127 * 0.8;

			volume.gain.value = val;
		},

		handleLowpassFilter(value){
			let lowpass = this.generalOptionsPacket.filter.lowpass;
			let val = value / 127 * 14800 + 200;

			lowpass.frequency.value = val;
		},

		handleHighpassFilter(value){
			let highpass = this.generalOptionsPacket.filter.highpass;
			let val = value / 127 * 14800 + 200;

			highpass.frequency.value = val;
		},

		//Call all update functions for Synth, OscillatorType & OscillatorPartial when values change
		update(source){
			this._updateSynthType(this.$refs.synthType.value);
			this._updateOscillatorType(this.$refs.oscillatorType.value);
			this._updateOscillatorPartial(this.$refs.oscillatorPartial.value);

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
				this.synth.disconnect(this.generalOptions.lowpass);
				this.synth.dispose();
			}
		
			// The new synth
			let settings = this.getDefaultSettings[synthType] || {};
			let newSynth = new Tone.PolySynth(Tone[synthType],(settings));

			this.synth = newSynth;
			this.synth.connect(this.generalOptions.lowpass);

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
				this.synth.options.oscillator.type = this.oscillator;

			}else{
				if(this.isDisabled){
					!this.isDisabled;
					
				}
				//combine oscillatorType and oscillatorPartial together
				this.oscillator = oscillatorType + oscillatorPartial;
				this.synth.options.oscillator.type = this.oscillator;

			}
		},
		//watch if the values in envelopeValues changes
		attack(value){
			this.synth.options.envelope.attack = value;
			console.log("synth val: ", this.synth.options.envelope.attack, "val: ", value);
		},

		decay(value){
			this.synth.options.envelope.decay = value;
			console.log("synth val: ", this.synth.options.envelope.decay, "val: ", value);
		},

		sustain(value){
			this.synth.options.envelope.sustain = value;
			console.log("synth val: ", this.synth.options.envelope.sustain, "val: ", value);
		},
		
		release(value){
			this.synth.options.envelope.release = value;
			console.log("synth val: ", this.synth.options.envelope.release, "val: ", value);
		},

		effectPacket(effectPacket){
			console.log(effectPacket);
			let allEffects = this.effect;
			for (let effectName in allEffects) {
				if (effectPacket.name == effectName) {
					if (effectPacket.enabled) {
						if (!(effectName in this.activeEffects)) {
							this.activeEffects[effectName] = allEffects[effectName];
						}
					} else {
						delete this.activeEffects[effectName];
					}
				}
			}

			console.log('Active effects', ...Object.values(this.activeEffects));

			if (this.activeEffects.length !== 0) {
				Tone.Destination.chain(...Object.values(this.activeEffects));
			}else{
				Tone.Destination.chain();
			}
		},

		generalOptionsPacket(generalOptionsPacket){
			console.log(generalOptionsPacket);

			let recordOn = generalOptionsPacket.recordOn;
			let recorder = generalOptionsPacket.recorder;

			this.metronomeBool = generalOptionsPacket.metronomeOn;

			this.audioPlayer = document.querySelector('audio');

			if(generalOptionsPacket !== null && this.initBool == false){
				this.init();
				this.initBool = true;
				console.log("initialized!");
			}

			// if(this.metronomeBool){
			// 	console.log("Metro On!");
			// 	this.toggleMetronome(this.metronomeBool);
			// }else{
			// 	console.log("Metro Off!");
			// }

			if(recordOn){
				console.log("Recording On!");
				this.isRunning = true;
				Tone.Destination.connect(this.recordDest);
				recorder.start();
			}else if(!recordOn && this.isRunning == true){
				setTimeout(() => {
					recorder.stop();
				}, 1000);
				
				this.isRunning == false;
			}
			recorder.ondataavailable = (evt) => this.chunks.push(evt.data);
			recorder.onstop = evt => {
				let blob = new Blob(this.chunks, { 'type': 'audio/wav;codecs=pcm' });
				this.audioPlayer.src = URL.createObjectURL(blob);
				this.chunks = [];
				
			}
		},
		// metronomeOn(bool){
		// 	console.log("WHAT?");
		// 	this.toggleMetronome(bool);
		// }
	},
	computed: {
		// metronomeOn(){
		// 	return this.metronomeBool;
		// }

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
	}
}
</script>

<style lang="scss" scoped>

.column{
	&> section{
		&> .field--transform-scale{
			transform: scale(0.9);
		}
		&> .field--transform-scale-translate{
			transform: scale(0.9) translate(-20px);
		}
	} 
}

.neon-border{
	border: .2rem solid white;
	border-radius: 1rem;
	box-shadow:
		0 0 .5rem #fff,
		inset 0 0 .5rem #fff,
		0 0 1rem  #08f,
		inset 0 0 1rem  #08f,
		0 0 2rem  #08f,
		inset 0 0 2rem  #08f;
	
	margin: 2rem 0 2.5rem 0;
}

.custom-dropdown{
	position: relative;

	& select{
		background-color: rgba(0,0,0,0);
		border: .2rem solid white;
		border-radius: .5rem;
		width: 100%;
		color: White;
		font-family: monospace;
		padding: .5rem;
		box-shadow:
			0 0 .25rem #fff,
			inset 0 0 .25rem #fff,
			0 0 .5rem  hsl(260, 100%, 40%),
			inset 0 0 .5rem  hsl(260, 100%, 40%),
			0 0 1rem  hsl(260, 100%, 40%),
			inset 0 0 1rem  hsl(260, 100%, 40%);
		
		& >option{
			color: black;
		}
	}
}

hr{
	border: .1rem solid white;
	border-radius: .5rem;
	box-shadow:
		0 0 .25rem #fff,
		inset 0 0 .25rem #fff,
		0 0 1rem #08f,
		inset 0 0 1rem  #08f,
		0 0 2rem #08f,
		inset 0 0 2rem  #08f;
}

.label{
	color:white;
}

.margin-left-1-rem{
	margin-left: 1rem;
}

.margin-right-1-rem{
	margin-right: 1rem;
}
</style>