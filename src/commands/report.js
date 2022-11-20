const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { Group } = require('../models/Group');
const { Progress } = require('../models/progress');
const QuickChart = require('quickchart-js');
const _ = require('underscore')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .addStringOption(option =>
            option
                .setName('team-name')
                .setDescription('give the team name to get the progress report')
                .setRequired(true))
        .setDescription('get report'),
    async execute(interaction) {
        const teamName = interaction.options.getString('team-name');
        const progresses = await Progress.find({ serverId: interaction.guildId, groupTeamName: teamName })
        console.log(progresses)
        const chart = new QuickChart()

        const labels = _.uniq(_.map(progresses, p => p.username))
        const datasets = _.map(labels, l => {
            const sumMins = _.reduce(progresses, (memo, p) => {
                if (p.username === l ){
                    return memo + p.mins
                }
                return memo
            }, 0)
            return sumMins
        })

        chart.setConfig(`{
            "type": "outlabeledPie",
            "data": {
              "labels": ${JSON.stringify(labels)},
              "datasets": [{
                  "backgroundColor": ["#FF3784", "#36A2EB"],
                  "data": ${JSON.stringify(datasets)}
              }]
            },
            "options": {
              "plugins": {
                "legend": false,
                "outlabels": {
                  "text": "%l %p",
                  "color": "white",
                  "stretch": 35,
                  "font": {
                    "resizable": true,
                    "minSize": 12,
                    "maxSize": 18
                  }
                }
              }
            }
        }`)
        const url = chart.getUrl()

        await interaction.reply(url)
    },
}
