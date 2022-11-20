const { SlashCommandBuilder, Role } = require('discord.js');
const { Group } = require('../models/Group');
const { Instructor } = require('../models/Instructor');
const { RoleCode } = require('../models/RoleCode');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-my-role')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('give your code')
                .setRequired(true))
        .setDescription('set your role'),
    async execute(interaction) {
        const code = interaction.options.getString('code')
        const userId = interaction.user
        const serverId = interaction.guildId
        const roleCode = await RoleCode.findOne({ serverId, code })
        if (roleCode.isUsed) {
            await interaction.reply('Code invalid')
        } else {
            await Instructor.findOneAndUpdate({ serverId, userId }, {}, { upsert: true, new: true })
            await interaction.reply('You are instructor now')
            await RoleCode.findOneAndUpdate({ serverId, code }, { $set: { isUsed: true } })
        }
    },
}
