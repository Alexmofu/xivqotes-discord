//  Imports
import {} from 'dotenv/config';
import {Client, Routes ,GatewayIntentBits} from 'discord.js';
import { REST } from '@discordjs/rest'

//  Global variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const DEV_GUILDID = process.env.DEV_GUILDID;

//  New client instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });

//  Discord rest
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

//  Client on ready
client.on('ready', () => console.log(`Connected ${client.user.tag}`));
client.on('ready', () => {
    client.guilds.fetch("1010180411525173349")
	.then(guild => guild.leave())
})

//  Client interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'quote') {
      await interaction.reply({
        content: `<:larrow:1007801165175595039>${interaction.options.get("quote-text").value}<:rarrow:1007801166912045116>`
      }); 
    }
  });

//  Main Function
async function main(){
    try{
        
        //  Register Slash Commands
        const commands = [
            {
                name: 'quote',
                description: 'Generates a new FFXIV-like Quote',
                options: [
                    {
                        name: 'quote-text',
                        description: 'Input your quote text',
                        type: 3,
                        required: true
                    }
                ]
            }
        ]

        //  Register slash commands
        console.log(`Refreshing Slash Commands (/) on dev Guild`);
        await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, DEV_GUILDID),
			{ body: commands },
		);

        console.log(`Refreshing Slash Commands (/) GLOBALLY`);
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );


        //  Login client
        client.login(BOT_TOKEN);

    }catch(error){
        console.log(error);
    }
}

main();