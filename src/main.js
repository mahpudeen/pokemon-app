import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/main.scss'

Vue.config.productionTip = false
Vue.mixin({
    methods: {
        convertToFormatID (number) {
            // If the number is greater than 9999, return the number as a string
            if (number > 9999) {
                return '#' + number.toString();
            }

            // Convert the number to the desired format with leading zeros and #
            const formattedNumber = '#' + number.toString().padStart(4, '0');
            return formattedNumber;
        },
        colorType (type) {
            if (type === 'normal') {
                return '#A8A878'
            } else if (type === 'fighting') {
                return '#C03028'
            } else if (type === 'flying') {
                return '#A890F0'
            } else if (type === 'poison') {
                return '#A040A0'
            } else if (type === 'ground') { 
                return '#E0C068'
            } else if (type === 'rock') {
                return '#B8A038'
            } else if (type === 'bug') {
                return '#A8B820'
            } else if (type === 'ghost') {
                return '#705898'
            } else if (type === 'steel') {
                return '#B8B8D0'
            } else if (type === 'fire') {
                return '#F08030'
            } else if (type === 'water') {
                return '#6890F0'
            } else if (type === 'grass') {
                return '#78C850'
            } else if (type === 'electric') {
                return '#F8D030'
            } else if (type === 'psychic') {
                return '#F85888'
            } else if (type === 'ice') {
                return '#98D8D8'
            } else if (type === 'dragon') {
                return '#7038F8'
            } else if (type === 'dark') {
                return '#705848'
            } else if (type === 'fairy') {
                return '#EE99AC'
            } else if (type === 'unknown') {
                return '#68A090'
            } else if (type === 'shadow') {
                return '#493963'
            }
        }
    }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
