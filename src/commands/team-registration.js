const { SlashCommandBuilder } = require('discord.js');
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
        console.log('aaaaaa', members)
        await interaction.reply(
            `:white_check_mark:Team Registered\nTeam Name: ${teamName}
Members: ${interaction.user.toString()}, ${teammate.toString()}${teammate2 ? ' ,' + teammate2.toString() : ''}`)
        await Group.findOneAndUpdate({ serverId: interaction.guildId }, { $set: { teamName, members: [] } }, { new: true, upsert: true })
        const groups = await Group.find({})
        console.log('saadfadsfas', groups)
    },
}
