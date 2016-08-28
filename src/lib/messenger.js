import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import config from '../config';
import Validator from './validator';
import handlers from '../handlers';

const validator = new Validator();

export default class Messenger {
  constructor() {
    // if (process.env.NODE_ENV === 'production') {
    //   this.bot = new TelegramBot(config.telegram.token, { webHook: { port: config.telegram.port, host: config.telegram.host } });
    //   this.bot.setWebHook(`${config.telegram.externalUrl}:433/bot${config.telegram.token}`);
    // } else {
    //   this.bot = new TelegramBot(config.telegram.token, { polling: true });
    // }

    this.bot = new TelegramBot(config.telegram.token, { polling: true });

    this.handleText = this.handleText.bind(this);
  }

  listen() {
    this.bot.on('text', this.handleText);

    return Promise.resolve();
  }

  handleText(msg) {
    const message = new Message(Message.mapMessage(msg));
    const text = message.text;

    if (validator.isAskingForOverallStats(text)) {
      return handlers.command.getOverallStats(message, this.bot);
    }

    return handlers.command.getHelp(message, this.bot);
  }
}
