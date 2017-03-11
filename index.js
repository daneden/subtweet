require('dotenv').config()

import fsp from 'fs-promise'
import Twit from 'twit'

const TWIT_CONFIG = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
}

const T = new Twit(TWIT_CONFIG)

const files = [0, 1, 2]
const blacklist = [
  "RIPLY",
  "PARKER",
  "KANE",
  "ENGLISH SDH",
].map(item => `[${item}]`)

let attempt = 1
const attemptLimit = 2

function tweetSoundEffect() {
  fsp.readFile(`txt/${randomChoice(files)}.txt`)
    .then(contents => {
      const effects = contents.toString('utf-8').match(/\[.*?\]/gi)
      return effects
    })
    .then(effects => effects.map(effect => {
      return (
        effect.replace(/<.*?\/?>/, '')
          .replace(/\[ ?/, '[')
          .replace(/ ?\]/, ']')
          .toUpperCase()
      )
    }))
    .then(effects => effects.filter(effect => blacklist.indexOf(effect) === -1))
    .then(effects => randomChoice(effects))
    .then(choice => {
      T.post('statuses/update', {
        status: choice,
      }, (err, data, response) => {
        if(!err) console.log(`Tweeted ${choice}`)
        else {
          attempt++
          console.error('Error tweeting sound effect:', err)
          if(attempt <= attemptLimit) {
            console.log(`Attempt ${attempt} of ${attempLimit}...`)
            tweetSoundEffect()
          } else {
            console.log(`Attempt limit hit; tweeting failed.`)
          }
        }
      })
    })
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

tweetSoundEffect()
