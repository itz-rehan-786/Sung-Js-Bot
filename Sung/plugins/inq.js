//BSD 3-Clause License 
//Copyright (c) 2023-2024, Dhruv-Tara

// THE MOST MESSY CODE I HAVE EVER WRITTEN IN MY LIFE IDK WILL I EVER ADD ANYTHING HERE OR NOT


const { bot , LOGGER , sleep } = require("../index");
const {Help_data} = require("../config");
const { get_wyr_userlist , add_user_wyr , get_wyr_button} = require("./database/index");
const fs = require("node:fs");
const axios = require("axios");
const { edit_media,edit_caption } = require("../edits");



// SOME IMP INLINE KEYBOARDS //


const help_back_keyboard = [[
  {
      text : "Back",
      callback_data : "help_back"
  }
]];

const help_back_markup = {
  inline_keyboard : help_back_keyboard
};

//-------------------//


const help_total_keyboard = [[
  {
      text : "User",
      callback_data : "user_help"
  },{
    text : "Ai",
    callback_data : "ai_help"
  },{
      text : "Game",
      callback_data : "game_help"
  }
],[
  {
    text : "Admins",
    callback_data : "admins_help"
},{
    text : "Owner",
    callback_data : "owner_help"
},
],[
  {
      text : "Back",
      callback_data : "main_caption"
  }
]];

const help_total_markup = {
  inline_keyboard : help_total_keyboard
};

// =================== //

const keyboard = [
  [
    {
      text : "Help",
      callback_data : "help_back"
    }
  ],[
    {
      text: "Support",
      url: "https://t.me/monarchs_alley"
    }
    ],
];


const reply_markup_P = {
  inline_keyboard: keyboard,
};


// ---------------------------- //





// MAIN CODE TO HANDLE INLINE QUERY // 


bot.on("callback_query",async (ctx) => {
  try {
  if (ctx.callbackQuery.data === "delete_me"){
    if(ctx.callbackQuery.from.id === ctx.callbackQuery.message.reply_to_message.from.id || ctx.callbackQuery.from.id === 5146000168){
      await ctx.telegram.deleteMessage(ctx.callbackQuery.message.chat.id,ctx.callbackQuery.message.message_id)
      await ctx.answerCbQuery("Deleted");
      
    }else {await ctx.answerCbQuery("You can't delete this.",{show_alert : true})}
  }

  else if (ctx.callbackQuery.data === "nigga") {
    await ctx.answerCbQuery("",{url : "https://t.me/Sung_Jin_Bot?start=help"})
  }
  else if (ctx.callbackQuery.data === "user_help") {
    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      Help_data.user,
      {parse_mode : "HTML",reply_markup : help_back_markup}
    )
  }

  else if (ctx.callbackQuery.data === "game_help") {
    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      Help_data.game,
      {parse_mode : "HTML",reply_markup : help_back_markup}
    )
  }

  else if (ctx.callbackQuery.data === "ai_help") {
    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      Help_data.ai,
      {parse_mode : "HTML",reply_markup : help_back_markup}
    );
  }

  else if (ctx.callbackQuery.data === "owner_help") {
    if (ctx.callbackQuery.from.id === 5146000168){
    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      Help_data.owner,
      {parse_mode : "HTML",reply_markup : help_back_markup}
    );
  } else {
      await ctx.answerCbQuery("This is only for owner.",{show_alert : true})
    }
  }

  else if (ctx.callbackQuery.data === "help_back") {

    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      "Hello I'm Sung Jin Woo.\n\nClick on the button below to get description.",
      {parse_mode : "HTML",reply_markup : help_total_markup}
    );
  } else if (ctx.callbackQuery.data === "main_caption") {

    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      "Hello I am Sung Jin Woo\nI am under development",
      {parse_mode : "HTML",reply_markup : reply_markup_P}
    );

  } else if (ctx.callbackQuery.data === "admins_help") {

    await ctx.telegram.editMessageCaption(
      ctx.callbackQuery.message.chat.id,
      ctx.callbackQuery.message.message_id,
      undefined,
      Help_data.admins,
      {
        parse_mode : "HTML",
        reply_markup : help_back_markup
      }
    );

  } else if (ctx.callbackQuery.data.startsWith("red_wyr_")) {

    const msg = ctx.callbackQuery.message.reply_to_message ;

    const user_lst = await get_wyr_userlist(msg.chat.id,msg.message_id);
    if (user_lst.includes(ctx.callbackQuery.from.id)) {

      await ctx.answerCbQuery("You have already answered",{show_alert : true});

    } else {
      const usrid = ctx.callbackQuery.from.id
      await add_user_wyr(msg.chat.id,msg.message_id,"red_wyr",usrid);
      const blue_wyr_ = await get_wyr_button(msg.chat.id,msg.message_id,"blue_wyr");
      const red_wyr_ = await get_wyr_button(msg.chat.id,msg.message_id,"red_wyr");
      await ctx.telegram.editMessageReplyMarkup(
        ctx.callbackQuery.message.chat.id,
        ctx.callbackQuery.message.message_id,
        undefined,
        {
          inline_keyboard : [[
            {
              text : `🔵 : ${blue_wyr_}`,
              callback_data : `blue_wyr_${blue_wyr_}`
            },{
              text : `🔴 : ${red_wyr_}`,
              callback_data : `red_wyr_${red_wyr_}`
            }
          ]]
        }
      );
    };

  }  else if (ctx.callbackQuery.data.startsWith("blue_wyr_")) {

    const msg = ctx.callbackQuery.message.reply_to_message ;

    const user_lst = await get_wyr_userlist(msg.chat.id,msg.message_id);
    if (user_lst.includes(ctx.callbackQuery.from.id)) {

      await ctx.answerCbQuery("You have already answered",{show_alert : true});

    } else {
      const usid = ctx.callbackQuery.from.id
      await add_user_wyr(msg.chat.id,msg.message_id,"blue_wyr",usid);
      const blue_wyr_ = await get_wyr_button(msg.chat.id,msg.message_id,"blue_wyr");
      const red_wyr_ = await get_wyr_button(msg.chat.id,msg.message_id,"red_wyr");
      await ctx.telegram.editMessageReplyMarkup(
        ctx.callbackQuery.message.chat.id,
        ctx.callbackQuery.message.message_id,
        undefined,
        {
          inline_keyboard : [[
            {
              text : `🔵 : ${blue_wyr_}`,
              callback_data : `blue_wyr_${blue_wyr_}`
            },{
              text : `🔴 : ${red_wyr_}`,
              callback_data : `red_wyr_${red_wyr_}`
            }
          ]]
        }
      );
    };
  } 
  const json = fs.readFileSync("./temp/freegames.json",{encoding : "utf8"});
  const data = JSON.parse(json,1);

  try {
      if (ctx.callbackQuery.data.startsWith("free_ga") && ctx.callbackQuery.from.id !== ctx.callbackQuery.message.reply_to_message.from.id) {
        await ctx.answerCbQuery("This button is not for you");
      };
      if (ctx.callbackQuery.data === "free_games_menu" && ctx.callbackQuery.from.id === ctx.callbackQuery.message.reply_to_message.from.id) {

          const providers = Object.keys(data.content);
          const keyb = [];
          for (x in providers) {
              keyb.push([{text : providers[x],callback_data : `free_game_${providers[x]}`}]);
          }

          keyb.push([{
              text : "Delete",
              callback_data : "delete_me"
          }])

          await ctx.editMessageCaption("Here are the game providers providing free games.",{
              reply_markup : {inline_keyboard : keyb}
          });

      } else if (ctx.callbackQuery.data.startsWith("free_game_") && ctx.callbackQuery.from.id === ctx.callbackQuery.message.reply_to_message.from.id) {

          const provider_name = ctx.callbackQuery.data.split("_")[2];
          const game_json = data.content[`${provider_name}`];

          const keyb = [];

          for (x in game_json) {

              keyb.push([{
                  text : game_json[x].name,
                  callback_data : `free_gams_${provider_name}_${x}`
              }]);

          }
          
          keyb.push([{
              text : "Back",
              callback_data : "free_games_menu"
          }])

          await ctx.editMessageCaption("Select the game to check its description and genre.",{
              reply_markup : {inline_keyboard : keyb}
          });

      } else if (ctx.callbackQuery.data.startsWith("free_gams_") && ctx.callbackQuery.from.id === ctx.callbackQuery.message.reply_to_message.from.id) {

        const provider_name = ctx.callbackQuery.data.split("_")[2];
        const game_no = ctx.callbackQuery.data.split("_")[3];
        const game_data = data.content[provider_name][parseInt(game_no)];

        let cap = "";
        cap += `Name : ${game_data.name}`;
        game_data.description ? cap += `\n\nDescription : ${game_data.description}` : "";
        game_data.genres ? cap += `\n\nGenre : ${game_data.genres}` : "";
        game_data.url ? cap += `\n\nURL : <a href="${game_data.url}">${game_data.name}</a>` : "";

        await edit_media(ctx.callbackQuery.message.chat.id,ctx.callbackQuery.message.message_id,game_data.image);
        await sleep(1000);
        await ctx.editMessageCaption(cap,{
          reply_markup : {inline_keyboard : [[
            {
              text : "Get it now !",
              url : game_data.url
            },
              {
                text : "Back" ,
                callback_data : `free_game_${provider_name}`
              }
            ]]
          },
          parse_mode : "HTML"
        })
        };
      
      

      } catch (eor) {

          await ctx.answerCbQuery("Some Issue occured try again.");
          await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
          await LOGGER(eor)

      };


} catch (eor) {
    await LOGGER(eor)
  };

});

