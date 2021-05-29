import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// let lifeData = {};

// try{
// 	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
// 	lifeData = uni.getStorageSync('lifeData');
// }catch(e){

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userName: "",
		uni_id_token: "",
		univerifyErrorMsg: "",
		hideUniverify: true
	},
	mutations: {
		// 登录
		login(state, userName) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setUniverifyErrorMsg(state, payload = '') {
			state.univerifyErrorMsg = payload
		},
		setHideUniverify(state, payload = false) {
			state.hideUniverify = payload
		}
	}
})

export default store
