const { Plugin } = require('powercord/entities');
const { React, getModule, channels: { getChannelId } } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { resolve } = require('path');
const Settings = require('./Settings');

module.exports = class Swerve extends Plugin {
  async startPlugin () {
    this.registerSettings(
      'swerve',
      'Swerve',
      () =>
        React.createElement(Settings, {
          settings: this.settings
        })
    );
    this.defaultWords = [
      'shit', 'slut', 'damn', 'dick', 'cock', 'pussy', 'fuck', 'penis', 'douche', 'cunt', 'faggot', 'wank', 'nigger', 'nigga', 'slut', 'bastard', 'bitch', 'asshole', 'dick', 'blowjob', 'cock', 'pussy', 'retard'
    ];
    this.loadCSS(resolve(__dirname, 'style.scss'));
    const SWEAR_WORDS = this.settings.config.words || this.defaultWords;

    const mdl = await getModule([ 'receiveMessage' ]);
    inject('swerve-message-listener', mdl, 'receiveMessage', (args, res) => {
      const message = args[1];
      if (message.channel_id === getChannelId()) {
        if (SWEAR_WORDS.some(word => document.body.innerText.includes(word))) {
          for (const word of SWEAR_WORDS) {
            const walker = document.createTreeWalker(
              document.body, // root node
              NodeFilter.SHOW_TEXT, // filtering only text nodes
              null,
              false
            );

            while (walker.nextNode()) {
              if (walker.currentNode.nodeValue.toLowerCase().trim().includes(word)) {
                if (walker.currentNode.parentElement && !walker.currentNode.parentElement.classList.contains('swerve-censor')) {
                  walker.currentNode.parentElement.innerHTML = walker.currentNode.parentElement.innerHTML.replace(new RegExp(word, 'gi'), `<span class='swerve-censor'>${word}</span>`);
                }
              }
            }
          }
        }
      }
      return res;
    });
  }

  pluginWillUnload () {
    uninject('swerve-message-listener');
  }
};
