<template>
	<section>
		<div>
			<div>
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				</div>
				<div>
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				</div>
				<div>
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
				<input type="checkbox">
			</div>	
		</div>
		<button @click="PlaySequencer()">Start Sequence</button>
	</section>
</template>

<script>
	import * as Tone from 'tone';

	export default {

		data() {
			return{
				isPlaying: false
			}
		},
		methods:{

			PlaySequencer(){
				if(this.isPlaying){
					return;
				}

				this.isPlaying = true;
				
				const synths = [
					new Tone.Synth(),
					new Tone.Synth(),
					new Tone.Synth()
				];

				synths[0].oscillator.type = 'triangle';
				synths[1].oscillator.type = 'sine';
				synths[2].oscillator.type = 'sawtooth';

				const gain = new Tone.Gain(0.1);
				gain.toDestination();

				synths.forEach(synth => synth.connect(gain));

				const $rows = document.body.querySelectorAll('div > div'),
							notes = ['G5', 'E4', 'C3'];
				let index = 0;

				Tone.Transport.scheduleRepeat(repeat, '8n');
				Tone.Transport.start();

				function repeat(time){
					let step = index % 8;
					for (let i = 0; i < $rows.length; i++){
						let synth = synths[i],
								note = notes[i],
								$row = $rows[i],
								$input = $row.querySelector(`input:nth-child(${step+1})`);
								if($input.checked) synth.triggerAttackRelease(note, '8n', time);
								console.log(i + synth.oscillator.type);
					}
					index++;
				}

			},
		StopSequence(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	section{
		text-align: center;
	}

	div {
		text-align: center;
		margin-top: 4rem;
		> div{
			+ div{
					margin-top: 1rem;
			}
		}
		button{
			
			margin-top: 2rem;
		}
	}
</style>