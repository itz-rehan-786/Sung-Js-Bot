//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara

const {bot} = require("../index");

bot.command("alive", (ctx) => {
    ctx.reply("I am alive boii !!",{reply_to_message_id : ctx.message.message_id})
});

