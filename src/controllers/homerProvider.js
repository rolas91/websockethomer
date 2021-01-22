const sequelize = require('../db');
const axios = require('axios');
const HomerProvider = require('../models/HomerProvider');
const ProductsProvider = require('../models/Productsprovider');
const Order = require('../models/Order');
const Message = require('../models/Message');

module.exports.addProvider = async(data) => {
    try {
        
        const {id, lat, lng, products,onesignal} = data;

        // await HomerProvider.find

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

module.exports.getMessage = async(req, res) => {
    try{
        let response = await Message.findAll({
            where:{
                roomName:req.body.roomName
            }
        });
        if(response.length > 0){
            res.status(200).json({message:"success", data:response});
        }
    }catch(e){
        console.log(`error ${e}`)
    }
}

module.exports.addMessage = async(messageContent, userName, roomName, created) => {
    try{
        await Message.create({
            text:messageContent, 
            from:userName, 
            roomName:roomName,
            created:created
        })
    }catch(e){
        console.log(`error ${e}`)
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
        return await sequelize.query(
            `SELECT DISTINCT(productsproviders.providerId), orders.* FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${provider} and orders.status = 1 or orders.status = 2 or orders.status = 3 or orders.status = 4 or orders.status = 5`,{
                type: sequelize.QueryTypes.SELECT
              });
    }catch(e){
        return {
            message:'Something goes wrong'+error
        }
    }
}

module.exports.getOrderCancelByProvider = async(req, res) => {
    try{    
        let response = await sequelize.query(
            `SELECT DISTINCT(productsproviders.providerId), orders.* FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${req.body.provider} and orders.status = 7`,{
                type: sequelize.QueryTypes.SELECT
              });
        res.status(200).json({message:"success", data:response})
    }catch(e){
        console.log(`error ${e}`)
    }
}

module.exports.getOrderByClient = async(client) => {
    try{
        return await sequelize.query(
            `SELECT DISTINCT(productsproviders.providerId), orders.*, homerproviders.onesignal  FROM orders INNER JOIN
            productsproviders on productsproviders.ui = orders.productUi INNER JOIN homerproviders on homerproviders.ui = productsproviders.providerId 
            where orders.clientUi = ${client}`,{
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

module.exports.ChangeOrders = async(req, res) => {
   try{
        const {order} = req.body;
        let { state } = req.body;
        let {isCancel} = req.body;
        let response;
        if(state==="solicitado"){
            response = await Order.update(
                {status:"aceptado"},
                {where:{
                    id:order                
                }}
            )
        }else if(state==="aceptado"){
            response = await Order.update(
                {status:"he llegado"},
                {where:{
                    id:order                
                }}
            )
        }else if(state==="he llegado"){
            response = await Order.update(
                {status:"iniciado"},
                {where:{
                    id:order                
                }}
            )
        }else if(state==="iniciado"){
            response = await Order.update(
                {status:"finalizado"},
                {where:{
                    id:order                
                }}
            )
        }else if(state==="cancelado"){            
            response = await Order.update(
                {status:"cancelado",isCancel:isCancel},
                {where:{
                    id:order                
                }}
            )
        }
        res.status(200).json({data:response});
   }catch(e){
        console.log(e)
   }
}
