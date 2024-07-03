import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Message,
  REST, 
  Routes,
} from "discord.js";
import { LoadSpecificModel } from "./functions/loading";
import { GetResponseSage } from "./functions/conversation";

// in typescript just says these are not null
const CLIENT_TOKEN = process.env.CLIENT_TOKEN!;
const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;


async function main() {
  const rest = new REST({ version: '10' }).setToken(CLIENT_TOKEN);
    const model = await LoadSpecificModel();
    try {
      console.log('Started refreshing bot.');
  //i actually think i wrote this line of code just because, it does have 0 or so i think
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      });
  
      console.log('Successfully reloaded bot.');
    } catch (error) {
      console.error(error);
  
      return false;
    }
  
  
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
//if this line fails and says a websocket error, check your bot permissions
    console.log("intentions established")
  
client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});
  
    // this is for responding to slash commands, not individual messages
    client.on('messageCreate', async (message: Message) => {
        // check if the bot was mentioned
        if (message.mentions.has(client.user!)) {
            // READ, CONSOLE and REPLY to the mention
            const author = message.author;
            const guildMember = await message.guild?.members.fetch(author.id);
            const nickname = guildMember?.nickname || author.username; // fallback to username if no nickname
            const question = message.content.replace(`<@${client.user!.id}>`, '').trim();
            const channelId = message.channel.id;
            console.log(nickname, 'asked:', question);
            try {
              //this shows the bot typing while it awaits the response from the model
                rest.post(Routes.channelTyping(channelId));
                const response = await GetResponseSage(question, model, nickname);
                message.reply(response);
              } catch (e) {
                await message.reply('Unable to answer that question');
              }  
        }
    });

    client.login(CLIENT_TOKEN);
  }
  console.log(CLIENT_TOKEN);
  main();