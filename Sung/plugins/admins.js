//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara

const { bot,LOGGER } = require("../index");
const { TelegramError } = require("telegraf")
const { Owner } = require("../config")

// Some functions //

// Made this func to get rights of user && bot //

async function give_rights(ctx,userid) {
    const chat_user = await bot.telegram.getChatMember(ctx.message.chat.id,userid)
    return {
        "status" : chat_user.status,
        "can_be_edited" : chat_user.can_be_edited,
        "can_manage_chat" : chat_user.can_manage_chat,
        "can_change_info" : chat_user.can_change_info,
        "can_invite_users" : chat_user.can_invite_users,
        "can_delete_messages" : chat_user.can_delete_messages,
        "can_restrict_members" : chat_user.can_restrict_members,
        "can_pin_messages" : chat_user.can_pin_messages,
        "can_manage_topics" : chat_user.can_manage_topics,
        "can_promote_members" : chat_user.can_promote_members,
        "can_manage_video_chats" : chat_user.can_manage_video_chats,
        "is_anonymous" : chat_user.is_anonymous,
        "can_manage_voice_chats" : chat_user.can_manage_voice_chats
    };
};


/* This func makes the other command based functions easy to make and */
/* makes them easy to read else every command will have more 10-15 lines of trash code */


async function give_admin_position(ctx , userid , type) {
    try {
        const rights = await give_rights(ctx,userid);

        if (rights["status"] === "creator" || userid === 5146000168) {
            
            return true
        
        } else if (rights["status"] === "administrator") {
            
            if (type === "can_delete_messages") {
                return rights[type];
            } else if (type === "can_restrict_members") {
                return rights[type];
            };

        } else {
            return null
        };

    } catch (eor) {
        await LOGGER(eor)
    };
};



/* !--------- Commands ----------! */

// wipethread //

bot.command("wipethread", async (ctx) => {

    try {

        if (ctx.message.chat.type === "private") {
            
            await ctx.reply("Group Only Command.");

        } else {

            const main_user_can = await give_admin_position(ctx,ctx.message.from.id,"can_delete_messages")
            
            if (main_user_can === true) {

                const bot_info = await ctx.telegram.getMe();
                const bot_can = await give_admin_position(ctx,bot_info.id,"can_delete_messages");
                if (bot_can === true){

                    if (ctx.message.reply_to_message) {

                        const message_id = ctx.message.reply_to_message.message_id;
                        const main_id = ctx.message.message_id;
                        const message_to_del = ctx.message.text.split(" ")[1];


                        if (typeof message_to_del === "undefined"){

                            for (let i = message_id; i <= main_id; i++) {
                                try {
                                    await ctx.telegram.deleteMessage(ctx.message.chat.id, i );
                                } catch (eor) {
                                    if (eor === TelegramError) {
                                        i + 1
                                    } else {
                                        i + 1
                                    };
                                };
                            };
                            await ctx.reply("Wiped Thread Sucessfully.");

                        } else if (isNaN(parseInt(message_to_del))) {

                            await ctx.reply("Correct way to use <code>/wipethread 3</code>",{
                                parse_mode : "HTML",
                                reply_to_message_id : ctx.message.message_id
                            });

                        } else if (typeof parseInt(message_to_del) === "number") {

                            if (parseInt(message_to_del) <= 0) {

                                await ctx.reply("The number of message to delete should be non zero positive number.",{
                                    reply_to_message_id : ctx.message.message_id
                                })
                            } else {
                                for (let i = message_id; i <= (parseInt(message_id) + (parseInt(message_to_del)-1)); i++) {
                                    try {
                                        await ctx.telegram.deleteMessage(ctx.message.chat.id, i );
                                    } catch (eor) {
                                        if (eor === TelegramError) {
                                            i + 1
                                        } else {
                                            i + 1
                                        };
                                    };
                                };
                                await ctx.reply(`Sucessfully Wiped ${message_to_del} message.`);
                            };
                        };

                    } else {
                        await ctx.reply("Reply to a message to start purging.",{
                            reply_to_message_id : ctx.message.message_id
                        });
                    }

                } else if (bot_can === null) {

                    await ctx.reply("I am not admin here.",{
                        reply_to_message_id : ctx.message.message_id
                    });

                } else {

                    await ctx.reply("I lack rights please give me rights.",{
                        reply_to_message_id : ctx.message.message_id
                    });

                }

            } else if (main_user_can === null) {

                await ctx.reply("You are not an admin.",{
                    reply_to_message_id : ctx.message.message_id
                });

            } else {
                await ctx.reply("You lack rights",{
                    reply_to_message_id : ctx.message.message_id
                });
            };
        };
    } catch (eor) {
        await LOGGER(eor);
    };
});


// del Command //

bot.command("del", async (ctx) => {
    try {
        if (ctx.message.chat.type === "private"){
            await ctx.reply("Group Only Command")
        } else {
            const main_user_can = await give_admin_position(ctx,ctx.message.from.id,"can_delete_messages")
            if (main_user_can === true) {

                const bot_info = await ctx.telegram.getMe();
                const bot_can = await give_admin_position(ctx,bot_info.id,"can_delete_messages");
                if (bot_can === true){
                    if (ctx.message.reply_to_message){
                        await ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.reply_to_message.message_id);
                        await ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id);
                    } else {
                        await ctx.reply("Reply to a message to delete it.",{
                            reply_to_message_id : ctx.message.message_id
                        });
                    };

                } else if (bot_can === null) {

                    await ctx.reply("I am not admin here.",{
                        reply_to_message_id : ctx.message.message_id
                    });

                } else {

                    await ctx.reply("I lack rights please give me rights.",{
                        reply_to_message_id : ctx.message.message_id
                    });

                }

            } else if (main_user_can === null) {

                await ctx.reply("You are not an admin.",{
                    reply_to_message_id : ctx.message.message_id
                });

            } else {
                await ctx.reply("You lack rights",{
                    reply_to_message_id : ctx.message.message_id
                });
            };
        };
    } catch (eor) {
        await LOGGER(eor);
    };
});


// Bans & Unban //

bot.command("ban", async (ctx) => {

    try {

        if (ctx.message.chat.type === "private") {

            await ctx.reply("This is a group only command");
            return;

        };

        const _bot = await bot.telegram.getMe();
        const bot_can = await give_admin_position(ctx,_bot.id,"can_restrict_members");
        const user_can = await give_admin_position(ctx,ctx.message.from.id,"can_restrict_members");

        if (bot_can === null) {
            await ctx.reply("I am not admin here",{
                reply_to_message_id : ctx.message.message_id
            });
            return;
        } else if (bot_can === false) {
            
            await ctx.reply("I don't have rights.",{
                reply_to_message_id : ctx.message.message_id
            });
            return;
        };

        if (user_can) {
            if (ctx.message.reply_to_message) {

                const victim = ctx.message.reply_to_message.from;
                const banHammerUser = ctx.message.from;
                
                if (victim.id === Owner.id) {
                    await ctx.reply("You can't ban Shadow Monarch",{ 
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;
                } else if (victim.id === banHammerUser.id) {
                    await ctx.reply("You want to ban yourself ?",{
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;
                } else if (victim.id === _bot.id) {

                    await ctx.reply("What did I do now ?",{
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;

                } else if (['creator','administrator'].includes((await ctx.telegram.getChatMember(ctx.chat.id,victim.id)).status) ) {
                    await ctx.reply("You can't ban an Admin !!",{
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;
                };

                await ctx.banChatMember(victim.id);
                await ctx.reply(`Sucessfully banned ${victim.first_name} from this chat.`);
                return;
            } else {
                
                await ctx.reply("Reply to a user to ban him from this chat.",{
                    reply_to_message_id : ctx.message.message_id
                });
            };
        
        } else if (user_can === null) {
        
            await ctx.reply("You are not an Admin.",{
                reply_to_message_id : ctx.message.message_id
            });
        
        } else {
            await ctx.reply("You lack Rights.",{
                reply_to_message_id : ctx.message.message_id
            });
        };

    } catch (eor) {
        await LOGGER(eor);
    };
});




bot.command("unban", async (ctx) => {

    try {

        const _bot = await bot.telegram.getMe();
        const bot_can = await give_admin_position(ctx,_bot.id,"can_restrict_members");
        const user_can = await give_admin_position(ctx,ctx.message.from.id,"can_restrict_members");

        if (ctx.message.chat.type === "private") {

            await ctx.reply("This is a group only command");
            return;

        };

        if (bot_can === null) {
            await ctx.reply("I am not admin here",{
                reply_to_message_id : ctx.message.message_id
            });
            return;
        } else if (bot_can === false) {
            
            await ctx.reply("I don't have rights.",{
                reply_to_message_id : ctx.message.message_id
            });
            return;
        };

        if (user_can) {
            if (ctx.message.reply_to_message) {

                const victim = ctx.message.reply_to_message.from;
                const banHammerUser = ctx.message.from;
                
                if (victim.id === Owner.id) {
                    await ctx.reply("Lmao.",{ 
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;
                } else if (victim.id === banHammerUser.id) {
                    await ctx.reply("Nice reply to yourself !",{
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;
                } else if (victim.id === _bot.id) {

                    await ctx.reply("Ok like what should I do next ?\nPlay Vodoo with you ?",{
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;

                } else if (['creator','administrator'].includes((await ctx.telegram.getChatMember(ctx.chat.id,victim.id)).status) ) {
                    await ctx.reply("Unaban an Admin ?",{
                        reply_to_message_id : ctx.message.message_id
                    });
                    return;
                };

                await ctx.unbanChatMember(victim.id);
                await ctx.reply(`Sucessfully unbanned ${victim.first_name} from this chat.`);
                return;
            } else {
                
                await ctx.reply("Reply to a user to unban him from this chat.",{
                    reply_to_message_id : ctx.message.message_id
                });
            };
        
        } else if (user_can === null) {
        
            await ctx.reply("You are not an Admin.",{
                reply_to_message_id : ctx.message.message_id
            });
        
        } else {
            await ctx.reply("You lack Rights.",{
                reply_to_message_id : ctx.message.message_id
            });
        };

    } catch (eor) {
        await LOGGER(eor);
    };
});


 