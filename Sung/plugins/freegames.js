//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara
//Using qewertyy's api for free games

const { bot , LOGGER } = require("../index");
const fs = require("node:fs");

// KEYBOARD // 

const inline_keyb = [[
    {
        text : "Free Games" ,
        callback_data : "free_games_menu"
    },{
        text : "Delete",
        callback_data : "delete_me"
    }
]]


bot.command("games", async (ctx) => {

    try {

        await ctx.replyWithPhoto({url : "https://graph.org/file/34cd44790c52349715844.jpg"},{
            caption : "Click to Open the list of free games",
            parse_mode : "HTML",
            reply_to_message_id : ctx.message.message_id,
            reply_markup : {inline_keyboard : inline_keyb}
        })

    } catch (eor) {

        await LOGGER(eor);

    }

});

