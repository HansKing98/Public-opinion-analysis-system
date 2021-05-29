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
		username: "",
		userInfo: {},
		uni_id_token: "",
		univerifyErrorMsg: "",
		hideUniverify: true
	},
	mutations: {
		// 模拟本地登录， 不可用
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
			// 获取用户信息 同时将 hasLogin 设为 true
			state.hasLogin = true
		},
		setLogout(state) {
			state.userInfo = {}
			state.hasLogin = false
		},
		login(state, username) {
			state.username = username || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.username = "";
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
