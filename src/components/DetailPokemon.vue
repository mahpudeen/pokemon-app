<template>
  <div v-if="showModal" class="pokemon-modal" @click.self="closeModal()">
    <div class="close" @click="closeModal()">
        <img src="../assets/img/close.svg" alt="close">
    </div>
    <div class="pokemon-detail">
        <div class="pokemon-detail-header">
            <h1>{{data.name}}</h1>
            <h2>{{convertToFormatID(data.id)}}</h2>
        </div>
        <div class="pokemon-detail-body">
            <div class="pokemon-detail-body-left">
                <img :style="'background-color :'+colorType(typePokemon)" :src="data.image" alt="">
                <div class="pokemon-detail-body-left-item">
                    <h3>Type</h3>
                    <div class="chip">
                        <span 
                            v-for="(type, idx) in data.types"
                            :key="idx"
                            :style="'background :'+colorType(type)"
                        >{{type}}</span>
                    </div>
                </div>
                
            </div>
            <div class="pokemon-detail-body-right">
                <div class="pokemon-detail-body-right-container">
                <div>
                    <h3>Abilities</h3>
                    <p class="up">{{data.abilities}}</p>
                </div>
                <div>
                    <h3>Base Exp.</h3>
                    <p>{{data.base_experience}}</p>
                </div>
                <div>
                    <h3>Height</h3>
                    <p>{{convertWithDot(data.height)}} m</p>
                </div>
                <div>
                    <h3>Weight</h3>
                    <p>{{convertWithDot(data.weight)}} kg</p>
                </div>
                </div>
                <div class="pokemon-detail-body-right-item">
                    <h3>Stats</h3>
                    <div class="pokemon-detail-body-right-item-stats">
                        <div class="pokemon-detail-body-right-item-stats-item">
                            <p>HP</p>
                            <div class="progress-bar">
                                <div class="progress-bar-value" :style="'width :'+(100/255*data.stats.hp)+'%'"></div>
                            </div>
                        </div>
                        <div class="pokemon-detail-body-right-item-stats-item">
                            <p>Speed</p>
                            <div class="progress-bar">
                                <div class="progress-bar-value" :style="'width :'+(100/255*data.stats.speed)+'%'"></div>
                            </div>
                        </div>
                        <div class="pokemon-detail-body-right-item-stats-item">
                            <p>Defense</p>
                            <div class="progress-bar">
                                <div class="progress-bar-value" :style="'width :'+(100/255*data.stats.defense)+'%'"></div>
                            </div>
                        </div>
                        <div class="pokemon-detail-body-right-item-stats-item">
                            <p>Special Defense</p>
                            <div class="progress-bar">
                                <div class="progress-bar-value" :style="'width :'+(100/255*data.stats['special-defense'])+'%'"></div>
                            </div>
                        </div>
                        <div class="pokemon-detail-body-right-item-stats-item">
                            <p>Attack</p>
                            <div class="progress-bar">
                                <div class="progress-bar-value" :style="'width :'+(100/255*data.stats.attack)+'%'"></div>
                            </div>
                        </div>
                        <div class="pokemon-detail-body-right-item-stats-item">
                            <p>Special Attack</p>
                            <div class="progress-bar">
                                <div class="progress-bar-value" :style="'width: ' + (100/255*data.stats['special-attack']) + '%'"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    name: 'DetailPokemon',
    props: {
        detail: {
            type: Object,
            default: () => {
                return {
                    modal: false,
                    data: {},
                    typePokemon: ''
                }
            }
        }
    },
    watch: {
        detail: {
            handler: function (val) {
                this.showModal = val.modal;
                this.data = val.data;
                this.typePokemon = val.typePokemon;
            },
            deep: true
        }
    },
    data() {
        return {
            typePokemon: '',
            showModal: false,
            data: {
                id : 0,
                name : "",
                image : "",
                types : [],
                stats : {
                    hp : 0,
                    attack : 0,
                    defense : 0,
                    "special-attack" : 0,
                    "special-defense" : 0,
                    speed : 0
                },
                abilities : "",
                base_experience : 0,
                height : 0,
                weight : 0
            }
        };
    },
    methods: {
        closeModal() {
            this.showModal = false;
            this.$root.$emit('close', false)
        },
        convertWithDot(number) {
            return (number / 10).toFixed(1);
        },
    },
    mounted() {
        // Close modal on Esc key press
        window.addEventListener('keydown', (e) => {
            if (this.showModal && e.key === 'Escape') {
                this.closeModal();
            }
        });
    },
}
</script>