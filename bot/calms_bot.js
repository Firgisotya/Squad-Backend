const cron = require("node-cron");
const { valcalDB } = require("../config/connection");
const TelegramBot = require("node-telegram-bot-api");

// Telegram bot configuration
const botToken = "6045995694:AAExypFpfL1isMjoQ1BLK7KU0REs-OTT-v0";
const chatId = "-985347458";

// Create Telegram bot
const bot = new TelegramBot(botToken, { polling: true });

// Send message to Telegram
function sendNotification(chatId, message) {
  bot.sendMessage(chatId, message);
}

cron.schedule("0 10 * * 1,4", async () => {
  const result = await valcalDB.query(`SELECT a.*,
    b.category,c.sub_category,d.departement,e.area,f.sub_area,g.area,h.vendor
    FROM trans_kalibrasi a 
    left JOIN mst_category b ON a.category = b.id
    left JOIN mst_sub_category c ON a.sub_category = c.id
    LEFT JOIN mst_dept d ON a.departement = d.id
    left JOIN mst_area e ON a.area = e.id
    left JOIN mst_sub_area f ON a.sub_area = f.id
    LEFT JOIN mst_sub_detail g ON a.sub_area_detail = g.id
    LEFT JOIN mst_vendor h ON a.vendor_calibration = h.id
    WHERE a.exp_calibration between NOW() and (DATE_ADD(NOW(), INTERVAL 2 MONTH))  
    AND a.isactive=1`);

  result.then((data) => {
    const rows = data[0];
    let message = "";
    if (rows.length > 0) {
      message =
        "Ada " +
        rows.length +
        " data yang akan habis masa berlakunya dalam 2 bulan kedepan. Berikut detailnya:\n\n";
      rows.forEach((row, index) => {
        message +=
          index +
          1 +
          ". " +
          "Nama Alat : " +
          row.equipment_name +
          " (" +
          row.serial_number +
          ")\n";
        message += "    No Dokumen : " + row.no_dok + "\n";
        message += "    Tanggal Kalibrasi: " + row.tanggal_calibration + "\n";
        message += "    Tanggal Expired: " + row.exp_calibration + "\n\n";
      });
    } else {
      message =
        "Tidak ada data yang akan habis masa berlakunya dalam 2 bulan kedepan.";
    }
    sendNotification(chatId, message);
  });
});
