<template>
	<div class="field field--transform-scale-translate " id="envelope-settings">
		<label :for="'envelope-slider-'+this.name" class="label">{{ this.name }}</label>
		<div class="control">
			<ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>   
    </ul> 
			<input :id="'envelope-slider-'+this.name" ref="slider" @input="setSliderValue()" class="slider" :value="this.value" type="range" min="0" :max="this.range" step="0.001"/>
			<div class="knob"></div>
		</div>
		<div class="control control--tag">
			<span v-if=" this.rangeType == 's' " id="envelope=attack-value" class="tag is-dark">{{ this.value + 's' }} </span>
			<span v-else id="envelope-slider-value" class="tag is-dark">{{ this.value }} </span>
		</div>
	</div>
</template>

<script>
export default {
	
	props: ["value", "name", "range", "rangeType"],

	data(){
		return{
			sliderValue: 0.005
		}
	},
	methods: {
		setSliderValue(){
			this.$emit('input', this.$refs.slider.value);
			this.sliderValue = this.$refs.slider.value;
		}
	},
	computed: {
		getSliderValue(){
			return this.sliderValue;
		}
	}
}
</script>

<style lang="scss" scoped>
	ul {
    bottom: -21rem;
    list-style: none;
    left: 25rem; 
    margin: 0;
    padding: 0;
    position: absolute;
		z-index: 0;
    transform: rotate(270deg);
		
		li {
			border-bottom: 0.1rem solid rgba(white,0.2);
			box-shadow: 0 -0.1rem 0.1rem -0.15rem rgba(black,0.3);
			height: 3rem;
			width: 3rem;
    }
	}

	.control--tag{
		z-index: -99;
	}

	.label{
		color:white;
	}

	.slider{
		bottom: -0.5rem;
		left: -3.5rem;
		position: absolute; 
		transform: translate(10rem); 
	}

	input[type=range] {
		appearance: none !important;
		background: #1f1f1f;
		border-radius: 1rem;
		box-shadow: inset 0.1rem -0.1rem 0.1rem rgba(black,0.5),
			inset -0.1rem 0.1rem 0.1rem rgba(white,0.5);
		height: 1rem;
		width: 43rem;
	}

	input[type=range].slider::-webkit-slider-thumb { 
		-webkit-appearance: none !important;
		background-color: #272b2c;
		box-shadow: 
			inset -0.5rem 0 0.6rem -0.4rem rgba(white,0.4),
			inset 0.5rem 0 0.6rem -0.4rem rgba(white,0.4),
			0 0 0.5rem rgba(black,0.4), 0.5rem 0 0.5rem rgba(black,0.3);
		cursor: row-resize;
		height: 3rem;
		width: 2rem;
		z-index: 10;
	}  
</style>