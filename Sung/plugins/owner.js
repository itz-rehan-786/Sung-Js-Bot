//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara


const { bot , LOGGER } = require("../index");
const {devs , Owner} = require("../config");
const {shellCommand} = require("@jadesrochers/subprocess");

bot.command("save", async (ctx) => {
    try {
        if (ctx.message.from.id === Owner) {

            if (ctx.message.reply_to_message) {
                await ctx.telegram.forwardMessage(
                    Owner,
                    ctx.message.chat.id,
                    ctx.message.reply_to_message.message_id
                );
                await ctx.reply("Saved.",{
                    reply_to_message_id : ctx.message.message_id
                });
            
            } else {
                await ctx.reply("Reply to a message.",{
                    reply_to_message_id : ctx.message.message_id
                });
            };

        };
    } catch (eor) {
        await LOGGER(eor);
    };
});


bot.command("self_del" , async (ctx) =>{
    try {
        const bo = await ctx.telegram.getMe()
        if (ctx.message.from.id === Owner) {
            if (ctx.message.reply_to_message.from.id === bo.id) {

                await ctx.telegram.deleteMessage(ctx.chat.id,ctx.message.reply_to_message.message_id);

            } else {
                await ctx.reply("Reply to a message sent by me.")
            }
        };
    } catch (eor) {
        await LOGGER(eor);
    };
});





bot.command("sh", async (ctx) => {

    try {
        
        if (devs.includes(ctx.message.from.id)) {
            
            const txt = ctx.message.text.split("/sh") ;

            const shell = await shellCommand(txt[txt.length - 1]);
            await ctx.reply(`OUTPUT : \n${shell.stdout}`,{
                reply_to_message_id : ctx.message.message_id
            });
        };

    } catch (eor) {
        await ctx.reply(`ERROR : \n${eor}`,{
            reply_to_message_id : ctx.message.message_id
        })
        await LOGGER(eor);
    };
});



