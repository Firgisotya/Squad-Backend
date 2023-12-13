const cron = require("node-cron");
const { node_redDB } = require("../config/connection");
const TelegramBot = require("node-telegram-bot-api");

// Telegram bot configuration
const botToken = "6987924690:AAHJkGjUixfbX-rL39tFE9mV0WrU_r9jq7U";
const chatId = "1252209321";

// Create Telegram bot
const bot = new TelegramBot(botToken, { polling: true });

// Send message to Telegram
function sendNotification(chatId, message) {
    bot.sendMessage(chatId, message);
}




cron.schedule("*/5 * * * * *", async () => {
    const result = await node_redDB.query(
        "SELECT * FROM `tb_inspection` WHERE `status` = '0'"
    );

    result.then((data) => {
        if (data[0].length > 0) {
            sendNotification(chatId, "Ada inspeksi baru nih!");
        }

        console.log(data[0]);
    })
    // sendNotification(chatId, "Hello, world!");

});

