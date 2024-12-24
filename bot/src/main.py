from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import json


def load_games_list():
    with open("./bot/src/games.json") as f:
        games = json.load(f)["games"]
        return games

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    games = load_games_list()
    keyboard = [
        [
            InlineKeyboardButton(game["name"], web_app=WebAppInfo(url=game["url"]))
            for game in games
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text("Choose a Game:", reply_markup=reply_markup)

app = ApplicationBuilder().token("8083906270:AAHTsVJjxDeAsZSXoqF-BvnRev3tciDVMvU").build()
app.add_handler(CommandHandler("start", start))
app.run_polling()