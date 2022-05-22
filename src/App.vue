<template>
  <div id="app">
    <div id="nav">

    </div>
    <div id="content">
      <app-general-options @options="setGeneralOptions" ></app-general-options>
      <app-poly-synth-a ref="instrumentA" :effect="addedEffect" :effectPacket="addedEffectPacket" :generalOptionsPacket="addedGeneralOptionsPacket"></app-poly-synth-a>
      <app-midi-handler ref="midiDevice" @onDeviceInput='onDeviceInput'></app-midi-handler>
      <app-effect-rack @initializeEffects="initializeEffects"></app-effect-rack>
      <app-keyboard ref="keyboard" @onKeyboardInput='onKeyboardInput'></app-keyboard>
    </div>
    
  </div>
</template>

<script>
  import * as Tone from 'tone';
  
  import GeneralOptions from './components/GeneralOptions/GeneralOptions.vue';
  import MidiHandler from './components/MidiComponents/MidiHandler';
  import Keyboard from './components/MidiComponents/Keyboard';
  import SynthA from './components/SynthA';
  import PolySynthA from './components/Instruments/PolySynthA';
  import EffectRack from './components/synthComponents/EffectRack';

  import 'bulma/css/bulma.css';

  export default {

    data(){
      return{
        addedEffect: null,
        addedEffectPacket: null,
        addedGeneralOptionsPacket: null,
      }
    },
    components:{
      appGeneralOptions: GeneralOptions,
      appMidiHandler: MidiHandler,
      appKeyboard: Keyboard,
      appPolySynthA: PolySynthA,
      appEffectRack: EffectRack
    },
    methods:{
      onDeviceInput({input, value}){ // From midi Controller
        let instrument = this.$refs.instrumentA;
        let keyboard = this.$refs.keyboard;
        
        for (let i = 24; i <= 120; i++) {
          if(input === i){
            let octave = Math.floor(i/12);
            instrument.play(input, octave, value);
            keyboard.keyPressed(input%12, octave, value);
            keyboard.stopAnimation();
            // console.log(i, octave, value);
          }
        }

        if(input===1) instrument.handleVolume(value);
        else if(input===2) instrument.handleLowpassFilter(value);
        else if(input===3) instrument.handleHighpassFilter(value);
      },
      
      onKeyboardInput({octave, note, velocity}){
        let instrument = this.$refs.instrumentA;
        let keyboard = this.$refs.keyboard;

        instrument.play(note, octave, velocity)
        keyboard.keyPressed(note, octave, velocity);
      },

      initializeEffects(effects, effectPacket){
        console.log(effects);
        this.addedEffect = effects;
        this.addedEffectPacket = effectPacket;
      },

      setGeneralOptions(generalOptionsPacket){
        this.addedGeneralOptionsPacket = generalOptionsPacket;
      }
    },

    mounted(){
      const midi = this.$refs.midiDevice;
      midi.start().then(() => {
        console.log("Started!");
      }).catch(console.error);
    }

  }
</script>

<style lang="scss">
html{
  background-color: #121212;
  overflow-y: hidden;
}

body{
  background:  #121212;
  font-family: monospace;
  color: white!important;
}
 #app{
  width: 100%;
  margin: 3.5rem auto;
  padding: 1rem!important;
  background:  #121212;
 }
 
 #content{
   width: 80%;
   margin-left: auto;
   margin-right: 0;
 }

 .margin-1rem{
   margin: 1rem;
 }
</style>


<!--
Architectural choices:

	- Do we want to reset envelope values after switching synths or keep them

Notes:

	- Midi controller access only works in Chrome


Wireframe:
  - https://wireframe.cc/qaGHbA
 -->
