const { Client, Intents, MessageEmbed } = require('discord.js');

const { createAudioPlayer, createAudioResource, joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });


var player = createAudioPlayer();

// subscriptions list \\
const subscriptions = new Map();

module.exports = {

    play: async function(interaction, url) {
        const channel = interaction.member.voice.channel;

        // create audio ressource \\
        const resource = createAudioResource(url, {
            metadata: {
                title: 'A radio !',
            },
        });

        // set the voice channel connection \\
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        }).on('error', (error) => {
            console.error(error.message);
            const errorEmbed = new MessageEmbed()
            .setColor("#ff1111")
            .setTitle("Error")
            .setDescription(
                "Error (" + error.name + ") :"
                + "\n" + error.message
            )
            // reply \\
            interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        });

        // create the audio player \\
        player = createAudioPlayer();

        try {
            // try to connect \\
            await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

            // play the radio \\
            player.play(resource);
            const subscription = connection.subscribe(player);
            
            // register the subscription \\
            subscriptions.set(channel.id, subscription);
            return true;
        } catch (error) {
            connection.destroy();
            console.error(error);
        }
    },
 
    leave: async function(channel) {
        // get the connection \\
        if(subscriptions.get(channel.id) != null) {
            var connection = subscriptions.get(channel.id).connection;
            // disconnect \\
            connection.destroy();
            return true;
        } else {
            return false;
        }
    }
}
