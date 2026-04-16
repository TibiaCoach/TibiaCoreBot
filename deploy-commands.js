import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { CONFIG } from "./app-config.js";

const commands = [
  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Połącz konto Discord z TibiaCore")
    .addStringOption(option =>
      option
        .setName("token")
        .setDescription("Jednorazowy token z ustawień TibiaCore")
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(CONFIG.discordToken);

async function main() {
  if (!CONFIG.discordToken) {
    throw new Error("Brak DISCORD_BOT_TOKEN w environment variables.");
  }

  await rest.put(
    Routes.applicationGuildCommands(CONFIG.clientId, CONFIG.guildId),
    { body: commands }
  );

  console.log("Slash commands deployed.");
}

main().catch(err => {
  console.error("Failed to deploy commands:", err);
  process.exit(1);
});
