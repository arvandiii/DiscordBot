const fs = require('node:fs');
const path = require('node:path');
const Promise = require('bluebird')
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const config = require('../config.json');
const { Server } = require('./models/Server');
const { RoleCode } = require('./models/RoleCode');
const { generateCode } = require('./utils');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commands = []
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST({ version: '10' }).setToken(config.token)

const delpoyCommands = async ({ guildId }) => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    console.log('omade injaaaaa', interaction)
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

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
                parentId: 1,
            },
            {
                name: "announcements",
                type: 0,
                id: 3,
                parentId: 1
            },
            {
                name: "rules",
                type: 0,
                id: 4,
                parentId: 1
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
                parentId: 5
            },
            {
                name: "general-help",
                type: 0,
                id: 7,
                parentId: 5
            },
            {
                name: "off-topic",
                type: 0,
                id: 8,
                parentId: 5
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
                parentId: 9
            },
            {
                name: "looking for team",
                type: 0,
                id: 11,
                parentId: 9
            },
            {
                name: "team registration",
                type: 0,
                id: 12,
                parentId: 9
            },
        ]
    });
    await Server.findOneAndUpdate({ id: Guild.id }, { $set: { channels: [], name: serverName } }, { new: true, upsert: true })
    console.log(await Server.find({}))
    const GuildChannel = await Guild.channels.cache.find(channel => channel.name == "welcome");
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
    const code1 = generateCode(6)
    const code2 = generateCode(6)
    await RoleCode.findOneAndUpdate(
        { serverId: Guild.id },
        { $set: { role: 'instructor', code: code1, isUsed: false } },
        { new: true, upsert: true })
    await RoleCode.findOneAndUpdate(
        { serverId: Guild.id },
        { $set: { role: 'instructor', code: code2, isUsed: false } },
        { new: true, upsert: true })
    await delpoyCommands({ guildId: Guild.id })
    return { inviteUrl: Invite.url, codes: [code1, code2] }
}


client.on("ready", async () => {
    const guilds = client.guilds.cache.map((guild) => guild)
    const Guilds = await Promise.map(guilds, async (guild) => {
        const g = await guild.delete()
        console.log(`Deleted the guild ${g}`)
        // await delpoyCommands({ guildId: guild.id })
    })
});


client.login(config.token);

module.exports = { createServer }