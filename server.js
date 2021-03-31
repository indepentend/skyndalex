const Discord = require("discord.js-light")
const fs = require("fs")
const { prefix, token } = require("./config.json")
const KriveManager = require("./Client.js")
const client = new KriveManager({
	cacheGuilds: true,
	cacheChannels: true,
	cacheOverwrites: true,
	cacheRoles: true,
	cacheEmojis: true,
	cachePresences: false,
})
const express = require('express')
const app = express()
const port = 6969

app.get('/', (req, res) => {
	res.send('Sent')
})

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
const r = require("rethinkdb")
	r.connect({db: "krivebot"}, (err, con) => {
		if (err) console.log(err)
		client.con = con;
	})
client.on("ready", () => {
	console.log("Client ready!")
});
client.ws.on('INTERACTION_CREATE',  interaction => {
	switch(interaction.data.name.toLowerCase()) {
		case 'ping':
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: client.ws.ping
					}
				}
			})
			break;
		case 'authors':
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: "entity#8309"
					}
				}
			})
			break;
		case 'discord':
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: "https://krivebot.xyz/discord"
					}
				}
			})
			break;
		case 'page':
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: "https://krivebot.xyz"
					}
				}
			})
			break;
		case 'invite':
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: "https://krivebot.xyz/invite"
					}
				}
			})
			break;
		case 'public':
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: "https://krivebot.xyz/public"
					}
				}
			})
			break;
	}

});

client.commands = new Discord.Collection();

fs.readdirSync("./commands/").forEach(dir => {
	const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

	for (let file of commands) {
		let pull = require(`./commands/${dir}/${file}`);
		if (pull.help && pull.help.name) {
			console.log(`Loaded command: ${file}`);
			client.commands.set(pull.help.name, pull);
		} else {
			continue;
		}
	}
});

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	const eventName = file.split(".")[0];
	console.log(`Loaded event: ${file}`);
	client.on(eventName, event.bind(null, client));
}

require("./func.js")(client);

client.login(token)