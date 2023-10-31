/* eslint no-console: off */
/**
 * Rich presence for Discord while playing
 *
 * module to spawn child process
 * to be able to use spawn function, this file should be javascript and using require
 *
 * TODO: extract only needed code from libraries to avoid un-packaging of app/node_modules
 */

// .js and require used to be able to spawn process with pure node
const DiscordRPC = require('discord-rpc');
const nodeFetch = require('node-fetch');

function isRunning(pid) {
  try {
    return process.kill(pid, 0);
  } catch (e) {
    return e.code === 'EPERM';
  }
}

// discord app id
const clientId = process.env.DISCORD_PRESENCE_CLIENT_ID || '';
// receiving game pid
const gamePid = process.argv[3];

const client = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
  if (!client) return;

  const serverInfo = await nodeFetch(
    'https://api.mcstatus.io/v2/status/java/mc.wardsculks.me'
  ).then((response) => response.json());

  await client.setActivity({
    details: '4 Сезон - Доба битв та чарів',
    state: `Онлайн: ${serverInfo.players.online} з ${serverInfo.players.max}`,
    largeImageKey: '1024x1024',
    largeImageText: 'WardSculks',
    startTimestamp,
    instance: false,
    buttons: [
      {
        label: 'Приєднатись',
        url: 'https://discord.gg/8cKjmzA3G8',
      },
    ],
  });
}

client.on('ready', () => {
  setActivity();

  // 300 seconds
  setInterval(setActivity, 300e3);
});

setInterval(() => {
  // if game is not running - kill RPC process
  if (gamePid && !isRunning(gamePid)) {
    process.exit();
  }
}, 60e3);

client.login({ clientId }).catch(console.error);
