'use strict';

const loadNum = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: 'Landscapes',
        lastSearch: '',
        loading: false
    },
    computed: {
        noMoreItems: function() {
            return this.results.length > 1 && this.results.length === this.items.length;
        }
    },
    methods: {
        appendItems: function() {
            if ( this.items.length < this.results.length ) {
                let append = this.results.slice(this.items.length, this.items.length + loadNum);
                this.items = this.items.concat( append );
            } 
        },
        onSubmit: function() {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;

                this.$http
                    .get(`/search/${this.newSearch}`)
                    .then((res) => {
                        this.results = res.data;
                        this.lastSearch = this.newSearch;
                        this.appendItems();
                        this.loading = false;

                        this.results.forEach((item) => {
                            let randomNum = Math.random(100) * 100;
                            item.price = Number(randomNum.toFixed(2));
                        });
                    });
            }
        },
        addItem: function(index) {
            let item = this.items[index];
            let found = false;

            this.cart.forEach(( cartItem ) => {
                if (cartItem.id === item.id) {
                    found = true;
                    cartItem.quantity++;
                }
            });

            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: 1
                });
            };

            this.total += item.price;
            
        },
        increment: function(item) {
            item.quantity++;
            this.total += item.price;            
        },
        decrement: function( item ) {
            item.quantity--;
            this.total -= item.price;
            if (item.quantity < 1) {
                this.cart.forEach(( cartItem, index ) => {
                    if ( cartItem.id === item.id ) {
                        this.cart.splice( index, 1 );
                    };
                });
            };
            
        }
    },
    filters: {
        currency: function(value) {           
            let formattedPrice = Number(value).toFixed(2);
            return `$${formattedPrice}`;
        }
    },
    mounted: function() {
        this.onSubmit();

        let vueInstance = this;
        let watcher = scrollMonitor.create( document.getElementById('product-list-bottom') );
        watcher.enterViewport(function lazyLoad() {
            vueInstance.appendItems();
        });
    }
});
