const cron = require("node-cron");
const { iot_oci1 } = require("../config/connection");
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

module.exports = {
    bpdBot: async (req, res) => {
        try {
            const { min, date, line } = req.body;
            console.log(min, date, line);

            sendNotification(chatId, `\nDate: ${date} \nMin: ${min} \n\nBPD ${line} mendekati batas minimum!`);

            res.status(200).json({
                message: "Send Notification Success",
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Get All Data BPD OC1 Failed",
            });
        }
    }

}


