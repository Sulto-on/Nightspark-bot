const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

// ========== GAME DATA ==========
const data = {
  truth: {
    normal: ["What's the most embarrassing thing you've done?","Have you ever lied to your best friend?","What's your biggest secret?","Who was your first crush?","What's a bad habit you have?","Have you ever cheated on a test?","What's the weirdest dream you've had?","Have you ever ghosted someone?","What's something you've never told anyone?","Do you have a hidden talent?"],
    naughty: ["What's the most attractive thing about someone in this group?","Have you ever had a crush on someone here?","What's your biggest turn-on?","Have you ever flirted with someone just for fun?","What's the boldest move you've ever made on someone you liked?","Have you ever kissed someone on a dare?","What's your worst date story?","Have you ever sent a flirty text to the wrong person?","Rate everyone in this group by attractiveness","What's your most romantic memory?"],
    extreme: ["What's the most sexually adventurous thing you've ever done?","Have you ever had a friends with benefits situation?","What's the wildest place you've ever had sex?","What's the dirtiest thing you've ever said to someone in bed?","Have you ever had a threesome or wanted one?","What body part do you find most attractive?","Have you ever had sex with someone and regretted it?","What's your biggest sexual fantasy?","Have you ever sexted someone?","Have you ever secretly watched someone and felt attracted?"]
  },
  dare: {
    normal: ["Do your best dance move for 30 seconds","Text someone random 'I miss you'","Speak in an accent for the next 3 rounds","Do 15 push-ups","Call someone and sing Happy Birthday","Eat a spoonful of hot sauce","Do an impression of someone in the group","Talk without closing your mouth for 1 minute","Let someone post anything on your status","Do your best celebrity impression"],
    naughty: ["Give a 10-second shoulder massage to someone","Whisper something flirty to someone in the group","Sit on someone's lap for the next 2 rounds","Do your best sexy walk","Text your crush right now — group picks the message","Do a slow dance by yourself for 20 seconds","Let someone style your hair however they want","Stare into someone's eyes for 30 seconds without laughing","Send a winking emoji to your last contact","Let the group rate your flirting skills"],
    extreme: ["Send the most daring text you can to someone outside the group","Describe your last romantic experience in detail","Share the most daring photo in your gallery","Voice note a compliment to someone you find attractive","Describe your type in explicit detail","Share your most embarrassing romantic memory","Tell the group your body count","Reveal the wildest place you'd want to be intimate","Share a screenshot of your most flirty conversation","Describe your perfect night in detail"]
  },
  nhie: {
    normal: ["Never have I ever gone skinny dipping","Never have I ever lied about my age","Never have I ever stayed up all night","Never have I ever cried at a movie","Never have I ever eaten food off the floor","Never have I ever pretended to be sick to skip something","Never have I ever stolen something","Never have I ever sent a message to the wrong person","Never have I ever faked a phone call","Never have I ever forgotten someone's birthday"],
    naughty: ["Never have I ever flirted with someone in this group","Never have I ever kissed someone I just met","Never have I ever had a secret admirer","Never have I ever pretended not to like someone I actually liked","Never have I ever stayed up all night texting someone I liked","Never have I ever dated two people at the same time","Never have I ever been on a blind date","Never have I ever asked someone out and got rejected","Never have I ever had a crush on a friend's partner","Never have I ever sent a risky text by mistake"],
    extreme: ["Never have I ever had sex with someone I just met","Never have I ever sent a nude to the wrong person","Never have I ever had sex in a car","Never have I ever faked an orgasm","Never have I ever had a threesome","Never have I ever done something sexual in a public place","Never have I ever slept with someone twice my age","Never have I ever had phone sex","Never have I ever been walked in on","Never have I ever had sex on the first date"]
  },
  wyr: {
    normal: ["Would you rather be invisible or fly?","Would you rather always be late or always be 3 hours early?","Would you rather lose your phone or your wallet?","Would you rather never use social media again or never watch movies?","Would you rather be always cold or always hot?","Would you rather speak every language or play every instrument?","Would you rather have no internet or no AC?","Would you rather live in the city or countryside?","Would you rather know when you'll die or how?","Would you rather always win arguments or always get what you want?"],
    naughty: ["Would you rather be a great kisser or a great hugger?","Would you rather date someone funny or attractive?","Would you rather go on a romantic dinner or a wild night out?","Would you rather be too loved or not loved enough?","Would you rather date someone older or younger?","Would you rather have one passionate relationship or many fun flings?","Would you rather flirt confidently or be chased?","Would you rather marry your best friend or your soulmate?","Would you rather your ex or your crush sees you glow up?","Would you rather have a secret fling or an open relationship?"],
    extreme: ["Would you rather have loud passionate sex with thin walls or silent sex forever?","Would you rather your sex tape leak or your diary?","Would you rather have sex in an elevator or on a rooftop?","Would you rather be completely dominant or submissive in bed?","Would you rather have amazing sex with a stranger or average sex with someone you love?","Would you rather moan the wrong name or have your partner moan the wrong name?","Would you rather have no sex for a year or no kissing?","Would you rather your parents find your search history or your texts?","Would you rather sleep with your ex again or no sex for 6 months?","Would you rather have sex with lights fully on or pitch black?"]
  },
  drink: ["Take a sip if you've broken a rule tonight","The last person to check their phone drinks","Whoever laughs next takes a sip","Everyone points at the most likely to fall asleep — that person drinks","Take 2 sips","Waterfall — everyone drinks, stop only when the person before you stops","The person to your left picks a rule","Never Have I Ever — hold up 3 fingers, drink for each that applies","Anyone with a name starting with a vowel drinks","Everyone who loses this round drinks"],
  charades: ["Moonwalk","Sleeping","Crying baby","Flying a kite","Texting while walking","Swimming","Playing guitar","Sneezing","Riding a horse","Making pizza","Taking a selfie","Winning a trophy","Being chased","Eating spaghetti","Doing yoga"]
};

// ========== GAME STATE ==========
const groups = {}; // stores state per group/user

function getState(id) {
  if (!groups[id]) {
    groups[id] = {
      mode: 'normal',
      players: [],
      currentPlayer: 0,
      game: null
    };
  }
  return groups[id];
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nextPlayer(state) {
  if (state.players.length === 0) return 'the next player';
  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  return state.players[state.currentPlayer];
}

function currentPlayer(state) {
  if (state.players.length === 0) return 'Player';
  return state.players[state.currentPlayer];
}

// ========== MENU ==========
function gameMenu(state) {
  return `🎮 *Pick a game — reply with a number:*\n\n1️⃣ - 🔥 Truth\n2️⃣ - 🎯 Dare\n3️⃣ - 🙅 Never Have I Ever\n4️⃣ - 🤔 Would You Rather\n5️⃣ - 🍾 Spin the Bottle\n6️⃣ - 🍺 Drinking Game\n7️⃣ - 🎭 Charades\n8️⃣ - 🔄 Change Mode\n9️⃣ - 👥 Change Players\n\n*Mode:* ${state.mode.toUpperCase()} | *Players:* ${state.players.join(', ')}`;
}

function modeMenu() {
  return `🔄 *Pick a mode — reply with a number:*\n\n1️⃣ - 😊 Normal\n2️⃣ - 🔞 Naughty\n3️⃣ - 💀 Extreme`;
}

// ========== BOT LOGIC ==========
function handleMessage(from, body) {
  const msg = body.trim();
  const msgLower = msg.toLowerCase();
  const state = getState(from);
  let response = '';

  // WAITING FOR PLAYERS
  if (state.waitingFor === 'players') {
    const names = msg.split(',').map(n => n.trim()).filter(n => n.length > 0);
    if (names.length < 2) {
      response = `⚠️ Please add at least 2 players!\n\nExample: *John, Sarah, Mike*`;
    } else {
      state.players = names;
      state.currentPlayer = 0;
      state.waitingFor = null;
      response = `👥 *Players added!*\n${names.map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\n🎯 First up: *${names[0]}*\n\n${gameMenu(state)}`;
    }
    return response;
  }

  // WAITING FOR MODE
  if (state.waitingFor === 'mode') {
    state.waitingFor = null;
    if (msg === '1') { state.mode = 'normal'; response = `😊 *Normal Mode ON!*\n\n${gameMenu(state)}`; }
    else if (msg === '2') { state.mode = 'naughty'; response = `🔞 *Naughty Mode ON!*\n\n${gameMenu(state)}`; }
    else if (msg === '3') { state.mode = 'extreme'; response = `💀 *Extreme Mode ON!*\n\n${gameMenu(state)}`; }
    else { state.waitingFor = 'mode'; response = `⚠️ Reply with 1, 2 or 3\n\n${modeMenu()}`; }
    return response;
  }

  // WELCOME
  if (msgLower === 'hi' || msgLower === 'hello' || msgLower === 'start' || msgLower === '!start') {
    state.waitingFor = 'players';
    response = `🌙✨ *Welcome to NightSpark!* ✨🌙\n\nThe ultimate party game bot! 🎉\n\n👥 *First, type the names of all players separated by commas:*\n\nExample: *John, Sarah, Mike, Lisa*`;
    return response;
  }

  // NO PLAYERS YET
  if (state.players.length === 0) {
    state.waitingFor = 'players';
    response = `🌙 *NightSpark Bot*\n\n👥 Type the names of all players to get started:\n\nExample: *John, Sarah, Mike*`;
    return response;
  }

  // GAME MENU NUMBERS
  if (msg === '1') {
    const q = rand(data.truth[state.mode]);
    const player = currentPlayer(state);
    nextPlayer(state);
    response = `🔥 *TRUTH for ${player}!*\n\n"${q}"\n\n➡️ Next up: *${currentPlayer(state)}*\n\n${gameMenu(state)}`;
  }
  else if (msg === '2') {
    const d = rand(data.dare[state.mode]);
    const player = currentPlayer(state);
    nextPlayer(state);
    response = `🎯 *DARE for ${player}!*\n\n"${d}"\n\n➡️ Next up: *${currentPlayer(state)}*\n\n${gameMenu(state)}`;
  }
  else if (msg === '3') {
    const q = rand(data.nhie[state.mode]);
    response = `🙅 *Never Have I Ever!*\n\n"${q}"\n\n🙋 Everyone who HAS done this — take a sip!\n\n${gameMenu(state)}`;
  }
  else if (msg === '4') {
    const q = rand(data.wyr[state.mode]);
    response = `🤔 *Would You Rather?*\n\n"${q}"\n\n🗣 Everyone votes! Minority drinks!\n\n${gameMenu(state)}`;
  }
  else if (msg === '5') {
    if (state.players.length < 2) {
      response = `🍾 Need at least 2 players!\n\n${gameMenu(state)}`;
    } else {
      const picked = rand(state.players);
      response = `🍾 *Spinning the bottle...*\n\n🌀🌀🌀\n\n✨ It landed on... *${picked}!* ✨\n\n${gameMenu(state)}`;
    }
  }
  else if (msg === '6') {
    const rule = rand(data.drink);
    response = `🍺 *Drink Rule!*\n\n"${rule}"\n\n🫗 Drink responsibly!\n\n${gameMenu(state)}`;
  }
  else if (msg === '7') {
    const word = rand(data.charades);
    const player = currentPlayer(state);
    nextPlayer(state);
    response = `🎭 *Charades for ${player}!*\n\n👁 Only *${player}* looks at this!\nWord: *${word}*\n\n⏱ 60 seconds to act it out!\n\n➡️ Next up: *${currentPlayer(state)}*\n\n${gameMenu(state)}`;
  }
  else if (msg === '8') {
    state.waitingFor = 'mode';
    response = modeMenu();
  }
  else if (msg === '9') {
    state.waitingFor = 'players';
    response = `👥 Type the new player names separated by commas:\n\nExample: *John, Sarah, Mike, Lisa*`;
  }
  else {
    response = `🌙 *NightSpark*\n\n${gameMenu(state)}`;
  }

  return response;
}

// ========== WEBHOOK ==========
app.post('/webhook', (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;
  const reply = handleMessage(from, body);

  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply}</Message>
</Response>`);
});

app.get('/', (req, res) => res.send('🌙 NightSpark Bot is running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NightSpark Bot running on port ${PORT}`));
