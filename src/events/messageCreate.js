const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
const Twitter = require("twitter");
module.exports = {
    name: "messageCreate",
    once: false,

    async execute (client, message) {
        const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);

        const mention = new MessageEmbed()
            .setTitle("Informacja!")
            .setDescription("Jeśli nie widzisz komend bota po ukośniku (/) [dodaj bota jeszcze raz](https://krivebot.xyz/invite) aby włączyć komendy.\n[Lepiej, żebyś zobaczył](https://docs.krivebot.xyz) permisje wymagane przez nas, aby bot działał poprawnie.")
            .setColor("ORANGE")
            .setTimestamp()
        if (message.content.match(prefixMention)) {
            return message.channel.send({embeds: [mention], ephemeral: true});
        };

        let twitterClient = new Twitter({

        })
    }
}