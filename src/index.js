const { Collection, Options } = require("discord.js");
const config = require("./config.json");
const Base = require("./base");
const fs = require('fs');

const dashboard = require('./dashboard/dashboard');

global.r = require("rethinkdb");
global.fetch = require("node-fetch");

const client = new Base({ intents: [ 32767 ], partials: ["MESSAGE", "CHANNEL", "REACTION"], makeCache: Options.cacheWithLimits({
        UserManager: 0, // client.users
        MessageManager: 0, // channel.messages
        BaseGuildEmojiManager: 0, // guild.emojis
        ChannelManager: 0, // client.channels
        /*
        ApplicationCommandManager: 0, // guild.commands
        GuildChannelManager: 0, // guild.channels
        GuildBanManager: 0, // guild.bans
        GuildInviteManager: 0, // guild.invites
        GuildManager: Infinity, // client.guilds
        GuildMemberManager: 0, // guild.members
        GuildStickerManager: 0, // guild.stickers
        GuildScheduledEventManager: 0, // guild.scheduledEvents
        PermissionOverwriteManager: 0, // channel.permissionOverwrites
        PresenceManager: 0, // guild.presences
        ReactionManager: 0, // message.reactions
        ReactionUserManager: 0, // reaction.users
        RoleManager: 0, // guild.roles
        StageInstanceManager: 0, // guild.stageInstances
        ThreadManager: 0, // channel.threads
        ThreadMemberManager: 0, // threadchannel.members
        VoiceStateManager: 0 // guild.voiceStates
         */
    })});

client.slashCommands = new Collection;
const commandFolders = fs.readdirSync('./commands');

global.arrayOfSlashCommands = [];
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.slashCommands.set(command.name, command);
        arrayOfSlashCommands.push(command)
    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
}

r.connect({db: config.rethinkdb.database, host: config.rethinkdb.host, port: config.rethinkdb.port, timeout: 600}, async function(err, con) {
    if (err) console.log(err)
    client.con = con;

    // const existTables = await r.tableList().run(con);
    //
    // const tables = ["autorole", "comments", "economy", "gbans", "giveaways", "logs", "notifications", "profiles",
    // "settings", "system", "todo", "warns"];
    //
    // for (const table of tables) {
    //     if(!existTables.includes(table)) {
    //         await r.tableCreate(table).run(con);
    //         console.log(`[RethinkDB] Created table ${table}`)
    //     }
    // }
    // console.log(await r.tableList().run(con))
    console.log("Connected to RethinkDB");
    // console.log("Connected to RethinkDB");
    // r.table("users").insert({id: "a", aa: "dadsaads"}).run(con);
    // r.table("users").insert({id: "b", aa: "dadsaads"}).run(con);
    // r.table("users").insert({id: "a", aa: "aadsadsadsadsa"}).run(con);
    // const d = await r.table("users").getAll("dsadsadsadsa", {index:'id'}).run(con);
    // console.log(d)

    if(config.api.enable) {
        dashboard(client);
    }
});


client.login(config.token)
