const { Client, MessageEmbed } = require("discord.js");
const r = require("rethinkdb")

class Base extends Client {
    constructor(clientOptions) {
        super(clientOptions);

        this.version = "v4.7"
    }
    builder (interaction, title, text, footer, color, fields = [], image, ephemeral = false) {
        const embed = new MessageEmbed()
            .setTimestamp();
        if (title) embed.setTitle(title);
        if (text) embed.setDescription(text);
        if (color) embed.setColor(color);
        if (footer) embed.setFooter(footer);
        if (image) embed.setImage(image);
        if (fields.length) embed.addFields(fields);
        return interaction.reply({ embeds: [embed], allowedMentions: {parse: []}, ephemeral: ephemeral});
    }
}
module.exports = Base;