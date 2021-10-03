//    Imports    \\
const { Client, Intents, Interaction, GuildMember, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

const audio = require("./audio");

const commands = require('./commands');

const config = require("./config.json");


//    On enable    \\
client.on('ready', () => {
    console.log("The bot is online !");
    // register commands \\
    commands.setCommands(client.user.id);
    
    // Set the bot presence \\
    client.user.setPresence({
        status: 'online',
        activities: [{
            name: '/radio',
            type: 'LISTENING', //PLAYING, WATCHING, LISTENING, or STREAMING
        }]
    });
})

//    on interaction    \\
client.on('interactionCreate', async interaction => {

	if (interaction.commandName === 'radio') {
        // make the embed \\
        const radioEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Choose a radio station to listen to it 🎧')
            .setDescription(
                "You can select `NRJ`, `Radio FG`, `RFM`, `Skyrock`, `Mouv'`, `Swigg` or `Rire & Chansons` radio !"
                + "\n"
                + "\n[Invite the bot](https://discord.com/oauth2/authorize?client_id=887747246576246825&scope=bot%20applications.commands&permissions=3427336 'Click if you want invite the bot !')"
                )
            .setTimestamp()
            .setFooter("By DechireT#0674")

        // make the menu \\
		const radioMenu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('radio')
					.setPlaceholder('Select a radio ...')
					.addOptions([
						{
							label: 'NRJ',
							description: 'Play NRJ radio !',
							value: 'nrj',
						},
                        {
							label: 'Radio FG',
							description: 'Play Radio FG !',
							value: 'fg',
						},
                        {
							label: 'RFM',
							description: 'Play RFM radio !',
							value: 'rfm',
						},
                        {
							label: 'Skyrock',
							description: 'Play Skyrock radio !',
							value: 'skyrock',
						},
                        {
							label: 'Mouv\'',
							description: 'Play Mouv\' radio !',
							value: 'mouv',
						},
                        {
							label: 'Swigg',
							description: 'Play Swigg radio !',
							value: 'swigg',
						},
                        {
							label: 'Rire & Chansons',
							description: 'Play Rire & Chansons radio !',
							value: 'rire',
						},
                        {
							label: 'RTL 2',
							description: 'Play RTL 2 radio !',
							value: 'rtl2',
						},
					]),
			);

        // reply \\
		await interaction.reply({components: [radioMenu], embeds: [radioEmbed] });

        // log the command \\
        console.info("Guilds (" + client.guilds.cache.size + ") :" + client.guilds.cache.map(guild => " " + guild.name));
        console.log(interaction.user.tag + " use /radio on '" + interaction.guild.name + "'");
	
    } else if(interaction.commandName === 'leave') {

        var BotGuildMember;
        
        // search the bot on GuildMember object \\
        interaction.guild.members.cache.forEach(guildmember => {
            if(guildmember.id === client.user.id) {
                BotGuildMember = guildmember;
            }
        });

        // conditions for disconnect the bot \\
        if((interaction.member.voice.channelId != null && BotGuildMember != null && BotGuildMember.voice.channelId != null 
            && interaction.member.voice.channelId === BotGuildMember.voice.channelId) || (interaction.member.permissions.has("MOVE_MEMBERS") 
            && BotGuildMember != null && BotGuildMember.voice.channelId != null)) {

                // try to leave the channel \\
                if(audio.leave(BotGuildMember.voice.channel)) {
                    // make the embed \\
                    const embed = new MessageEmbed()
                        .setColor('#11ff11')
                        .setDescription("✅ **The bot was disconnected by <@" + interaction.user.id + "> successfully**");
                    // reply \\
                    interaction.reply({ embeds: [embed]});
                } else {
                    // make the embed \\
                    const embed = new MessageEmbed()
                        .setColor('#ff1111')
                        .setDescription("❌ **Error**");
                    // reply \\
                    interaction.reply({ embeds: [embed]});
                }
                
                
        } else {
            // if conditions are not correct \\
            const errorEmbed = new MessageEmbed()
                .setColor('#ff1111')
                .setDescription("❌ You must **be in a voice channel with the bot** (<@" + client.user.id + ">) or has the **move member permission** for use this command !")
            // reply \\
            interaction.reply({ embeds: [errorEmbed], ephemeral: true});
        }
    }

    // on user select a radio \\
    if(interaction.customId === 'radio' && interaction.componentType === 'SELECT_MENU') {

        // if it isn't on a guild \\
        if(interaction.member == null) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff1111')
                .setDescription("❌ You must be in a **server voice channel** !")

            // reply \\
            return interaction.reply({ embeds: [errorEmbed] });
        }

        // get the interaction values \\
        const value = interaction.values[0];
        const channel = interaction.member.voice.channel;
        const user = interaction.user;

        const radio = value.replace("nrj", "NRJ").replace("fg", "Radio FG").replace("rfm", "RFM").replace("skyrock", "Skyrock")
                        .replace("mouv", "Mouv'").replace("swigg", "Swigg").replace("rire", "Rire & Chansons").replace("rtl2", "RTL 2");

        if (interaction.member instanceof GuildMember && channel) {
            // make the embed \\
            const playEmbed = new MessageEmbed()
            .setColor("11ff11")
            .setDescription("**✅ Play `" + radio + "` on <#" + channel.id + "> (by <@" + user.id + ">)**"); //and bound to <#" + interaction.channel.id + "> **");

            // search the radio \\
            var url;
            if(value === "nrj") {
                url = "http://cdn.nrjaudio.fm/audio1/fr/30001/mp3_128.mp3?origine=fluxradios";
            } else if(value === 'fg') {
                url = "http://radiofg.impek.com/fg";
            } else if(value === 'rfm') {
                url = "https://ais-live.cloud-services.paris:8443/rfm.mp3";
            } else if(value === 'skyrock') {
                url = "http://icecast.skyrock.net/s/natio_mp3_128k.mp3";
            } else if(value === 'mouv') {
                url = "http://icecast.radiofrance.fr/mouv-midfi.mp3";
            } else if(value === 'swigg') {
                url = "http://d3-soundcast-edge-2.infomaniak.ch/start-adofm-high";
            } else if(value === 'rire') {
                url = "https://f5-th2-2.nrjaudio.fm/fr/30401/mp3_128.mp3?origine=fluxradios&cdn_path=adswizz_lbs9&access_token=b25f7fcf29ad48fa829b6ac781e6cddd"; 
            } else if(value === 'rtl2') {
                url = "http://streamer-01.rtl.fr/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg";
            }

            // stream the radio \\
            try {
                await audio.play(interaction, url);
            } catch (error) {
                const errorEmbed = new MessageEmbed()
                    .setColor("ff1111")
                    .setDescription(
                        "❌ <@" + interaction.user.id + "> wants play `" + radio + "` on <#" + channel.id + "> \nError : " + error
                    )
                console.error(error);
                return interaction.reply({ embeds: [errorEmbed] });
            }
            // reply \\
            interaction.reply({ embeds: [playEmbed] });

            // log the command \\
            console.log(interaction.user.tag + " play " + radio + " on '" + interaction.guild.name + "'")

        } else {
            // is the user isn't in a voice channel \\
            const errorEmbed = new MessageEmbed()
                .setColor('#ff1111')
                .setDescription("❌ <@" + user.id + "> You must be in a voice channel !")
            // reply \\
            interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }
    }
});


client.on('voiceStateUpdate', voice => {

    var BotGuildMember;
    
    // search the bot on GuildMember object \\
    voice.guild.members.cache.forEach(guildmember => {
        if(guildmember.id === client.user.id) {
            BotGuildMember = guildmember;
        }
    });

    // conditions for disconnect the bot if it is solo on the voice channel \\
    if(BotGuildMember != null && BotGuildMember.voice.channelId != null && voice.channel != null && BotGuildMember.voice.channelId === voice.channelId && voice.channel.members.size === 1) {
        audio.leave(voice.channel);
    }
    
});

//    login the bot    \\
client.login(config.token);