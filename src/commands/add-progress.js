const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { Group } = require('../models/Group');
const { Progress } = require('../models/progress');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-progress')
        .addStringOption(option =>
            option
                .setName('phase')
                .setDescription('give the phase of the project you worked on')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('comment')
                .setDescription('comment')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('mins')
                .setDescription('give the amount of time you have worked based on minitues')
                .setRequired(true))
        .setDescription('add progress'),
    async execute(interaction) {
        const mins = interaction.options.getInteger('mins');
        const phase = interaction.options.getString('phase');
        const comment = interaction.options.getString('phase');
        const user = interaction.user
        await interaction.reply(
            `Progress added\nmember: ${user.toString()}\nphase: ${phase}\nduration: ${mins}\n${comment}`)
        console.log('khoooob', user.id)
        const group = await Group.findOne({ members: user.id })
        console.log('mikhad besaze', group, user.id)
        await Progress.create({ userId: user.id, mins, phase, comment, serverId: interaction.guildId, groupTeamName: group.teamName, username: user.tag })
    },
}
