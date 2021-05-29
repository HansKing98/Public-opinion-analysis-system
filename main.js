import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import Skeleton from './components/skeleton/index.vue'
import './utils/filter';

Vue.component('Skeleton', Skeleton);
Vue.use(uView);

import store from '@/store'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
