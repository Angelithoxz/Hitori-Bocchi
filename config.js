import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

//*─ׄ─ׅ─⭒─ׄ─ INFO PROPIETARIO ─ׄ─⭒─*
global.owner = [
   ['51901019299', '✦ 𝐀𝐧𝐠𝐞𝐥𝐢𝐭𝐡𝐨𝐱𝐲𝐳 ✦', true],
]

global.creadorbot = [
   ['51901019299', '✦ 𝐀𝐧𝐠𝐞𝐥𝐢𝐭𝐡𝐨𝐱𝐲𝐳 ✦', true],
]

global.mods = ['']
global.prems = ['']

//*─ׄ─ׅ─⭒─ׄ─ INFO BOT ─ׄ─⭒─*
global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'BocchiBot'
global.namebot = '✦ Bocchi Hitori ✦'
global.sessions = 'BocchiSession'
global.jadi = 'BocchiJadiBot' 
global.yukiJadibts = true 

global.packname = '✦ Bocchi Hitori ✦ ❖'
global.botname = '✧ Bocchi Hitori ✧'
global.wm = '✦ Ryusei Club Infinity ☆'
global.author = '♥︎ Made By Ryusei Club Infinity ♥︎'
global.dev = '© Ryusei Club Infinity'
global.espera = '✰ 𝐄𝐬𝐩𝐞𝐫𝐚 un momento, procesando tu pedido ✰'
global.textbot = `「 ✦ Bocchi Hitori ✦ 」`
global.publi = '✦ Sigue el canal oficial 👇'

//*─ׄ─ׅ─⭒─ׄ─ IMÁGENES ─ׄ─⭒─*
global.imagen1 = fs.readFileSync('./media/menus/Menu.jpg')
global.imagen2 = fs.readFileSync('./media/menus/Menu2.jpg')
global.imagen3 = fs.readFileSync('./media/menus/Menu3.jpg')
global.welcome = fs.readFileSync('./media/welcome.jpg')
global.adios = fs.readFileSync('./media/adios.jpg')
global.catalogo = fs.readFileSync('./media/catalogo.jpg')

//*─ׄ─ׅ─⭒─ׄ─ LINKS ─ׄ─⭒─*
global.repobot = 'https://github.com/'
global.grupo = ''
global.gsupport = ''
global.channel = '120363374826926142@newsletter'

// Lista de canales (para joinChannels en index.js)
global.ch = {
  main: '120363374826926142@newsletter',
}

//*─ׄ─ׅ─⭒─ׄ─ ESTILO MENSAJE ─ׄ─⭒─*
global.estilo = { 
  key: {  
    fromMe: false, 
    participant: `0@s.whatsapp.net`, 
    ...(false ? { remoteJid: "543876577197-120363317332020195@g.us" } : {}) 
  }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: '✦ Ryusei Club Infinity ✦', 
      orderTitle: 'BocchiBot', 
      thumbnail: catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
}

//*─ׄ─ׅ─⭒─ׄ─ LIBRERÍAS ─ׄ─⭒─*
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment        

global.multiplier = 69 

//*─ׄ─ׅ─⭒─ׄ─ AUTO UPDATE ─ׄ─⭒─*
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})