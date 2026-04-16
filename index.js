import { Client, GatewayIntentBits, Events } from "discord.js";
import { CONFIG } from "./app-config.js";

if (!CONFIG.discordToken) {
  console.error("Brak DISCORD_BOT_TOKEN w environment variables.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "link") return;

  const token = interaction.options.getString("token", true).trim();

  await interaction.deferReply({ flags: 64 });

  try {
    const payload = {
      token,
      discord_user_id: interaction.user.id,
      discord_username: interaction.user.username,
      discord_global_name: interaction.user.globalName ?? ""
    };

    const res = await fetch(CONFIG.verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const msg = data?.message || "Nie udało się połączyć konta.";
      await interaction.editReply({ content: `❌ ${msg}` });
      return;
    }

    await interaction.editReply({
      content: "✅ Konto Discord zostało połączone z TibiaCore."
    });
  } catch (e) {
    console.error("Link command error:", e);
    await interaction.editReply({
      content: "❌ Błąd serwera podczas łączenia konta."
    });
  }
});

client.login(CONFIG.discordToken);
