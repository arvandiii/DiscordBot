const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { Group } = require('../models/Group');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('team-registration')
        .addStringOption(option =>
            option
                .setName('team-name')
                .setDescription('give your team name')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('teammate')
                .setDescription('teammate')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('teammate-2')
                .setDescription('next teammate'))
        .setDescription('register your team'),
    async execute(interaction) {
        const teamName = interaction.options.getString('team-name');
        const teammate = interaction.options.getUser('teammate');
        const teammate2 = interaction.options.getUser('teammate-2');
        const members = [interaction.user.id, teammate.id]
        if (teammate2) {
            members.push(teammate2.id)
        }
        await interaction.reply(
            `:white_check_mark:Team Registered\nTeam Name: ${teamName}
Members: ${interaction.user.toString()}, ${teammate.toString()}${teammate2 ? ' ,' + teammate2.toString() : ''}`)
        await Group.findOneAndUpdate({ serverId: interaction.guildId }, { $set: { teamName, members: [] } }, { new: true, upsert: true })
        const teamChannel = await interaction.guild.channels.cache.find(channel => channel.name == "Team");
        const everyoneRole = interaction.guild.roles.everyone;
        const overwritePermissions = members.map(m =>
            ({ type: 'member', id: m, allow: [PermissionsBitField.Flags.ViewChannel] }))
        overwritePermissions.push({ type: 'role', id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel] })
        console.log('per per', overwritePermissions)
        const textChannel = await interaction.guild.channels.create({
            name: `team-${teamName}`,
            type: 0,
            permissionOverwrites: overwritePermissions
        })
        await textChannel.setParent(teamChannel.id,  { lockPermissions: false })
        const voiceChannel = await interaction.guild.channels.create({
            name: `team-${teamName}`,
            type: 2,
            permissionOverwrites: overwritePermissions
        })
        await voiceChannel.setParent(teamChannel.id,  { lockPermissions: false })
    },
}
