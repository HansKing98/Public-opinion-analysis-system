import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import Skeleton from './components/skeleton/index.vue'
import DrawerLayout from 'vue-drawer-layout'

Vue.use(DrawerLayout)

Vue.component('Skeleton', Skeleton);
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
