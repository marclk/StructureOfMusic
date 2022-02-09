<template>
	<section>
		<header>
			<input id="chord-1" value="1" type="radio" @change="PlaySomething" name="chord"/>1 
			<input id="chord-2" value="2" type="radio" @change="PlaySomething" name="chord"/>2 
			<input id="chord-3" value="3" type="radio" @change="PlaySomething" name="chord"/>3 
			<input id="chord-4" value="4" type="radio" @change="PlaySomething" name="chord"/>4 
			<input id="chord-5" value="5" type="radio" @change="PlaySomething" name="chord"/>5
			<input id="chord-6" value="6" type="radio" @change="PlaySomething" name="chord"/>6

			<ul>
				<li><label for="chord-1">1</label></li>
				<li><label for="chord-2">2</label></li>
				<li><label for="chord-3">3</label></li>
				<li><label for="chord-4">4</label></li>
				<li><label for="chord-5">5</label></li>
				<li><label for="chord-6">6</label></li>
			</ul>
		</header>
	</section>
</template>

<script>
	import * as Tone from 'tone';

	export default {

		data(){
			return{
			$inputs: null,
			chords: [
					'D3 F#3 A3 D4',
					'E3 G#3 B3 E4',
					'C#3 E3 G#3 C#4',
					'F#3 A3 C#4 F#3',
					'E3 A3 C#4 ' ,
					'C#3 E3 G#3' 
				].map(string => string.split(' ')),
			chordIdx: 0,
			step: 0,
			synth: new Tone.Synth(),
			gain: new Tone.Gain(0.6),
			playing: false
			}},
		methods:{
			PlaySomething(){
				if (this.playing) {
					return;
				}

				this.playing = true;

				this.synth.oscillator.type = 'sine';
				this.gain.toDestination();
				this.synth.connect(this.gain);

				this.$inputs = document.querySelectorAll('input');

				Array.from(this.$inputs).forEach($input => {
					$input.addEventListener('change', () => {
						if($input.checked) this.handleChord($input.value);
					});
				});


				Tone.Transport.scheduleRepeat(this.onRepeat, '8n');
				Tone.Transport.bpm.value = 160;
				Tone.Transport.start();

				// function onRepeat(chords, chordIdx, synth, step, time){
				// 	let chord = chords[chordIdx],
				// 			note = chord[step % 3];
				// 	synth.triggerAttackRelease(note, '8n', time);
				// 	step++;
				// }

			},
			handleChord(value){
				this.chordIdx = parseInt(value) - 1;
			},
			onRepeat(time){
				let chord = this.chords[this.chordIdx],
						note = chord[this.step % 3];
				this.synth.triggerAttackRelease(note, '8n', time);
				this.step++;
			}
		},
		created: function(){
		}
		
	}
</script>

<style lang="scss">

	header{
		overflow:hidden;
		
		input{
			position: absolute;
			// left: -9999px;
			@for $i from 1 through 6{
				&#chord-#{$i}:checked ~ ul label[for="chord-#{$i}"]{
					background: tomato;
				}
			}
		}
		ul{
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			li{
				flex: 1;
				label{
					display: block;
					cursor: pointer;
					text-align: center;
					padding: 0.5rem;
					background: black;
					color: white; 
					&:hover{
						background: rgba(0, 0, 10, 0.8)
					}
				}
			}
		}
	}

	
</style>