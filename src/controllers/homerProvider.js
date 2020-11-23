const HomerProvider = require('../models/HomerProvider');
const ProductsProvider = require('../models/Productsprovider');

module.exports.addProvider = async(data) => {
    try {
        console.log(data);
        const {id,name, lat, lng, products} = data;

        let newProvider = await  HomerProvider.create({
            ui:id,
            name:name,
            lat:lat,
            lng:lng
        });
        if(newProvider){
            let providerId = newProvider.id;
            for(let i=0; i<products.length; i++){
                let newProvider = await ProductsProvider.create({
                    ui:products[i].id,
                    name:products[i].name,
                    providerId:providerId
                })
            }
            
            return {
                message:'Provider created successfully',
            }
        }
    } catch (error) {
        return {
            message:'Something goes wrong'+error,
            data:{}
        }
    }
}

