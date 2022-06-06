<template>
	<div class="column nested-column" >
		<div :class="'range input--control '+this.name" :name="this.name" :style="setCssVars" >
			<input 
				class="effect-range" 
				:name="this.name" 
				@input="setParameterValue($event)" 
				ref="parameter" 
				:value="this.parameterValue" 
				type="range"  
				id="parameter" 
				:min="this.minValue" 
				:max="this.range" 
				:step="this.stepSize"
			/>
			<div class="knob"></div>
		</div>
		<p>{{this.valName}}</p>
		<span v-if=" this.rangeType == 's' " id="envelope=attack-value" class="tag is-dark">{{ this.parameterValue + 's' }}</span>
		<span v-else id="envelope-slider-value" class="tag is-dark">{{ this.parameterValue }} </span>
	</div>
</template>

<script>
export default {
	props: ['value', 'name', 'range', 'rangeType', 'print', 'valName'],
	data(){
		return{
			parameterValue: null,
			parameterSuffix: '',
			stepSize: 0.001,
			minValue: 0.001,
		}
	},

	methods: {
		setParameterValue(event){
			this.$emit('effectParameterPacket', this.getParameterPacket());
			this.parameterValue = this.$refs.parameter.value;

			const knob = event.target.parentElement;

			let percentRange = ((this.parameterValue - this.minValue) * 100) / (this.range - this.minValue);
			
			console.log('Percent value: ', percentRange);

			knob.style.setProperty('--knob-position', parseInt(percentRange));
		},
		getParameterPacket() {
			return {
				'name': this.name,
				'parameterValue':  this.$refs.parameter.value + this.parameterSuffix
			};
		},

		initializeParameterValue() {
			if (isNaN(this.value)){
				this.parameterValue = this.value.value;
			} else {
				this.parameterValue = this.value;
			}
		},

		initializeRangeType() {
			this.setupStepSize(this.rangeType);
			this.setupParameterSuffix(this.rangeType);
		},

		setupStepSize(rangeType) {
			switch (rangeType) {
				case 's':
					this.stepSize = 0.001;
					this.minValue = 0.000;
					break;
				case 'freq':
					this.stepSize = 1;
					break;
				case 'time':
					this.stepSize = 4;
					this.minValue = 4;
					break;
				case 'oct':
					this.stepSize = 1;
					break;
				case 'nr':
					this.minValue = 0.000;
					break;
				default:
					this.stepSize = 0.001;
					break;
			}

			if (this.minValue === 0.001 && this.stepSize % 1 === 0) {
				this.minValue = 0;
			}
		},

		setupParameterSuffix(rangeType) {
			switch (rangeType) {
				case 'time':
					this.parameterSuffix = 'n';
					break;
				default:
					break;
			}
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
		getParameterValue(value){
			this.setOptionVal(value, this.$refs.parameter);
		}
	},
	computed: {
		getParameterValue(){
			return this.parameterValue;
		},
		setCssVars(){
			return{
				'--class-name': this.name
			}
		}
	},
	mounted(){
		this.initializeParameterValue();
		this.initializeRangeType();
		console.log("Values:" + this.parameterValue);
	}

}
</script>

<style lang="scss" scoped>
* ,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.nested-column{
	text-align: center;

	& > p{
		font-size: 12px!important;
		text-align: center;
	}
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
	
	// transform: scale(0.6);
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
  // background: hsl(260, 100%, 60%);
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


</style>