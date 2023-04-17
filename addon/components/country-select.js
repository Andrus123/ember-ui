import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class CountrySelectComponent extends Component {
    @service fetch;
    @tracked countries = [];
    @tracked selected;
    @tracked isLoading = true;
    @tracked value;
    @tracked id = guidFor(this);

    constructor() {
        super(...arguments);

        this.fetch
            .get('lookup/countries')
            .then((countries) => {
                this.countries = countries;
            })
            .finally(() => {
                this.isLoading = false;
            });

        if (this.args.value) {
            this.selected = this.findCountry(this.args.value);
        }
    }

    @action changed(value) {
        const country = this.findCountry(value);

        if (country) {
            this.selectCountry(country);
        }
    }

    @action listenForInputChanges(element) {
        setInterval(() => {
            const { value } = element;

            if (this.value !== value) {
                this.value = value;
                this.changed(value);
            }
        }, 100);
    }

    @action selectCountry(country) {
        const { onChange } = this.args;
        this.selected = country;

        if (typeof onChange === 'function') {
            onChange(country.cca2, country);
        }
    }

    findCountry(iso2) {
        return this.countries.find((country) => country.cca2 === iso2);
    }
}
