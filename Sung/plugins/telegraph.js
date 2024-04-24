//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara


const {bot,LOGGER} = require("../index");
const {Token} = require("../config");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");


 // UPLOAD TO TELEGRAPH 

async function upload(filepath,ctx) {

    try {
        const formdata = new FormData();
        const file = fs.readFileSync(filepath);
        formdata.append("file",file,{filename : "124.jpg"});

        await axios.default.post("https://graph.org/upload",formdata,{
            headers : {
                ...formdata.getHeaders(),
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-IN,en;q=0.8",
                "Cache-Control" : "no-cache",
                "Origin" : "https://graph.org",
                "Pragma" : "no-cache",
                "Referer" : "https://graph.org/",
                "User-Agent" : "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36"
            }
        }).then(async (rsp) => {
            await ctx.reply(`Here is your Graph.org link\n\n<code>https://graph.org${rsp.data[0].src}</code>`,{reply_to_message_id : ctx.message.message_id,parse_mode : "HTML"});
            fs.unlinkSync(filepath);
            return;
        });

    } catch (eor) {

        await LOGGER(eor);

    };
};


// MAIN FUNCTION 


bot.command("tgm" , async (ctx) => {

    if (! ctx.message.reply_to_message) {
        await ctx.reply("Reply to a message to upload it to Graph.org",{
            reply_to_message_id : ctx.message.message_id
        });
        return
    }
    const msg = ctx.message.reply_to_message;

    try {

        if (msg.photo || msg.animation || msg.video) {

            if (msg.photo) {

                const file = msg.photo[msg.photo.length - 1];
                const fileInfo = await ctx.telegram.getFile(file.file_id);
                const imageUrl = `https://api.telegram.org/file/bot${Token}/${fileInfo.file_path}`;
                const response = await fetch(imageUrl);
                const BUFFER = await response.arrayBuffer();
                const time = new Date()
                const NAME = time.getUTCMilliseconds();
                fs.writeFileSync(`./temp/${NAME}.jpg`,Buffer.from(BUFFER));
                //console.log(getImageFileType(Buffer.from(BUFFER)));
                await upload(`./temp/${NAME}.jpg`,ctx);
                
            }

        } else {
            await ctx.reply("Reply To a file to upload it.",{
                reply_to_message_id : ctx.message.message_id
            });
        }
    } catch (eor) {
        await LOGGER(eor);
    };
    
});