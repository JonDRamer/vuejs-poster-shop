'use strict';

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { id: 1, title: "Item 1", price: 4.99 },
            { id: 2, title: "Item 2", price: 3.99 },
            { id: 3, title: "Item 3", price: 2.99 }
        ],
        cart: []
    },
    methods: {
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
            
        }
    },
    filters: {
        currency: function(value) {
            return `$${value.toFixed(2)}`;
        }
    }
});
