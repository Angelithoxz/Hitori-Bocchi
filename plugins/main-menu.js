import { promises } from 'fs'
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

const vid = 'https://cdn.stellarwa.xyz/files/1759371799403.mp4'

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

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => '{}')) || {}
    let user = global.db.data.users[m.sender] || {}
    let { exp = 0, estrellas = 0, level = 0, role = 'Aldeano' } = user
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length
    let help = Object.values(global.plugins).filter(p => p && !p.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : plugin.help ? [plugin.help] : [],
        tags: Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : [],
        prefix: 'customPrefix' in plugin,
        estrellas: plugin.estrellas,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help) {
      if (plugin && plugin.tags) {
        for (let tag of plugin.tags) if (!(tag in tags) && tag) tags[tag] = tag
      }
    }
    let before = defaultMenu.before
    let header = defaultMenu.header
    let body = defaultMenu.body
    let footer = defaultMenu.footer
    let after = defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags.includes(tag) && menu.help.length).map(menu => {
            return menu.help.map(cmd => {
              return body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd).trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = _text
    let replace = {
      '%': '%',
      p: _p,
      uptime,
      muptime,
      me: conn.getName(conn.user.jid),
      taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      level,
      estrellas,
      name,
      week,
      date,
      time,
      totalreg,
      rtotalreg,
      role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    await conn.sendMessage(m.chat, { video: { url: vid }, caption: text.trim(), contextInfo: { mentionedJid: [m.sender] }, gifPlayback: true, gifAttribution: 0 }, { quoted: m })
  } catch (e) {
    conn.reply(m.chat, `❌️ Ocurrió un error en el menú\n${e.message}`, m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help']
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}