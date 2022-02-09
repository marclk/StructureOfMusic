<template>
	<div class="column main-column is-one-fifth is-mobile neon-border" :style="{'--neon-color': this.color}" :class="{'enabled-effect': enabled, 'disabled-effect': !enabled}">
		<div class="columns">
			<div class="column is-one-fifth">
				<button id="toggle" @click="toggle()" class="button on-off-button " :class="{active: enabled, 'is-success': enabled, 'is-danger': !enabled}" >
					<span></span>
					<span></span>
				</button>
			</div>
			<div class="column auto effect-name">
				<h2 class="">{{this.name}}</h2>
			</div>
		</div>
		
		<div class="columns is-mobile">

			<app-effect-parameter 
				v-for="(parameter, index) in parameters" 
				:key="parameter" 
				:color="color"
				:name="parameters[index]"
				:valName="valueNames[index]"
				:range="ranges[index]" 
				:rangeType="rangeTypes[index]" 
				:value="effects[parameters[index]]" 
				@effectParameterPacket="onChange" 
			/>
		
		</div>
	</div>
</template>

<script>

import EffectParameter from '../synthComponents/EffectParameter';

export default {

	props: ["name", "effects", "parameters", "ranges", "rangeTypes", "color", "valueNames"],
	data(){
		return{
			enabled: false
		}
	},
	methods:{
		onChange(effectParameterPacket){
			this.enabled = true;
			let effect = this.effects[effectParameterPacket.name];

			console.log(effect, this.effects);

			if (isNaN(effect)) {
				this.effects[effectParameterPacket.name].value = effectParameterPacket.parameterValue;
			} else {
				this.effects[effectParameterPacket.name] = effectParameterPacket.parameterValue;
			}

			this.$emit('effect', this.getEffectPacket());
		},
		getEffectPacket() {
			// Effects = ToneJS object
			return {
				'enabled': this.enabled,
				'name': this.name,
				'effects': this.effects
			};
		},

		toggle(){
			if(!this.enabled){
				this.enabled = true;
				this.$emit('effect', this.getEffectPacket());
			}else{
				this.enabled = false;
				this.$emit('effect', this.getEffectPacket());
			}
		}
	},
	components:{
		appEffectParameter: EffectParameter
	},

	computed:{

	},
}
</script>

<style lang="scss">
	.input.range{
	
		background-color: rgba(18,18,18,1);

		& input[type=range]{
			width: 100%;
		}

		& > h3{
			text-align: center;
		}
	}

	.effect-name{

		margin-left: -20%!important;

		& > h2{
			text-align: center!important;
			font-weight: 700;
			color: white;
		}
	}

		#toggle{
		&.active span:first-child{display: none;}
		&:not(.active) span:last-child{display: none;}
	}

	.on-off-button{
		border-radius: 50px!important;
		border-color: black;
		background-color:grey;
		padding: 2px!important;
		color: white!important;
		height: 1rem!important;
		width: 1rem!important;
	}

	.disabled-effect{
		opacity: 0.4;
	}

	.enabled-effect{
		opacity: 1;
	}

	.neon-border{
		border: .2rem solid white;
		border-radius: 1rem;
		box-shadow:
			0 0 .5rem #fff,
			inset 0 0 .5rem #fff,
			0 0 1rem  var(--neon-color),
			inset 0 0 1rem  var(--neon-color),
			0 0 2rem  var(--neon-color),
			inset 0 0 2rem  var(--neon-color);
	}
</style>

