const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect('localhost');
        console.log('connect mongodb successfully!');
    }catch(error){
        console.log(error);
    };
}

module.exports = { connect };