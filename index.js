import { Client, GatewayIntentBits } from "discord.js";
import { createClient } from "@supabase/supabase-js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  startNotificationWorker();
});

async function startNotificationWorker() {
  console.log("Notification worker started...");

  setInterval(async () => {
    try {
      const { data, error } = await supabase
        .from("discord_notification_queue")
        .select("*")
        .eq("status", "pending")
        .limit(5);

      if (error) {
        console.error("DB fetch error:", error);
        return;
      }

      if (!data || data.length === 0) return;

      for (const notif of data) {
        try {
          const user = await client.users.fetch(notif.discord_user_id);

          if (!user) {
            throw new Error("User not found");
          }

          await user.send(`**${notif.title}**\n${notif.message}`);

          const { error: updateError } = await supabase
            .from("discord_notification_queue")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
            })
            .eq("id", notif.id);

          if (updateError) {
            console.error("Update sent status error:", updateError);
          } else {
            console.log("Sent notification:", notif.id);
          }
        } catch (err) {
          console.error("Send error:", err?.message || err);

          const { error: failError } = await supabase
            .from("discord_notification_queue")
            .update({
              status: "failed",
              error_message: err?.message || String(err),
              attempts: (notif.attempts || 0) + 1,
            })
            .eq("id", notif.id);

          if (failError) {
            console.error("Update failed status error:", failError);
          }
        }
      }
    } catch (err) {
      console.error("Worker error:", err);
    }
  }, 5000);
}

client.login(process.env.DISCORD_BOT_TOKEN);
