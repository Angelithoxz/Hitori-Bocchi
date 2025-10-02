import { promises as fs } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'crow': '👑「 MENUS BOCCHI 」👑',
  'main': '「INFO」🍨',
  'buscador': '「BUSQUEDAS」🍨',
  'fun': '「JUEGOS」🍨',
  'serbot': '「SUB BOTS」🍨',
  'rpg': '「RPG」🍨',
  'rg': '「REGISTRO」🍨',
  'sticker': '「STICKERS」🍨',
  'emox': '「ANIMES」🍨',
  'database': '「DATABASE」🍨',
  'grupo': '「GRUPOS」🍨',
  'nable': '「ON / OFF」',
  'descargas': '「DESCARGAS」🍨',
  'tools': '「HERRAMIENTAS」🍨',
  'info': '「INFORMACIÓN」🍨',
  'owner': '「CREADOR」🍨',
  'logos': '「EDICION LOGOS」🍨',
}

const menuImgs = [
  "https://raw.githubusercontent.com/Angelithoxz/Hitori-Bocchi/main/media/menus/Menu.jpg",
  "https://raw.githubusercontent.com/Angelithoxz/Hitori-Bocchi/main/media/menus/Menu2.jpg",
  "https://raw.githubusercontent.com/Angelithoxz/Hitori-Bocchi/main/media/menus/Menu3.jpg"
]

const defaultMenu = {
  before: `
✦♥︎☆  B o c c h i   H i t o r i  ✦♥︎☆

╭─⊷ ✧ 𝑀𝑒𝑛ú ✧
│
`.trimStart(),
  header: '│ ✧ %category\n',
  body: '│ ⌬ %cmd\n',
  footer: '│\n',
  after: '╰─────────────⊷'
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let packageInfo = JSON.parse(await fs.readFile(join(process.cwd(), 'package.json')))
  let randomImg = menuImgs[Math.floor(Math.random() * menuImgs.length)]
  let text = defaultMenu.before

  for (let tag in tags) {
    text += defaultMenu.header.replace(/%category/g, tags[tag])
    for (let plugin of Object.values(global.plugins).filter(p => p.tags && p.tags.includes(tag))) {
      let commands = plugin.command
      if (!commands) continue
      if (!Array.isArray(commands)) commands = [commands]
      for (let cmd of commands) {
        if (typeof cmd === 'string') {
          text += defaultMenu.body.replace(/%cmd/g, usedPrefix + cmd)
        } else if (cmd instanceof RegExp) {
          text += defaultMenu.body.replace(/%cmd/g, usedPrefix + cmd.source)
        }
      }
    }
    text += defaultMenu.footer
  }

  text += defaultMenu.after
  await conn.sendMessage(m.chat, { image: { url: randomImg }, caption: text }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help']

export default handler