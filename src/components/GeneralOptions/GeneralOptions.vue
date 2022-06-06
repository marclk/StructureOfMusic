<template>
	<div class="columns options neon-border ">
		<div class="column options--filter">
			<div class="columns">
				<div class="column">
					<div class="input--control input--control--volume">
						<input 
							@input="onChange($event)" 
							type="range" 
							name="volume" 
							id="js--volume" 
							ref="volume"
							min="0"
							max="1"
							step="0.01"
							v-model="volume.gain.value">
						<div class="knob"></div>
					</div>
					<h2>Volume</h2>
				</div>
				<div class="column options--filter-lowpass">
					<div class="input--control">
						<input 
							@input="onChange($event)" 
							type="range" 
							name="lowpass" 
							id="js--lowpass" 
							ref="lowpass"
							min="0"
							max="15000"
							step="1"
							v-model="filter.lowpass.frequency.value">
						<div class="knob"></div>
					</div>
					<h2>Lowpass</h2>
				</div>
				<div class="column options--filter-highpass">
					<div class="input--control">
						<input 
							@input="onChange($event)" 
							type="range" 
							name="highpass" 
							id="js--highpass" 
							ref="highpass"
							min="0"
							max="15000"
							step="1"
							v-model="filter.highpass.frequency.value">
						<div class="knob"></div>
					</div>
					<h2>Highpass</h2>	
				</div>
			</div>
		</div>
		<div class="column options--logo">
			<h1>SynthSoul</h1>
		</div>
		<div class="column options--timing">
			<div class="columns options--timing--columns" >
				<!-- Recording -->
				<div class="column options--timing--columns--record">
					<button 
						id="record-btn" 
						class="button options--timing--columns--record--btn " 
						@click="toggleRecording()" 
						:class="{active: recordOn, 'is-danger': recordOn, '': !recordOn} ">
						</button>
					<label for="record-btn">Record</label>
				</div>
				<div class="column">
					<audio controls id="recording-playback"></audio>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as Tone from 'tone';

import * as pureknob from '../../assets/pure-knob-master/pureknob.js';
import { log } from 'tone/build/esm/core/util/Debug';

export default {
	data(){
		return{
				filter: {
					lowpass: new Tone.Filter(10000, "lowpass"),
					highpass: new Tone.Filter(30, "highpass")
				},
				volume: new Tone.Gain(),
				meter: null,
				bpm: null,
				actx: null,
				dest: null,
				recorder: null,
				player: null,
				metronomeOn: false,
				recordOn: false,
		}
	},
	methods:{
		onChange(event){
			this.$emit('options', this.getGeneralOptionsPacket());
			
			let parameterValue = parseFloat(event.target.value);
			let min = parseFloat(event.target.min);
			let max = parseFloat(event.target.max);
			const knob = event.target.parentElement;
			let percentRange = ((parameterValue - min) * 100.0) / (max - min);

			knob.style.setProperty('--knob-position', parseInt(percentRange));
		},

		initializeGeneralOptions(){
				this.filter.lowpass = new Tone.Filter(10000, "lowpass");
				this.filter.highpass = new Tone.Filter(30, "highpass");
				this.bpm = 120;
				Tone.Transport.bpm.value = this.bpm;
				this.volume = new Tone.Gain();
				this.volume.gain.value = 0.6;
				this.actx = Tone.context;
				this.dest = this.actx.createMediaStreamDestination();
				this.recorder = new MediaRecorder(this.dest.stream);
				this.player = new Tone.Player("../../assets/sound/metronome.wav").toDestination();

				this.$emit('options', this.getGeneralOptionsPacket());
			},

      getGeneralOptionsPacket(){
        return{
          'filter': this.filter,
					'volume': this.volume,
					'bpm': this.bpm,
					'context': this.actx,
					'destination': this.dest,
					'recorder': this.recorder,
					'recordOn': this.recordOn,
					'metronomeOn': this.metronomeOn
        }
			},

			toggleRecording(){	
				if(!this.recordOn){
					this.recordOn = true;
				}else{
					this.recordOn = false;
				}
				this.$emit('options', this.getGeneralOptionsPacket());
			},

			toggleMetronome(){
				if(!this.metronomeOn){
					this.metronomeOn = true;
				}else{
					this.metronomeOn = false;
				}
				this.$emit('options', this.getGeneralOptionsPacket());
			},

			start(){
				Tone.Transport.start();
			},
			stop(){
				Tone.Transport.stop();
			},

			setOptionVal(value, refs){
				let parameterValue = parseFloat(value);
				const knob = refs.parentElement;
				let min = parseFloat(refs.min);
				let max = parseFloat(refs.max);
				
				let percentRange = ((parameterValue - min) * 100.0) / (max - min);

				knob.style.setProperty('--knob-position', parseInt(percentRange));
			}
	},

	watch: {
		bpm(value){
			console.log(value);
			Tone.Transport.bpm.value = value;
		},

		volumeVal(value){

			this.setOptionVal(value, this.$refs.volume);

		},

		lowpassVal(value){
			
			this.setOptionVal(value, this.$refs.lowpass);

		},

		highpassVal(value){

			this.setOptionVal(value, this.$refs.highpass);

		}
	},
	computed:{
		volumeVal(){
			return this.volume.gain.value;
		},
		lowpassVal(){
			return this.filter.lowpass.frequency.value;
		},
		highpassVal(){
			return this.filter.highpass.frequency.value;
		}
	},
	created(){
		this.initializeGeneralOptions();
	}
}
</script>

<style lang="scss" scoped>
	.column{
		& > h2{
			text-align: center;
		}
	}

	.options{
		&--timing{
			&--columns{
				align-items: center;
				&--record{
					text-align: center;;
					&--btn{
						border-radius: 50px!important;
						border-color: black;
						background-color:grey;
						padding: 2px!important;
						color: white!important;
						height: 1rem!important;
						width: 1rem!important;
						margin: 10% 10% 0% 10%!important;
					}
				}
				&--metronome{
					text-align: center;
					&--btn{
						width: 2.5rem;
						height: 2.5rem;
						padding: 10%;
						&--icon{
							width: 100%;
						}
					}
				}
				&--bpm{
					text-align: center;
				}
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
	}

	.input--control {
		--knob-position: 100;
		--knob-range: 280deg;
		--side: hsl(260, 100%, 40%);
		position: relative;
		width: 3rem;
		height: 3rem;
		margin: 0 auto;
		filter: brightness(calc(var(--knob-position) * 1% + 50%));
		border-radius: 50%;
		box-shadow:
				0 0 .5rem #fff,
				inset 0 0 .5rem #fff,
				0 0 1rem  var(--side),
				inset 0 0 1rem  var(--side),
				0 0 2rem  var(--side),
				inset 0 0 2rem  var(--side);

		&--volume{
			box-shadow:
				0 0 .5rem #fff,
				inset 0 0 .5rem #fff,
				0 0 1rem  #39ff14,
				inset 0 0 1rem  #39ff14,
				0 0 2rem  #39ff14,
				inset 0 0 2rem  #39ff14!important;
	
		}
  /* Value Counter */
  &::after {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    counter-reset: knobPosition var(--knob-position);
    content: counter(knobPosition);
    font-family: monospace;
    font-size: .7em;
    color: white;
    pointer-events: none;
  }
}

.knob,
input[type=range],
.input--control::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.knob {
  --knob-rotation: calc(var(--knob-position) / 100 * var(--knob-range));
  transform: rotate(calc(var(--knob-rotation) - (var(--knob-range) / 2)));
  transition: 0.07s;

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 10%;
    left: 50%;
    width: 10%;
    height: 20%;
    background: hsl(260, 100%, 80%);
    transform: translateX(-50%);
  }
}

input[type=range] {
  appearance: none;
  -webkit-appearance: none;
  opacity: 0;
  z-index: 2;
  transform: rotate(-65deg);
	
}

h1 {
	--neon-text-color: #ff0000;
	font-family: monospace!important;
  font-size: 3rem;
  font-weight: 500;
	text-align: center;
  font-style: italic;
  color: rgba(255,255,255,0.8);
  border-radius: 2rem;
  text-transform: uppercase;
  animation: flicker 1.5s infinite alternate;     
}

@keyframes flicker {  
	0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
		
			text-shadow:
					-0.2rem -0.2rem .8rem rgba(255,255,255,0.6),
					0.1rem 0.1rem .8rem rgba(255,255,255,0.6),
					0 0 1rem var(--neon-text-color),
					0 0 2rem var(--neon-text-color),
					0 0 3rem var(--neon-text-color),
					0 0 4rem var(--neon-text-color);
			
			box-shadow:
					0 0 .5rem #fff,
					inset 0 0 .5rem #fff,
					0 0 2rem var(--neon-border-color),
					inset 0 0 2rem var(--neon-border-color),
					0 0 4rem var(--neon-border-color),
					inset 0 0 4rem var(--neon-border-color);        
	}
	
	20%, 24%, 55% {        
			text-shadow: none;
			box-shadow: none;
	}    
}
</style>