import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        pokemonList: [],
    },
    getters: {
        getPokemonList: state => {
            return state.pokemonList;
        },
    },
    mutations: {
        setPokemonList(state, payload) {
            state.pokemonList = payload;
        }
    },
    actions: {
        setPokemonList({commit}, payload) {
            commit('setPokemonList', payload);
        }
    },
    modules: {
    }
})
