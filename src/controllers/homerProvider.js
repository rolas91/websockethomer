const sequelize = require("../db");
const HomerProvider = require("../models/HomerProvider");
const ProductsProvider = require("../models/Productsprovider");
const Order = require("../models/Order");
const Message = require("../models/Message");
const {
  sendNotificationClient,
  sendNotificationProvider,
} = require("../utils/notification");
const moment = require("moment");
const { Op } = require("sequelize");
const axios = require("axios");

let consumer_key = "ck_462b7613b1f89991924e149f7d7df2a1c37eb71a";
let consumer_secret = "cs_81a58277089318569168ff48defefa83fa740d86";
module.exports.updateProvider = async (homerid, state, data, ui) => {
  try {
    const { id, lat, lng, products, onesignal } = data;

    let homer = await HomerProvider.findOne({
      where: {
        id: homerid,
      },
    });

    console.log("test si viene onesignal hash", onesignal);

    await HomerProvider.update({ onesignal: onesignal }, { where: { ui: id } })
      .then((result) => console.log("updated success", result))
      .catch((err) => console.log("error", err));

    if (homer) {
      let productsFound = await ProductsProvider.findAll({
        where: { providerId: homer.ui },
      });

      if (productsFound.length > 0) {
        await ProductsProvider.destroy({
          where: { providerId: productsFound[0].providerId },
        });
        for (let i = 0; i < products.length; i++) {
          let product_provider = await ProductsProvider.findOne({
            where: { ui: products[i].id },
          });
          if (product_provider == null || product_provider == undefined) {
            await ProductsProvider.create({
              ui: products[i].id,
              providerId: productsFound[0].providerId,
            });
          }
        }
      } else {
        for (let i = 0; i < products.length; i++) {
          let product_provider = await ProductsProvider.findOne({
            where: { ui: products[i].id },
          });
          if (product_provider == null || product_provider == undefined) {
            await ProductsProvider.create({
              ui: products[i].id,
              providerId: ui,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(`error en ${error}`);
  }
};

module.exports.updateOrder = async (orderId) => {
  return await Order.update(
    {
      status: "cancelado",
      isCount: true,
      isCountNow: false,
      isCancel: "Se ha cancelado por que tu Homer no acepto la solicitud",
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

module.exports.createProvider = async (req, res) => {
  try {
    const provider = await HomerProvider.findOne({
      where: { ui: req.body.providerId },
    });
    if (provider != null) {
      ProductsProvider.create({
        ui: req.body.product,
        providerId: provider.ui,
      }).then((success) => {
        if (success) {
          res.status(200).json({
            code: "success",
            message: "Provider created successfully",
          });
        } else {
          res.status(200).json({
            code: "error",
            message: "Provider created error",
          });
        }
      });
    }
  } catch (error) {}
};

module.exports.addProvider = async (data) => {
  try {
    const { id, lat, lng, products, onesignal } = data;

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
        let product_provider = await ProductsProvider.findOne({
          where: { ui: products[i].id },
        });
        if (product_provider == null || product_provider == undefined) {
          await ProductsProvider.create({
            ui: products[i].id,
            providerId: providerId,
          });
        }
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
      hour_end,
      location,
      lat,
      lng,
      notes,
      onesignal,
      categories,
      cart,
      bookingId,
    } = req.body;
    console.log("categorias", categories, notes);
    // let googleInfo = await axios.get(
    //   "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    //     lat +
    //     "," +
    //     lng +
    //     "&key=AIzaSyBofvEOcrzbxSfBA7LTFSypr5SX3TT94Dk&sensor=false"
    // );

    // console.log(googleInfo);

    const order = await Order.findOne({ where: { bookingId } });
    if (order) {
      res.status(200).json({
        status: false,
        message: "has already registered",
      });
      return;
    }

    let newService = await Order.create({
      clientUi: clientUi,
      nameClient: nameClient,
      productUi: productUi,
      productName: productName,
      stateServiceId: stateServiceId,
      date: moment(date, "DD-MM-YYYY").format(),
      hour: hour,
      hour_end: hour_end,
      location: location,
      lat: lat,
      lng: lng,
      notes: notes,
      categories: JSON.stringify(categories),
      onesignal,
      cart,
      bookingId,
    });
    if (newService) {
      res.status(200).json({
        status: true,
        message: "Provider created successfully",
        data: newService,
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: "Something goes wrong" + error,
      data: {},
    });
  }
};

module.exports.getOrderByProvider = async (provider) => {
  try {
    return await sequelize.query(
      `SELECT DISTINCT(productsproviders.providerId), orders.id, orders.clientUi, orders.nameClient,orders.productUi, orders.productName,
      orders.status,orders.isCancel,orders.isCount,orders.isCountNow,orders.date, time_format(orders.hour, '%H:%i') as hour,  time_format(orders.hour_end, '%H:%i') as hour_end ,orders.location,orders.lat,orders.lng,
      orders.onesignal,orders.countDown,orders.cart,orders.bookingId, orders.notes, orders.categories FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${provider} and (orders.status = 1 or orders.status = 2 or orders.status = 3 or orders.status = 4 ) order by orders.id DESC`,
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
      `SELECT DISTINCT(productsproviders.providerId), orders.id, orders.clientUi, orders.nameClient,orders.productUi, orders.productName,
      orders.status,orders.isCancel,orders.isCount,orders.isCountNow,orders.date, time_format(orders.hour, '%H:%i') as hour,  time_format(orders.hour_end, '%H:%i') as hour_end, orders.location,orders.lat,orders.lng,
      orders.onesignal,orders.countDown,orders.cart,orders.bookingId, orders.notes, orders.categories FROM orders INNER JOIN
             productsproviders on productsproviders.ui = orders.productUi
             where productsproviders.providerId = ${req.body.provider} and (orders.status = 5 or orders.status = 6 or orders.status = 7) order by orders.id DESC`,
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
      `SELECT DISTINCT(productsproviders.providerId), orders.id, orders.clientUi, orders.nameClient,orders.productUi, orders.productName,
      orders.status,orders.isCancel,orders.isCount,orders.isCountNow,orders.date, time_format(orders.hour, '%H:%i') as hour,  time_format(orders.hour_end, '%H:%i') as hour_end , orders.location,orders.lat,orders.lng,
      orders.onesignal,orders.countDown,orders.cart,orders.bookingId, homerproviders.onesignal,  orders.notes, orders.categories, orders.isRating  FROM orders INNER JOIN
            productsproviders on productsproviders.ui = orders.productUi INNER JOIN homerproviders on homerproviders.ui = productsproviders.providerId 
            where orders.clientUi = ${client} order by orders.id DESC`,
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

module.exports.ChangeOrders = async (req, res) => {
  try {
    const { order, state, isCancel, client } = req.body;
    let response;
    if (state === "solicitado") {
      response = await Order.update(
        { status: "aceptado" },
        {
          where: {
            bookingId: order,
          },
        }
      );
    } else if (state === "pagado") {
      response = await Order.update(
        { status: "pagado" },
        {
          where: {
            bookingId: order,
          },
        }
      );

      let ordered = await Order.findOne({
        where: { bookingId: order, status: "pagado" },
      });

      let providers = await sequelize.query(
        `SELECT * FROM homerproviders as hp INNER JOIN                 
                 productsproviders as pp on pp.providerId = hp.ui 
                 where pp.ui = ${ordered.productUi} `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      providers.forEach(function (t) {
        sendNotificationProvider(
          t.onesignal,
          "Servicio pagado",
          "El cliente ha pagado el servicio."
        );
      });
    } else if (state === "iniciado") {
      response = await Order.update(
        { status: "iniciado" },
        {
          where: {
            bookingId: order,
          },
        }
      );
    } else if (state === "finalizado") {
      response = await Order.update(
        { status: "finalizado" },
        {
          where: {
            bookingId: order,
          },
        }
      );
    } else if (state === "cancelado") {
      response = await Order.update(
        { status: "cancelado", isCancel: isCancel },
        {
          where: {
            bookingId: order,
          },
        }
      );

      let ordered = await Order.findOne({
        where: { bookingId: order, status: "cancelado" },
      });

      if (client == true) {
        sendNotificationClient(
          ordered.onesignal,
          "Servicio cancelado",
          "Estimado usuario, has cancelado el pago del servicio por tanto el servicio se ha cancelado"
        );
      }

      await axios({
        method: "DELETE",
        url: `${process.env.URL_WORDPRESS}/wp-json/wc-bookings/v1/bookings/${ordered.bookingId}?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then(function (response) {
          console.log("carrito eliminado correctamente");
        })
        .catch(function (err) {
          console.error(err);
        });

      let providers = await sequelize.query(
        `SELECT * FROM homerproviders as hp INNER JOIN                 
                 productsproviders as pp on pp.providerId = hp.ui 
                 where pp.ui = ${ordered.productUi} `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (client == true) {
        providers.forEach(function (t) {
          sendNotificationProvider(
            t.onesignal,
            "Servicio cancelado",
            "El cliente ha cancelado el pago del servicio por tanto no se ha completado."
          );
        });
      }
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

module.exports.changeState = async (req, res) => {
  try {
    await Order.decrement(
      { countDown: 1 },
      { where: { status: 1, countDown: { [Op.gt]: 0 } } }
    );

    Order.findAll({ where: { countDown: 0, status: 1 } }).then(function (
      order
    ) {
      order.forEach(async function (t) {
        sendNotificationClient(
          t.onesignal,
          "Servicio expirado",
          "Estimado usuario, el servicio no fue aceptado, por lo tanto expiró. Intente nuevamente, o intente con otro Homer"
        );

        t.update({ status: 7 });

        await axios({
          method: "DELETE",
          url: `${process.env.URL_WORDPRESS}/wp-json/wc-bookings/v1/bookings/${t.bookingId}?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
          .then(function (response) {
            console.log("carrito eliminado correctamente");
          })
          .catch(function (err) {
            console.error(err);
          });

        let providers = await sequelize.query(
          `SELECT * FROM homerproviders as hp INNER JOIN                 
                 productsproviders as pp on pp.providerId = hp.ui 
                 where pp.ui = ${t.productUi} `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        providers.forEach(function (t) {
          sendNotificationProvider(
            t.onesignal,
            "Servicio expirado",
            "Un cliente ha solicitado tu servicio, sin embargo, ha expirado el tiempo de espera de 15 minutos para su aceptación. Estate atento."
          );
        });
      });
    });
  } catch (error) {
    console.log(`error ${error}`);
  }
};

module.exports.verifyStatus = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { bookingId: req.body.bookingid },
    });

    if (
      order.status == "cancelado" ||
      order.status == "rechazado" ||
      order.status == "finalizado"
    ) {
      res
        .status(200)
        .json({ code: "success", msg: "order is available for delete" });
    } else {
      res
        .status(200)
        .json({ code: "error", msg: "order is not available for delete" });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.verifyStatusForPay = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { bookingId: req.body.bookingid },
    });

    if (order.status === "solicitado") {
      res
        .status(200)
        .json({ code: "error", msg: "order is not available for pay" });
    } else {
      res
        .status(200)
        .json({ code: "success", msg: "order is available for pay" });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.rating = async (req, res) => {
  try {
    const updated = await Order.update(
      { isRating: true },
      { where: { bookingId: req.body.booking } }
    );
    console.log((updated[0]));
    if(updated[0] == 1){
      res.status(200).json({ code: "success"});
    }else{
      res.status(200).json({ code: "error"});
    }
  } catch (error) {
    console.log(error);
  }
};
