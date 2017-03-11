require('dotenv').config()

import fsp from 'fs-promise'
import Twit from 'twit'

const debug = false

const TWIT_CONFIG = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
}

const T = new Twit(TWIT_CONFIG)

const files = [0, 1, 2, 3, 4]
const blacklist = [
  "RIPLY",
  "PARKER",
  "KANE",
  "BRETT",
  "ENGLISH SDH",
].map(item => `[${item}]`)

let attempt = 1
const attemptLimit = 2

function tweetSoundEffect() {
  fsp.readFile(`txt/${randomChoice(files)}.txt`)
    // Find all the [SOUND EFFECTS]
    .then(contents => {
      const effects = contents.toString('utf-8').match(/[\[\(].*?[\]\)]/gi)
      return effects
    })

    // Normalize them
    .then(effects => effects.map(effect => {
      return (
        effect.replace(/<.*?\/?>/, '')
          .replace(/[\[\(] ?/, '[')
          .replace(/ ?[\]\)]/, ']')
          .toUpperCase()
      )
    }))

    // Filter out 'blacklisted' values (such as names in transcripts
    // which denote dialog changes
    .then(effects => effects.filter(effect => blacklist.indexOf(effect) === -1))

    // Filter out duplicate entries so that all options have an equal chance
    .then(effects => effects.filter((effect, i, all) => all.indexOf(effect) === i))

    // Pick one random [SOUND EFFECT]
    .then(effects => randomChoice(effects))

    // Finally, tweet or log the [SOUND EFFECT]
    .then(choice => {
      if (!debug) {
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
      } else console.log(choice)
    })
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

tweetSoundEffect()
