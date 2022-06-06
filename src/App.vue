<template>
  <div id="app">
    <div id="nav">
      <app-side-bar-nav @setCurrentPage='setCurrentPage'></app-side-bar-nav>
    </div>
    <div id="content">
      <component :is="currentPage" v-bind="cmpProps" @setCurrentPage='setCurrentPage' @playRandomNote="playRandomNote" @playRandomScale="playRandomScale"/>
      <div id="keyboard">
        <component :is="keyboardType" ref="keyboard" @onKeyboardInput='onKeyboardInput' @playRandomNote='playRandomNote'></component>
      </div>
    </div>

    <!-- //invisible -->
    <div id="synthsoul" class="display-none">
      <app-general-options @options="setGeneralOptions" ></app-general-options>
      <app-poly-synth-a ref="instrumentA" :effect="addedEffect" :effectPacket="addedEffectPacket" :generalOptionsPacket="addedGeneralOptionsPacket"></app-poly-synth-a>
      <app-midi-handler ref="midiDevice" @onDeviceInput='onDeviceInput'></app-midi-handler>
      <app-effect-rack @initializeEffects="initializeEffects"></app-effect-rack>
      <component :is="keyboardType" ref="keyboard" @onKeyboardInput='onKeyboardInput' @playRandomNote='playRandomNote'></component>
    </div>
    
  </div>
</template>

<script>
  import * as Tone from 'tone';

  import Data from './assets/data/data.json';
  
  import SideBar from './components/Navigation/SideBar.vue';
  import Lesson from './components/Pages/Lesson.vue';
  import Practice from './components/Pages/Practice.vue';
  import Home from './components/Pages/Home.vue';
  
  import GeneralOptions from './components/GeneralOptions/GeneralOptions.vue';
  import MidiHandler from './components/MidiComponents/MidiHandler';
  import Keyboard from './components/MidiComponents/Keyboard';
  import PracticeKeyboard from './components/MidiComponents/PracticeKeyboard';
  import SynthA from './components/SynthA';
  import PolySynthA from './components/Instruments/PolySynthA';
  import EffectRack from './components/synthComponents/EffectRack';

  import 'bulma/css/bulma.css';

  import { useExerciseStore } from '@/stores/exercise';
  import { useScaleStore } from '@/stores/scale';
  
  export default {
    setup(){
      const store = useExerciseStore();
      const scaleStore = useScaleStore();

      return{
        store,
        scaleStore
      }
    },
    data(){
      return{
        currentPage: 'app-home-page',
        keyboardType: 'app-keyboard',
        pageContent: 0,
        addedEffect: null,
        addedEffectPacket: null,
        addedGeneralOptionsPacket: null,
      }
    },
    components:{
      appHomePage: Home,
      appLessonPage: Lesson,
      appPracticePage: Practice,
      appSideBarNav: SideBar,
      appGeneralOptions: GeneralOptions,
      appMidiHandler: MidiHandler,
      appKeyboard: Keyboard,
      appPracticeKeyboard: PracticeKeyboard,
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

      playRandomScale(){
        if(this.scaleStore.started == false){
          console.error("Cant play random scale because scale game not active");       
        }else{
          if(this.scaleStore.rootNote == null){
            this.scaleStore.scaleToPlay();
          }
        }

        let instrument = this.$refs.instrumentA;
        let keyboard = this.$refs.keyboard;
        let convertNote = {12: 0, 13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7, 20: 8, 21: 9, 22: 10}

        if(this.scaleStore.options.mode == "listen"){
          for(let i  = 0; i < this.scaleStore.scale.length; i++){
            if(this.scaleStore.scale[i] > 11){
              setTimeout(() => 
                (instrument.play(convertNote[this.scaleStore.scale[i]], 5, 127),
                keyboard.setKeyStyle(convertNote[this.scaleStore.scale[i]], 5, 127)),
                250 + (500 * i));
            
              setTimeout(() => 
                (instrument.play(convertNote[this.scaleStore.scale[i]], 5, 0), keyboard.setKeyStyle(convertNote[this.scaleStore.scale[i]], 5, 0)) , 500 + (500 * i));  
            }else{
              setTimeout(() => 
                (instrument.play(this.scaleStore.scale[i], 4, 127),
                keyboard.setKeyStyle(this.scaleStore.scale[i], 4, 127)),
                250 + (500 * i));
            
              setTimeout(() => 
                (instrument.play(this.scaleStore.scale[i], 4, 0), keyboard.setKeyStyle(this.scaleStore.scale[i], 4, 0)) , 500 + (500 * i));  
            }
          }
        }else if(this.scaleStore.options.mode == "blind"){
          instrument.play(this.scaleStore.rootNote, 4, 127);
          keyboard.setKeyStyle(this.scaleStore.rootNote, 4, 127);
        
          setTimeout(() => (instrument.play(this.scaleStore.rootNote, 4, 0), keyboard.setKeyStyle(this.scaleStore.rootNote, 4, 0)) , 1000);
        }
        

        
        console.log(this.scaleStore.rootNote + ': RANDOMNOTE')
        
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
        if(cmp == "app-practice-page"){
          this.keyboardType = 'app-practice-keyboard';
          console.log()
        }else{
          this.keyboardType = 'app-keyboard';
        }
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
        }else if(this.currentPage === "app-home-page"){
          let home = this.getJsonObject(Data["HomeScreen"]);
            
          return {
            id: home[this.pageContent].id,
            number: home[this.pageContent].number,
            title: home[this.pageContent].title,
            paragraph: home[this.pageContent].paragraph,
            
          };
        }else if (this.currentPage === "app-overview-page"){
          let overview = this.getJsonObject(Data["Lessons"]);
          return {
              id: overview[this.pageContent].id,
              number: overview[this.pageContent].number,
              title: overview[this.pageContent].title,
            };
        }else{
          return null;
        }
      }
    }
  }
</script>

<style lang="scss">

  $accent: #24E1D2;

@font-face {
  font-family: "s";
  src: url("./assets/fonts/Test Söhne Breit/test-soehne-breit-leicht.woff2");
  font-weight: 300;
}

@font-face {
  font-family: "s";
  src: url("./assets/fonts/Test Söhne Breit/test-soehne-breit-kraftig.woff2");
  font-weight: 400;
}

@font-face {
  font-family: "s";
  src: url("./assets/fonts/Test Söhne Breit/test-soehne-breit-halbfett.woff2");
  font-weight: 500;
}

@font-face {
  font-family: "s";
  src: url("./assets/fonts/Test Söhne Breit/test-soehne-breit-dreiviertelfett.woff2");
  font-weight: 600;
}

h1,h2,h3,h4,h5,h6{
  font-family: "s"!important;
}

h1{
  font-size: 5rem!important;
}

html{
  background-color: #121212;
  overflow-y: hidden;
}

body{
  background:  #121212;
  font-family: monospace;
  color: white!important;
  font-size: 1.3rem;
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
  // overflow:auto;
 }
 
 #content{
   width: 70%;
   height: 100%;
   margin-left: auto;
   margin-right: 0;
   padding-top: 2rem;
 }

 #synthsoul{
   width: 70%;
   height: 100%;
   margin-top: 10px;
   margin-left: auto;
   margin-right: 5rem;
   margin-bottom: -20rem;
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
