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
  .then(effects => console.log(randomChoice(effects)))

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}
