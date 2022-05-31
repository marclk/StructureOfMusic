import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';


// Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app').$use(createPinia());

const app = createApp(App);
app.use(createPinia());

app.mount('#app')