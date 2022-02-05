const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "test",
    description: "test.",
    run: async (client, interaction) => {
        fetch ("https://api.github.com/repos/Skyndalex/skyndalex/commits/beta")
            .then(res => res.json())
            .then(async res => {
                 let embed = new MessageEmbed()
                     .setTitle(`Last commit info`)
                     .addField(`Message`, `${res.commit.message}`)
                     .addField(`Author`, `${res.commit.author.name}`)
                     .addField(`Comments count`, `${res.commit.comment_count}`)
                interaction.reply({ embeds: [embed]})
            })
    }
}
