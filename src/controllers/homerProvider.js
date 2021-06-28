const sequelize = require("../db");
const HomerProvider = require("../models/HomerProvider");
const ProductsProvider = require("../models/Productsprovider");
const Order = require("../models/Order");
const Message = require("../models/Message");
const { sendNotification } = require("../utils/notification");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports.updateProvider = async (homerid, state) => {
  return await HomerProvider.update(
    { state: state },
    {
      where: {
        id: homerid,
      },
    }
  );
};

module.exports.updateOrder = async (orderId) => {
  return await Order.update(
    {
      status: "cancelado",
      isCount: true,
      isCountNow: false,
      isCancel: "Se ha cancelado por que tu homer no acepto la solicitud",
    },
    {
      where: {
        id: orderId,
      },
    }
  );
};

module.exports.updateStateOrderCount = async (orderId) => {
  return await Order.update(
    {
      isCountNow: true,
    },
    {
      where: {
        id: orderId,
      },
    }
  );
};

module.exports.addProvider2 = async (req, res) => {
  try {
    console.log("hola mundo", req.body);
    let newProvider = await HomerProvider.create({
      ui: req.body.id,
      state: true,
      lat: req.body.lat,
      lng: req.body.lng,
      onesignal: req.body.onesignal,
    });
    if (newProvider) {
      let providerId = newProvider.ui;
      for (let i = 0; i < req.body.products.length; i++) {
        await ProductsProvider.create({
          ui: req.body.products[i],
          providerId: providerId,
        });
      }
      res.status(200).json({
        message: "Provider created successfully",
        data: newProvider,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something goes wrong" + error,
      data: {},
    });
  }
};

module.exports.addProvider = async (data) => {
  try {
    const { id, lat, lng, products, onesignal } = data;

    // await HomerProvider.find

    let newProvider = await HomerProvider.create({
      ui: id,
      state: true,
      lat: lat,
      lng: lng,
      onesignal: onesignal,
    });
    if (newProvider) {
      let providerId = newProvider.ui;
      for (let i = 0; i < products.length; i++) {
        await ProductsProvider.create({
          ui: products[i].id,
          providerId: providerId,
        });
      }
      return {
        message: "Provider created successfully",
        data: newProvider,
      };
    }
  } catch (error) {
    return {
      message: "Something goes wrong" + error,
      data: {},
    };
  }
};
module.exports.searchProvider = async (ui) => {
  try {
    return await HomerProvider.findOne({ where: { ui: ui } });
  } catch (error) {
    console.log("error" + error);
  }
};

module.exports.deleteProvider = async (ui) => {
  try {
    await HomerProvider.destroy({ where: { ui: ui } });
    await ProductsProvider.destroy({ where: { providerId: ui } });
    return {
      message: "Provider was deleted",
      data: {},
    };
  } catch (error) {
    return {
      message: "Something goes wrong" + error,
      data: {},
    };
  }
};

module.exports.getMessage = async (req, res) => {
  try {
    let response = await Message.findAll({
      where: {
        roomName: req.body.roomName,
      },
    });
    if (response.length > 0) {
      res.status(200).json({ message: "success", data: response });
    }
  } catch (e) {
    console.log(`error ${e}`);
  }
};

module.exports.addMessage = async (
  messageContent,
  userName,
  roomName,
  created
) => {
  try {
    await Message.create({
      text: messageContent,
      from: userName,
      roomName: roomName,
      created: created,
    });
  } catch (e) {
    console.log(`error ${e}`);
  }
};

module.exports.createOrders = async (req, res) => {
  try {
    let address = "";
    const {
      clientUi,
      nameClient,
      productUi,
      productName,
      stateServiceId,
      date,
      hour,
      location,
      lat,
      lng,
      onesignal,
    } = req.body;
    // let googleInfo = await axios.get(
    //   "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    //     lat +
    //     "," +
    //     lng +
    //     "&key=AIzaSyBofvEOcrzbxSfBA7LTFSypr5SX3TT94Dk&sensor=false"
    // );
    // console.log(googleInfo);

    let newService = await Order.create({
      clientUi: clientUi,
      nameClient: nameClient,
      productUi: productUi,
      productName: productName,
      stateServiceId: stateServiceId,
      date: moment(date, "YYYY-MM-DD"),
      hour: hour,
      location: location,
      lat: lat,
      lng: lng,
      onesignal,
    });
    if (newService) {
      res.status(200).json({
        message: "Provider created successfully",
        data: newService,
      });
    }
  } catch (error) {
    res.status(200).json({
      message: "Something goes wrong" + error,
      data: {},
    });
  }
};

module.exports.getOrderByProvider = async (provider) => {
  try {
    return await sequelize.query(
      `SELECT DISTINCT(productsproviders.providerId), orders.* FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${provider} and orders.status = 1 or orders.status = 2 or orders.status = 3 or orders.status = 4 `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  } catch (e) {
    return {
      message: "Something goes wrong" + error,
    };
  }
};

module.exports.getOrderCancelByProvider = async (req, res) => {
  try {
    let response = await sequelize.query(
      `SELECT DISTINCT(productsproviders.providerId), orders.* FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${req.body.provider} and orders.status = 7 or orders.status =5`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ message: "success", data: response });
  } catch (e) {
    console.log(`error ${e}`);
  }
};

module.exports.getOrderByClient = async (client) => {
  try {
    return await sequelize.query(
      `SELECT DISTINCT(productsproviders.providerId), orders.*, homerproviders.onesignal  FROM orders INNER JOIN
            productsproviders on productsproviders.ui = orders.productUi INNER JOIN homerproviders on homerproviders.ui = productsproviders.providerId 
            where orders.clientUi = ${client}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  } catch (e) {
    return {
      message: "Something goes wrong" + error,
    };
  }
};
module.exports.nearBy = async (req, res) => {
  const { lat, lng, distance } = req.body;
  let providers = await sequelize.query(
    `SELECT homerproviders.ui,homerproviders.lat,homerproviders.lng,homerproviders.onesignal, productsproviders.ui, (6371 * ACOS(
            SIN(RADIANS(lat)) * SIN(RADIANS(${lat})) 
            + COS(RADIANS(lng - ${lng})) * COS(RADIANS(lat))
            * COS(RADIANS(${lat}))
            )
        )AS distance
         FROM homerproviders INNER JOIN
         productsproviders on homerproviders.ui = productsproviders.providerId
         HAVING distance < ${parseFloat(distance)}
         ORDER BY distance ASC`,
    {
      // replacements: {ui: ui},
      type: sequelize.QueryTypes.SELECT,
    }
  );

  res.status(200).json({ data: providers });
};
// WHERE ui = :ui

module.exports.ChangeOrders = async (req, res) => {
  try {
    const { order, state, isCancel } = req.body;

    let response;
    if (state === "solicitado") {
      response = await Order.update(
        { status: "aceptado" },
        {
          where: {
            id: order,
          },
        }
      );
    } else if (state === "aceptado") {
      response = await Order.update(
        { status: "he llegado" },
        {
          where: {
            id: order,
          },
        }
      );
    } else if (state === "he llegado") {
      response = await Order.update(
        { status: "iniciado" },
        {
          where: {
            id: order,
          },
        }
      );
    } else if (state === "iniciado") {
      response = await Order.update(
        { status: "finalizado" },
        {
          where: {
            id: order,
          },
        }
      );
    } else if (state === "cancelado") {
      response = await Order.update(
        { status: "cancelado", isCancel: isCancel },
        {
          where: {
            id: order,
          },
        }
      );
    }
    res.status(200).json({ data: response });
  } catch (e) {
    console.log(e);
  }
};

module.exports.providerOneSignal = async (req, res) => {
  let providers = await sequelize.query(
    `SELECT * FROM homerproviders INNER JOIN
             productsproviders on homerproviders.ui = productsproviders.providerId
             where productsproviders.ui = ${req.body.product}`,
    {
      // replacements: {ui: ui},
      type: sequelize.QueryTypes.SELECT,
    }
  );

  res.status(200).json({ providers });
};

module.exports.changeState = async () => {
  try {
    await Order.decrement(
      { countDown: 1 },
      { where: { status: 1, countDown: { [Op.gt]: 0 } } }
    );

    Order.findAll({ where: { countDown: 0, status: 1 } }).then(function (
      order
    ) {
      order.forEach(async function (t) {
        sendNotification(
          t.onesignal,
          "Servicio expirado",
          "Estimado usuario, el servicio no fue aceptado, por lo tanto expiró. Intente nuevamente, o intente con otro Homer"
        );

        t.update({ status: 7 });

        let providers = await sequelize.query(
          `SELECT * FROM homerproviders as hp INNER JOIN                 
                 productsproviders as pp on pp.providerId = hp.ui 
                 where pp.ui = ${t.productUi} `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        providers.forEach(function (t) {
          sendNotification(
            t.onesignal,
            "Servicio expirado",
            "Estimado Homer, no has aceptado un servicio y por lo tanto se le ha notificado al cliente que no estas disponible"
          );
        });
      });
    });
  } catch (error) {
    console.log(`error ${error}`);
  }
};
