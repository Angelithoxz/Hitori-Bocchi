import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'crow': '👑「 *`MENUS BOCCHI`* 」👑',
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

const vid = 'https://cdnmega.vercel.app/media/dwx0CKRD@MmwtDrN7W6x4EIFtt4ss50UJpk-F2fFXJBueIW1IZR8'

const defaultMenu = {
  before: `*•:•:•:•:•:•:•:•:•:•☾☼☽•:•.•:•.•:•:•:•:•:•*

"「💛」 ¡Hola! *%name* %greeting, Para Ver Tu Perfil Usa *#perfil* ❒"

╔━━━━━ *⊱𝐈𝐍𝐅𝐎 - 𝐁𝐎𝐓⊰*
✦  👤 *Cliente:* %name
✦  🔱 *Modo:* Público
✧  ✨ *Baileys:* Multi Device
✦  🪐 *Tiempo Activo:* %muptime
✧  💫 *Usuarios:* %totalreg 
╚━━━━━━━━━━━━━━
%readmore
*✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧*\n\n> Para Ser Un Sub Bots Usa #code para codigo de 8 dígitos y #qr para codigo qr.

\t*(✰◠‿◠) 𝐂 𝐨 𝐦 𝐚 𝐧 𝐝 𝐨 𝐬*   
`.trimStart(),
  header: '✦♥︎☆ %category ✦♥︎☆',
  body: '┃🍭 %cmd',
  footer: '*┗━*\n',
  after: `✦♥︎☆ 𝐁𝐨𝐜𝐜𝐡𝐢 𝐇𝐢𝐭𝐨𝐫𝐢 ✦♥︎☆`,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, estrellas, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    exp = exp || 0
    role = role || 'Aldeano'

    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins)
      .filter(plugin => plugin && !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help].filter(v => v),
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags].filter(v => v),
        prefix: 'customPrefix' in plugin,
        estrellas: plugin.estrellas,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }))

    let before = conn.menu?.before || defaultMenu.before
    let header = conn.menu?.header || defaultMenu.header
    let body = conn.menu?.body || defaultMenu.body
    let footer = conn.menu?.footer || defaultMenu.footer
    let after = conn.menu?.after || defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        let comandos = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help.length > 0)
        if (!comandos.length) return ''
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...comandos.map(menu => {
            return menu.help.map(cmd => {
              return body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
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
      uptime: muptime,
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
      totalreg,
      role,
      readmore: readMore
    }

    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    await conn.sendMessage(m.chat, { video: { url: vid }, caption: text.trim(), contextInfo: { mentionedJid: [m.sender] }, gifPlayback: true }, { quoted: null })

  } catch (e) {
    conn.reply(m.chat, `❌️ Lo sentimos, el menú tiene un error ${e.message}`, m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menuall', 'allmenú', 'allmenu', 'menucompleto'] 
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