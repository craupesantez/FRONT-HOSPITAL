import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import axios from "axios";
export default new Vuex.Store({
  state: {
    token: null,
    nombres: null,
    apellidos: null,
    id: null,
    roles: [],
    // visibleNavBar: false,
    bandera: false,
  },
  getters: {
    getToken(state){
      return state.token;
    },
    getRoles(state){
      return state.roles;
    },
    getBandera(state){
      return state.bandera;
    }
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setNombres(state, payload) {
      state.nombres = payload;
    },
    setApellidos(state, payload) {
      state.apellidos = payload;
    },
    setId(state, payload) {
      state.id = payload;
    },
    setRoles(state, payload) {
      state.roles = payload;
    },
    // setVisibleNavBar(state, payload) {
    //   state.visibleNavBar = payload;
    // },
    setBandera(state, payload) {
      state.bandera = payload;
    }
    // setCatalogos(state, payload) {
    //   state.catalogos = payload;
    // }
  },
  actions: {
    leerToken({commit}) {
      if (localStorage.getItem('token')){
        // console.log('debe leer el token '+ localStorage.getItem('token'))
        commit('setToken', localStorage.getItem('token'));
        // commit('setVisibleNavBar', localStorage.getItem('visibleNavBar'));
        commit('setRoles', JSON.parse(localStorage.getItem('roles')));
        commit('setBandera', true);
      }else{
        commit('setToken', null);
        // commit('setVisibleNavBar', false);
        commit('setBandera', false);
      }
    },
    cerrarSesion({commit}) {
      localStorage.removeItem('token');
      localStorage.removeItem('nombres');
      localStorage.removeItem('apellidos');
      localStorage.removeItem('id');
      localStorage.removeItem('roles');
      commit('setToken', null);
      commit('setNombres', null);
      commit('setApellidos', null);
      commit('setId', null);
      commit('setRoles', null);
      // commit('visibleNavBar', false);
      commit('setBandera', false);
    },
    // async getCatalogos({commit}){
    //   await axios.get('http://localhost:3000/api/v1/catalogos')
    //     .then((result)=>{
    //       commit('setCatalogos', result.data);
    //     })
    // }
    // async login({ commit }, usuario) {
    //   // console.log(usuario);
    //   let auxtoken=null;
    //   try {
    //      await axios.post('http://localhost:3000/api/v1/auth/login', usuario)
    //       .then((result)=>{
    //         commit('setToken', result.data.token);
    //         localStorage.setItem('token', result.data.token);
    //         auxtoken = result.data.token;
    //       });
    //       if (auxtoken){
    //         this.$router.push('/about')
    //       }else{
    //         this.$router.push('/login')
    //       }

    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
  modules: {
  }
})
