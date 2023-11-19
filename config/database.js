const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect('mongodb+srv://1111:1234@mernprojectceec.byvhv.mongodb.net/fms?retryWrites=true&w=majority');
        console.log('connect mongodb successfully!');
    }catch(error){
        console.log(error);
    };
}

module.exports = { connect };