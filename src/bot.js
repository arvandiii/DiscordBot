const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = 'MTA0MzYzNzg4ODg5NTY4ODc4Ng.GZyPQ7.UZ-sK8IWQCzdEZbJ9e52dhIfqGB5-azjHKS74o'
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

const createServer = async ({ serverName, modIds }) => {
    const Guild = await client.guilds.create({
        name: serverName,
        channels: [
            { "name": "invite-channel" },
        ]
    });
    const GuildChannel = Guild.channels.cache.find(channel => channel.name == "invite-channel");
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
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