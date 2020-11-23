const HomerProvider = require('../models/HomerProvider');
const ProductsProvider = require('../models/Productsprovider');

module.exports.addProvider = async(data) => {
    const {id,name, lat, lng, products} = data;

    try {
        let newProvider = await HomerProvider.create({
            ui:id,
            name:name,
            lat:lat,
            lng:lng
        });
        if(newProvider){
            for(let i=0; i<products.length; i++){
                let newProvider = await ProductsProvider.create({
                    ui:products[i].id,
                    name:products[i].name,
                    providerId:newProvider.id
                })
            }
            
            return {
                message:'Provider created successfully',
            }
        }
    } catch (error) {
        return {
            message:'Something goes wrong',
            data:{}
        }
    }
}

