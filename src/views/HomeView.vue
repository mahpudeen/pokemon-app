<template>
    <div class="container">
        <div class="home-title">
            <img src="../assets/img/pokedex-logo.png" width="500px" alt="">
            <form class="home-search-input">
                <input v-model="search" type="text" id="search-input" placeholder="Search for a Pokémon Name or Number">
                <span class="material-symbols-outlined" @click="searchPokemon()">
                    search
                </span>
            </form>
            <div class="autocomplete-list">
                <ul v-if="showSuggestions" >
                    <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)" v-show="suggestions.length > 0">
                        #{{ suggestion.id }} - {{ suggestion.name }}
                    </li>
                    <li v-show="suggestions.length == 0">
                        No Pokémon matched your search
                    </li>
                </ul>
            </div>
        </div>
        <div class="divider"></div>
        <div class="home-body">
            <div class="pokemon-type-list">
                <button 
                    v-for="(item, idx) in typeList" 
                    :class="item.name == typePokemon?'active':''" 
                    :style="item.name == typePokemon ? {'background-color': colorType(item.name)} : {}" 
                    :key="idx"
                    @click="changeType(item)"
                >{{item.name ? item.name : 'All Types'}}</button>
            </div>
            <div class="pokemon-list">
                <div class="pokemon-card" 
                    v-for="(item, idx) in pokemonListSort" 
                    :key="idx" 
                    @click="showDetailPokemon(item)"
                >
                    <img :style="'background-color :'+colorType(typePokemon?typePokemon:item.types[0])" v-if="item.types" :src="item.image" alt="">
                    <div class="pokemon-card-body">
                        <p>{{convertToFormatID(item.id)}}</p>
                        <h3>{{item.name}}</h3>
                        <div class="chip">
                            <span 
                                v-for="(type, idx) in item.types"
                                :key="idx"
                                :style="'background :'+colorType(type)"
                            >{{type}}</span>
                        </div>
                    </div>
                </div>
                <div class="no-pokemon" v-if="pokemonListSort.length == 0 && !isLoading">
                    <h1>
                        Pokémon not found.
                    </h1>
                    <p>
                        Try searching for other conditions.
                    </p>
                </div>
            </div>
            <div id="loading" v-show="isLoading">
                <div class="pokeball-loader"></div>
            </div>
        </div>
        <DetailPokemon :detail="detailPokemon"/>
        <div class="footer">
            © 2023 Mahpudeen, API from <a href="https://pokeapi.co/" target="_blank">PokeAPI</a> 
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
/* eslint-disable */
import axios from 'axios'
import DetailPokemon from '@/components/DetailPokemon.vue'
export default {
    name: 'HomeView',
    components: {
        DetailPokemon
    },
    data() {
        return {
            search: '',
            showSuggestions: false,
            suggestions: [],
            suggestionLists: [],
            isLoading: true,
            pokemonList: [],
            totalPokemon: 0,
            typeList : [],
            typePokemon : '',
            from : 0,
            to : 10,
            detailPokemon : {
                modal: false,
                data: {},
                typePokemon : ''
            },
        }
    },
    mounted() {
        let self = this
        this.$root.$on('close', function (val) {
            self.detailPokemon.modal = val
        })
        window.addEventListener('scroll', this.handleScroll);
        this.fetchType()
        this.fetchPokemon()
    },
    computed: {
        pokemonListSort() {
            let uniquePokemonList = Array.from(new Set(this.pokemonList.map(pokemon => pokemon.id)))
                .map(id => {
                    return this.pokemonList.find(pokemon => pokemon.id === id);
                });
            return uniquePokemonList.sort((a, b) => a.id - b.id);
        }
    },
    watch: {
        search: function (val) {
            let self = this
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                self.fetchSuggestions();
            }, 1000);
        }
    },
    methods: {
        fetchSuggestions() {
            if (this.search.length > 0) {
                this.showSuggestions = true;
                let pokemonList = this.$store.getters.getPokemonList;
                this.suggestionLists = pokemonList.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()) || item.id.toString().includes(this.search));
                this.suggestions = this.suggestionLists.slice(0, 5);
            } else {
                this.resetSuggestions();
            }
        },
        searchPokemon() {
            if (this.search.length > 0) {
                this.resetList();
                this.getPokemonVuex(this.suggestionLists);
            } else {
                this.resetList();
                this.getPokemonVuex(this.$store.getters.getPokemonList);
            }
        },
        selectSuggestion(suggestion) {
            this.search = suggestion.name;
            this.showSuggestions = false;
            this.resetList();
            this.getPokemonVuex([suggestion]);
        },
        resetSuggestions() {
            this.showSuggestions = false;
            this.suggestions = [];
            this.suggestionLists = [];
            this.search = '';
        },
        resetList() {
            this.pokemonList = [];
            this.from = 0
            this.to = 10
        },
        async fetchType() {
            let response = await axios.get('https://pokeapi.co/api/v2/type')
            this.typeList = [{'name': ''}]
            response.data.results.forEach(e => {
                this.typeList.push(e)
            });
        },
        async changeType(item) {
            this.isLoading = true
            this.typePokemon = item.name
            this.resetSuggestions();
            this.resetList()
            if(item.name == '') {
                this.fetchPokemon()
                return
            }
            try {
                let response = await axios.get('https://pokeapi.co/api/v2/type/'+item.name)
                let pokemonList = response.data.pokemon.map(item => this.transformedList(item.pokemon));
                this.totalPokemon = response.data.pokemon.length;
                this.$store.commit('setPokemonList', pokemonList);
                this.getPokemonVuex(this.$store.getters.getPokemonList);
                this.isLoading = false
            } catch (error) {
                console.error('Error fetching Pokemon:', error);
            }
        },
        handleScroll() {
            // Check if the user has scrolled to the bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !this.isLoading && this.from < this.totalPokemon) {
                if (this.suggestionLists.length > 0 && this.suggestionLists.length < this.to) {
                    this.isLoading = false;
                    return;
                } 
                this.isLoading = true;
                setTimeout(() => {
                    this.from = this.to
                    this.to += 10
                    if(this.suggestionLists.length > 0) {
                        this.getPokemonVuex(this.suggestionLists);
                    } else {
                        this.getPokemonVuex(this.$store.getters.getPokemonList);
                    }
                }, 1000);
            }
        },
        async fetchPokemon() {
            try {
                let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
                let pokemonList = response.data.results.map(item => this.transformedList(item));
                this.totalPokemon = response.data.results.length;
                this.$store.commit('setPokemonList', pokemonList);
                this.getPokemonVuex(this.$store.getters.getPokemonList);
            } catch (error) {
                console.error('Error fetching Pokemon:', error);
            }
        },
        async getPokemonVuex(list) {
            let pokemonList = list.slice(this.from, this.to);
            let pokemonListDetail = [...this.pokemonList];
            pokemonList.forEach(async (item) => {
                try {
                    let response = await axios.get(item.url);
                    let pokemon = response.data;
                    pokemonListDetail.push(
                        {
                            id: pokemon.id,
                            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).replace(/-/g, ' '),
                            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokemon.id + '.png',
                            types: pokemon.types.map(item => item.type.name),
                            stats: this.convertToJsonStats(pokemon.stats),
                            abilities: pokemon.abilities.map(item => item.ability.name).join(', ').replace(/-/g, ' '),
                            base_experience : pokemon.base_experience,
                            height : pokemon.height,
                            weight : pokemon.weight,
                        }
                    );
                } catch (error) {
                    console.error('Error fetching Pokemon:', error);
                }
            });
            this.pokemonList= pokemonListDetail;
            this.isLoading = false;
        },
        transformedList(item) {
            const name = item.name.charAt(0).toUpperCase() + item.name.slice(1).replace(/-/g, ' ');
            const url = item.url;
            const id = url.split('/').slice(-2, -1)[0];
            return {
                name,url,id
            };
        },
        convertToJsonStats(array) {
            let result = {};
            for (let item of array) {
                result[item.stat.name] = item.base_stat;
            }
            return result;
        },
        showDetailPokemon(item) {
            this.detailPokemon = {
                modal: true,
                data: item,
                typePokemon : this.typePokemon ? this.typePokemon : item.types[0]
            }
        },
    },
  
}
</script>
