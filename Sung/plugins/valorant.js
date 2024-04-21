// BSD 3-Clause License 
// Copyright (c) 2023-2024, Dhruv-Tara
// Using Henri's Api for valorant -- https://henrikdev.xyz

const axios = require("axios");
const {bot,LOGGER} = require("../index");
const {Token} = require("../config");

const botToken = Token;

/// RAW TG API USAGE DON'T TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING


async function edit_msg_cap(msg_id,cap,chatid) {
    const chatId = chatid;
    const messageId = msg_id;
    const newCaption = cap;
    const apiUrl = `https://api.telegram.org/bot${botToken}/editMessageCaption`;


    const payload = {
        chat_id: chatId,
        message_id: messageId,
        caption: newCaption
    };

    axios.post(apiUrl, payload).then(response => {
        return 200;
    }).catch(error => {
    return 500;
  });
};



async function edit_msg_media(chatid,messageid,photo,caption) {

    const chatId = chatid;
    const messageId = messageid;
    const source_photo = photo;
    const apiUrl = `https://api.telegram.org/bot${botToken}/editMessageMedia`;

    const payload = {
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: 'photo',
          media: source_photo,
          caption : caption,
          parse_mode : "HTML"
        },
      };
      
    axios.post(apiUrl, payload).then(response => {
        return 200;
    }).catch(error => {
        return 500;
    });
};

/// RAW TG API USAGE ENDS HERE

// VALORANT API USAGE 



async function get_player_data(ingamename) {

    try {
        const base_url = "https://api.henrikdev.xyz/valorant/v1/account/";
        const name = ingamename;
        const new_name = name.trim();
        const result = await axios.default.get(base_url+new_name);
        return result;
    } catch (eor) {
        return;
    };
};

async function all_tim_high_mmr(ingamename) {
    try {
        const base_url = "https://api.henrikdev.xyz/valorant/v2/mmr/ap/";
        const name = ingamename;
        const new_name = name.trim()
        const result = await axios.default.get(base_url+new_name);
        return result;
    } catch (eor) {
        return null;
    }
};

async function get_mmr(ingamename){
    try {
        const base_url = "https://api.henrikdev.xyz/valorant/v1/mmr/ap/";
        const name = ingamename;
        const new_name = name.trim()
        const result = await axios.default.get(base_url+new_name);
        return result;
    } catch (eor) {
        return null;
    }
};




// MAIN BOT COMMAND


bot.command("valo", async (ctx) =>{
    try {

        const text = ctx.message.text.split(" ");
        const riotid = text[text.length - 1];

        if (riotid.trim() === "" || riotid.startsWith("/valo")) {
            
            await ctx.reply("This is not the correct way to search rank.\nUse this as an example :\n<code>/valo Roti/Game</code>",{
                reply_to_message_id : ctx.message.message_id,
                parse_mode : "HTML"
            });

        } else {
            
            const new_msg = await ctx.replyWithPhoto("https://wallpaperaccess.com/full/3952297.jpg",{
                caption :"Searching....",
                reply_to_message_id : ctx.message.message_id
            });


            const riot_id = riotid;
            const player_data = await get_player_data(riot_id);
            const mmr_json = await get_mmr(riot_id);
            const player_max_mmr = await all_tim_high_mmr(riot_id);

            if (mmr_json === null ) {

                await edit_msg_cap(new_msg.message_id,"Maybe you wrote wrong in-game name try again",ctx.message.chat.id);

                
            } else if (mmr_json.data.data.images === null) {

                const main_player_data = player_data.data;

                await edit_msg_media(
                    ctx.message.chat.id,
                    new_msg.message_id,
                    main_player_data.data.card.large,
                    `Player UID : <code>${main_player_data.data.puuid}</code>\nAccount Level : ${main_player_data.data.account_level}\nIn Game name : ${main_player_data.data.name} #${main_player_data.tag} \n\nThis player is still unranked.\n\nThis Api is built by <a href="https://henrikdev.xyz">HENRI</a>`
                );

            } else if (mmr_json.data.status === 200) {

                const max_mmr_data = player_max_mmr.data.data;
                const main_player_data = player_data.data;
                const main_mmr_json = mmr_json.data.data;

                await edit_msg_media(
                    ctx.message.chat.id,
                    new_msg.message_id,
                    main_player_data.data.card.large,
                    `Player UID : <code>${main_player_data.data.puuid}</code>\nAccount Level : ${main_player_data.data.account_level}\nIn Game name : ${main_mmr_json.name} #${main_mmr_json.tag}\nPeak Rank : ${max_mmr_data.highest_rank.patched_tier} in Season ${max_mmr_data.highest_rank.season}\nCurrent Rank : ${main_mmr_json.currenttierpatched}\nElo : ${main_mmr_json.elo}\nMMR since last match : ${main_mmr_json.mmr_change_to_last_game}\n\nThis Api is built by <a href="https://henrikdev.xyz">HENRI</a>`
                );
                
            } else {

                edit_msg_cap(new_msg.message_id,"Maybe you wrote wrong in-game name try again",ctx.message.chat.id); // Just in case anything unexpected happens
            
            };
        };

    } catch (eor) {
        await LOGGER(eor);
    };
});