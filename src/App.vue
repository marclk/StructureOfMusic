<template>
  <div id="app">
    <div id="nav">
      <app-side-bar-nav @setCurrentPage='setCurrentPage'></app-side-bar-nav>
    </div>
    <div id="content">
      <p>{{store.notes.score}}</p>
      <p>note played: {{store.notes.noteToPlay}}</p>
      <component :is="currentPage" v-bind="cmpProps" @setCurrentPage='setCurrentPage' @playRandomNote = "playRandomNote" />
      <div id="keyboard">
        <app-keyboard ref="keyboard" @onKeyboardInput='onKeyboardInput' @playRandomNote='playRandomNote'></app-keyboard>
      </div>
    </div>

    //invisible
    <div class="display-none">
      <app-general-options @options="setGeneralOptions" ></app-general-options>
      <app-poly-synth-a ref="instrumentA" :effect="addedEffect" :effectPacket="addedEffectPacket" :generalOptionsPacket="addedGeneralOptionsPacket"></app-poly-synth-a>
      <app-midi-handler ref="midiDevice" @onDeviceInput='onDeviceInput'></app-midi-handler>
      <app-effect-rack @initializeEffects="initializeEffects"></app-effect-rack>
    </div>
    
  </div>
</template>

<script>
  import * as Tone from 'tone';

  import Data from './assets/data/data.json';
  
  import SideBar from './components/Navigation/SideBar.vue';
  import Lesson from './components/Pages/Lesson.vue';
  import Practice from './components/Pages/Practice.vue';
  
  import GeneralOptions from './components/GeneralOptions/GeneralOptions.vue';
  import MidiHandler from './components/MidiComponents/MidiHandler';
  import Keyboard from './components/MidiComponents/Keyboard';
  import SynthA from './components/SynthA';
  import PolySynthA from './components/Instruments/PolySynthA';
  import EffectRack from './components/synthComponents/EffectRack';

  import 'bulma/css/bulma.css';

  import { useExerciseStore } from '@/stores/exercise';
  
  export default {
    setup(){
      const store = useExerciseStore();

      return{
        store
      }
    },
    data(){
      return{
        currentPage: 'app-lesson-page',
        pageContent: 0,
        addedEffect: null,
        addedEffectPacket: null,
        addedGeneralOptionsPacket: null,
      }
    },
    components:{
      appLessonPage: Lesson,
      appPracticePage: Practice,
      appSideBarNav: SideBar,
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

      playRandomNote(){
        if(this.store.notes.started == false){
          console.error("Cant play random note because note game not active");
          
        }else{
          if(this.store.notes.noteToPlay == null){
            var randomNote = Math.floor(Math.random() * (11 - 1 + 1)) + 1;
            this.store.noteToPlay(randomNote)
            console.log("random note: " + randomNote);
          }

          let instrument = this.$refs.instrumentA;
          
          instrument.play(this.store.notes.noteToPlay, 4, 127);
          setTimeout(() => instrument.play(this.store.notes.noteToPlay, 4, 0), 1000);
          console.log(this.store.notes.noteToPlay + ': RANDOMNOTE')
          
        }
        
        
        
      },

      initializeEffects(effects, effectPacket){
        // console.log(effects);
        this.addedEffect = effects;
        this.addedEffectPacket = effectPacket;
      },

      setGeneralOptions(generalOptionsPacket){
        this.addedGeneralOptionsPacket = generalOptionsPacket;
      },
      
      setCurrentPage(cmp, contentId){
        
        this.currentPage = cmp;
        this.pageContent = contentId;
      },

      getJsonObject(jsonObject){
        return jsonObject.filter((jsonObject) =>{return (jsonObject);});
      },

      getJsonObjectById(jsonObject, id){
        return jsonObject.filter((jsonObject) =>{return (jsonObject['id'] == id);})[0]
      }
    },

    mounted(){
      // var lessonOne = this.getJsonObjectById(Data["Practice"], 0);
      // var lessons = this.getJsonObject(Data["Lessons"]);
      // console.log(lessonOne);
      // console.log(lessons)
      const midi = this.$refs.midiDevice;
      midi.start().then(() => {
        console.log("Started!");
      }).catch(console.error);
    },

    computed:{
      cmpProps(){
        
        if(this.currentPage === "app-lesson-page"){
          let lessons = this.getJsonObject(Data["Lessons"]);
          return {
            id: lessons[this.pageContent].id,
            number: lessons[this.pageContent].number,
            title: lessons[this.pageContent].title,
            paragraph: lessons[this.pageContent].paragraph,
            videoData: lessons[this.pageContent].videoData,
            practiceLink: lessons[this.pageContent].practiceLink
          }; 
        }else if(this.currentPage === "app-practice-page"){
          let practice = this.getJsonObject(Data["Practice"]);
          return {
            id: practice[this.pageContent].id,
            number: practice[this.pageContent].number,
            title: practice[this.pageContent].title,
            paragraph: practice[this.pageContent].paragraph,
            videoData: practice[this.pageContent].videoData,
            practiceLink: practice[this.pageContent].practiceLink,
            
          }; 
        }else{
          return false;
        }
      }
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
  background:  #121212;
 }

 #nav{
  width: 20%;
  height:100%;
  position: fixed;
  z-index: 1;
  overflow:auto;
 }
 
 #content{
   width: 70%;
   height: 100%;
   margin-left: auto;
   margin-right: 0;
 }
 
 #keyboard{
   position: absolute;
   bottom: 0;
 }

 .margin-1rem{
   margin: 1rem;
 }

 .button{
   padding: 1rem;
   background-color: black;
   border: 2px solid white;
 }

 .display-none{
   display: none;
 }

 .v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>


<!--
ToDo: 

	- make note practice cap at 12 rounds
  - fix styling


Architectural choices:

	- Do we want to reset envelope values after switching synths or keep them

Notes:

	- Midi controller access only works in Chrome


Wireframe:
  - https://wireframe.cc/qaGHbA
 -->
