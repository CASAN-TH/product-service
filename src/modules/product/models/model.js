'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill a Product name',
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    option: {
        type: [{
            name: {
                type: String
            },
            value: {
                type: [
                    {
                        name: {
                            type: String
                        },
                        image: {
                            type: String
                        }
                    }
                ]
            }
        }]
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Product", ProductSchema);