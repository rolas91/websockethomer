const axios = require("axios");
module.exports.sendNotificationClient = (onesignalid, title, content) => {
  axios
    .post("https://onesignal.com/api/v1/notifications", {
      app_id: "8ad1c280-92da-4d39-b49c-cf0a81e0d1fc",
      include_player_ids: [`${onesignalid}`],
      data: { foo: "bar" },
      headings: { en: `${title}` },
      contents: { en: `${content}` },
    })
    .then((data) => {
      if (data) console.log("notification success");
    })
    .catch((error) => {
      console.log(`Error en ${error.message}`);
    });
};

module.exports.sendNotificationProvider = (onesignalid, title, content) => {
  axios
    .post("https://onesignal.com/api/v1/notifications", {
      app_id: "644f4795-d5c2-4d00-aead-1682204aacbc",
      include_player_ids: [`${onesignalid}`],
      data: { foo: "bar" },
      headings: { en: `${title}` },
      contents: { en: `${content}` },
    })
    .then((data) => {
      if (data) console.log("notification success");
    })
    .catch((error) => {
      console.log(`Error en ${error.message}`);
    });
};
