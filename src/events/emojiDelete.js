const { MessageEmbed } = require("discord.js")
const r = require("rethinkdb")

module.exports = {
    name: "emojiDelete",
    once: false,

  async execute(client, emoji) {
        const logChannel = await r.table("logs").get(emoji.guild.id).run(client.con)
        if (!logChannel?.emojiDelete) return;

        const embed = new MessageEmbed()
        .setDescription(`**Usunięto emoji!**\n\nID: ${emoji.id} `)
        .setColor("RED")
        emoji.guild.channels.cache.get(logChannel.emojiDelete).send({embeds: [embed]})
    }
}