const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = 'MTA0MzYzNzg4ODg5NTY4ODc4Ng.Gd9lMV.txtu_kGQ9zIwa8SM47DSWKVp3C5oqyirNKc_fs'
// const CLIENT_ID = 1043637888895688786

// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!',
//     },
// ]

// // const rest = new REST({ version: '10' }).setToken(TOKEN)

// // const registerCommands = async () => {
// //     try {
// //         console.log('Started refreshing application (/) commands.')

// //         await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

// //         console.log('Successfully reloaded application (/) commands.')
// //     } catch (error) {
// //         console.error(error)
// //     }
// // }

// // registerCommands()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');

    }
});

const channels = {
    Information: {
        welcome: 1,
        announcements: 1,
        rules: 1
    },
    General: {
        "general-chat": 1,
        "general-help": 1,
        "off-topic": 1
    },
    Team: {
        "self introduction": 1,
        "looking for team": 1,
        "team registration": 1
    }
}

const createServer = async ({ serverName, modIds }) => {
    const Guild = await client.guilds.create({
        name: serverName,
        channels: [
            {
                name: "Information",
                type: 4,
                id: 1
            },
            {
                name: "welcome",
                type: 0,
                id: 2,
                parent_id: 1,
            },
            {
                name: "announcements",
                type: 0,
                id: 3,
                parent_id: 1
            },
            {
                name: "rules",
                type: 0,
                id: 4,
                parent_id: 1
            },
            {
                name: "General",
                type: 4,
                id: 5,
            },
            {
                name: "general-chat",
                type: 0,
                id: 6,
                parent_id: 5
            },
            {
                name: "general-help",
                type: 0,
                id: 7,
                parent_id: 5
            },
            {
                name: "off-topic",
                type: 0,
                id: 8,
                parent_id: 5
            },
            {
                name: "Team",
                type: 4,
                id: 9
            },
            {
                name: "self introduction",
                type: 0,
                id: 10,
                parent_id: 9
            },
            {
                name: "looking for team",
                type: 0,
                id: 11,
                parent_id: 9
            },
            {
                name: "team registration",
                type: 0,
                id: 12,
                parent_id: 9
            },
        ]
    });
    const GuildChannel = Guild.channels.cache.find(channel => channel.name == "welcome");
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
    return { inviteUrl: Invite.url }
}


client.on("ready", async () => {
    console.log("omade injaaaaa");
    const Guilds = client.guilds.cache.map(guild => {
        guild.delete()
            .then(g => console.log(`Deleted the guild ${g}`))
            .catch(console.error);
    });
    console.log("hameye guilds:", Guilds);
});

client.login(TOKEN);

module.exports = { createServer }