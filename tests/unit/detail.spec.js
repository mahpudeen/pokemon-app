import { mount, createLocalVue } from '@vue/test-utils';
import DetailPokemon from '@/components/DetailPokemon.vue';

const localVue = createLocalVue();

describe('Component DetailPokemon.vue', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(DetailPokemon, {
            localVue,
            propsData: {
                detail: {
                    modal: true,
                    data: {
                        id: 1,
                        name: "Bulbasaur",
                        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                        types: ["grass", "poison"],
                        stats: {
                            hp: 45,
                            attack: 49,
                            defense: 49,
                            "special-attack": 65,
                            "special-defense": 65,
                            speed: 45
                        },
                        abilities: "chlorophyll",
                        base_experience: 64,
                        height: 7,
                        weight: 69
                    },
                    typePokemon: "grass"
                },
            },
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('renders the component with the correct data', () => {
        // Assert that the component renders correctly
        expect(wrapper.exists()).toBe(true);

        // Assert that the data is correctly passed
        expect(wrapper.vm.detail.data.id).toBe(1);
        expect(wrapper.vm.detail.data.name).toBe('Bulbasaur');
        expect(wrapper.vm.detail.typePokemon).toBe('grass');
    });

    it('closes the modal when closeModal method is called', async () => {
        // Call the closeModal method
        await wrapper.vm.closeModal();

        // Assert that the modal is closed
        expect(wrapper.vm.showModal).toBe(false);
    });

    it('converts number with dot correctly', () => {
        // Test the convertWithDot method
        const result = wrapper.vm.convertWithDot(30);

        // Assert that the method produces the correct result
        expect(result).toBe('3.0');
    });
});
