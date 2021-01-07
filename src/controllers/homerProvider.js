const sequelize = require('../db');
const axios = require('axios');
const HomerProvider = require('../models/HomerProvider');
const ProductsProvider = require('../models/Productsprovider');
const Order = require('../models/Order');

module.exports.addProvider = async(data) => {
    try {
        console.log(data);
        const {id, lat, lng, products,onesignal} = data;

        let newProvider = await  HomerProvider.create({
            ui:id,
            lat:lat,
            lng:lng,
            onesignal:onesignal
        });
        if(newProvider){
            let providerId = newProvider.ui;
            for(let i=0; i<products.length; i++){
                await ProductsProvider.create({
                    ui:products[i].id,
                    providerId:providerId
                });
            }
            return {
                message:'Provider created successfully',
                data:newProvider
            }
        }
    } catch (error) {
        return {
            message:'Something goes wrong'+error,
            data:{}
        }
    }
}
module.exports.searchProvider = async(ui) => {
    try {
        return await HomerProvider.findAll({where:{ui:ui}});
        
    } catch (error) {
        console.log('error'+error)
    }
}

module.exports.deleteProvider = async(ui) => {
    try {
        await HomerProvider.destroy({where:{ui:ui}});
        await ProductsProvider.destroy({where:{providerId:ui}});
        return {
            message:'Provider was deleted',
            data:{}
        }
    } catch (error) {
        return {
            message:'Something goes wrong'+error,
            data:{}
        }
    }
}

module.exports.createOrders = async(req, res) => {
    try {
        let address = '';
        const {clientUi, nameClient, productUi, productName, stateServiceId, date, hour,location, lat, lng,onesignal} = req.body;
        console.log('coord',lat, lng);
        let googleInfo = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyBofvEOcrzbxSfBA7LTFSypr5SX3TT94Dk&sensor=false');
       console.log(googleInfo);
        let newService = await Order.create({
            clientUi: clientUi, 
            nameClient: nameClient, 
            productUi: productUi, 
            productName: productName, 
            stateServiceId: stateServiceId, 
            date: date, 
            hour: hour,
            location:'Mangua, Nicaragua',
            lat:lat,
            lng:lng,
            onesignal
        });
        if(newService){
            res.status(200).json({
                message:'Provider created successfully',
                data:newService
            });
        }
        
    } catch (error) {
        res.status(200).json({
            message: 'Something goes wrong'+error,
            data:{}
        });
    }
}

module.exports.getOrderByProvider = async(provider) => {
    try{
        // return await Order.findAll({
        //     where:{
        //         productUi:provider,
        //         status:"solicitado"
        //     }
        // })
        return await sequelize.query(
            `SELECT DISTINCT(productsproviders.providerId), orders.* FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${provider} and orders.status = 1`,{
                type: sequelize.QueryTypes.SELECT
              });
    }catch(e){
        return {
            message:'Something goes wrong'+error
        }
    }
}

module.exports.nearBy = async(req, res) => {
    const {lat, lng, distance,} = req.body;
    let providers  = await sequelize.query(
        `SELECT homerproviders.ui,homerproviders.lat,homerproviders.lng,homerproviders.onesignal, productsproviders.ui, (6371 * ACOS(
            SIN(RADIANS(lat)) * SIN(RADIANS(${lat})) 
            + COS(RADIANS(lng - ${lng})) * COS(RADIANS(lat))
            * COS(RADIANS(${lat}))
            )
        )AS distance
         FROM homerproviders INNER JOIN
         productsproviders on homerproviders.ui = productsproviders.providerId
         HAVING distance < ${parseFloat(distance)}
         ORDER BY distance ASC`, {
        // replacements: {ui: ui},
        type: sequelize.QueryTypes.SELECT
      });

    res.status(200).json({data:providers});
}
// WHERE ui = :ui

module.exports.ordersEnd = async(req, res) => {
   try{
        const {order} = req.body;
        const { state} = req.body;
        if(state=="solicitado"){
            state = "aceptado"
        }else if(state=="aceptado"){
            state == "he llegado"
        }else if(state=="he llegado"){
            state == "iniciado"
        }else if(state=="finalizado"){
            state == "finalizado"
        }else if(state=="cancelado"){
            state == "cancelado"
        }
        
        let response = await Order.update(
            {status:state},
            {where:{
                id:order                
            }}
        )
        res.status(200).json({data:response});
   }catch(e){
        console.log(e)
   }
}

// module.exports.changeState = async(req, res) => {
//  try{
//     const {orderid} = req.body;
//     let response = await order
//  }catch(e){
     
//  }
// }
