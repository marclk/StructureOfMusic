<template>
	<section>
		<!--MIDI CONTROLLER-->
	</section>
</template>

<script>
export default {
	props: ['device'],
	data(){
		return{
			deviceInput: this.onDeviceInput,
		}
	},
	methods: {
		//Midi stuff here
		start(){
			return new Promise((resolve, reject) =>{
				this._requestAccess().then(access =>{
					this.initialize(access);
					resolve();
				}).catch(() => reject(
					"[MIDI ERROR] Something went wrong. You're probably using an unsupported browser for Midi Input. Make sure you're on the Chrome browser to use MIDI Input"
					));
			});
		},

		initialize(access){
			const devices = access.inputs.values();
			for (let device of devices){
				this.initializeDevice(device);
			}
		},

		initializeDevice(device){
			device.onmidimessage = this.onMessage.bind(this);
		},

		onMessage(message){
			let[_, input, value] = message.data;
			this.$emit('onDeviceInput', {input, value});
			// console.log({input, value});
		},

		_requestAccess(){
			return new Promise((resolve, reject) =>{
				if(navigator.requestMIDIAccess){
					navigator.requestMIDIAccess()
						.then(resolve)
						.catch(reject);
				}else reject();
			});
		},
	},
	mounted(){
		//	this.start();
		
	}
}
</script>

<style>

</style>