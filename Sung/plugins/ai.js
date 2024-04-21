//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara
// using Qwertyy's palm ai & gpt-3 api

// IMPORTS //

const axios = require("axios");
const { bot , LOGGER } = require("../index");

// PALM //

/**
 * 
 * @param {string} dat 
 * @returns {Promise<string>}
 */
async function palm(dat) {
    try {

        const url = 'https://lexica.qewertyy.dev/models';

        dat = dat.trim() === "" ? "Hello" : dat;

        const data = {
            model_id: 18, 
            prompt: dat,
        };

        const response = await axios.default.post(url,null, {params : data});
        return response.data.content;
    
    } catch (eor) {
        return "I am unable to answer that";
    };
};


bot.command("palm",async (ctx) => {

    try {
        
        const msg = await ctx.reply("🔎",{
            reply_to_message_id : ctx.message.message_id
        });
        
        const prompt = ctx.message.text.split("/palm");
        const resp = await palm(prompt[1]);
        
        await ctx.telegram.editMessageText(
            ctx.message.chat.id,
            msg.message_id,
            undefined,
            resp,{
                parse_mode : "Markdown"
            });

    } catch (eor) {
        await LOGGER(eor);
    };
});


// GPT-3 //

/**
 * 
 * @param {string} prompt
 * 
 * 
 * @returns {Promise<string>}
 */
async function gpt3(prompt) {


    try {
      
        const base_url = "https://lexica.qewertyy.dev/models?model_id=5&prompt=" + prompt;

        const response = await axios.post(base_url);

        const data = response.data;

        if (data.code === 2) {
            return data.content;
        } else {
            return "I am unable to answer that";
        };

    } catch (error) {
        await LOGGER(error);
    };
};


bot.command("askgpt",async (ctx) => {

    try {

        const msg = await ctx.reply("🔎",{
            reply_to_message_id : ctx.message.message_id
        });

        const prompt = ctx.message.text.split("/askgpt");
        const resp = await gpt3(prompt[1] ? prompt[1] : "Hello") ;
        
        await ctx.telegram.editMessageText(
            ctx.message.chat.id,
            msg.message_id,
            undefined,
            resp,{
                parse_mode : "Markdown"
            });

    } catch (eor) {
        await LOGGER(eor);
    };

});