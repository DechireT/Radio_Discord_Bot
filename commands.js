const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = require("./commands.json");
const config = require("./config.json");

const rest = new REST({ version: '9' }).setToken(config.token);

module.exports = {

    setCommands: async function() {
        try {
            console.log('Started refreshing application (/) commands.');
        
            /*for (let i = 0; i < commands.length; i++) {
                console.log(commands[i]);
            }*/

            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commands },
            ).then( function (response) {
                console.log(response)
            });
      
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    },

    deleteCommands: async function(commandId) {
        try {
            //console.log(`Started deleting a slash command (${config.clientId})`);
        
            await rest.delete(
                Routes.applicationCommands(config.clientId) + `${commandId}`,
                { body: commands },
            );
      
            console.log(`Successfully deleting the slash command ${config.clientId}`);
        } catch (error) {
            console.error(error);
        }
    },

    getCommands: async function() {
        try {
            //console.log('Started refreshing application (/) commands.');

            await rest.get(
                Routes.applicationCommands(config.clientId)
            ).then( function (response) {
                console.log(response)
            });
      
            console.log('Successfully getting all application commands.');
        } catch (error) {
            console.error(error);
        }
    },
};