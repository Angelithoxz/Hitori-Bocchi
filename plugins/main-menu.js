import fs from 'fs'
import path from 'path'

const menuDir = path.join(process.cwd(), 'media', 'menus')

function getRandomMenuImage() {
  let files = fs.readdirSync(menuDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg') || f.endsWith('.webp'))
  if (!files.length) return null
  let randomFile = files[Math.floor(Math.random() * files.length)]
  return path.join(menuDir, randomFile)
}

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
*✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧*\n\n> Para Ser Un Sub Bots Usa #code para codigo de 8 dígitos y #qr para codigo qr.

\t*(✰◠‿◠) 𝐂 𝐨 𝐦 𝐚 𝐧 𝐝 𝐨 𝐬*   
`.trimStart(),
  header: '✦♥︎☆ %category ✦♥︎☆',
  body: '┃🍭 %cmd',
  footer: '*┗━*\n',
  after: `✦♥︎☆ 𝐁𝐨𝐜𝐜𝐡𝐢 𝐇𝐢𝐭𝐨𝐫𝐢 ✦♥︎☆`,
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let name = await conn.getName(m.sender)
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

    let text = [
      before.replace(/%name/g, name).replace(/%muptime/g, muptime).replace(/%totalreg/g, totalreg).replace(/%date/g, date).replace(/%week/g, week),
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

    let img = getRandomMenuImage()
    if (img) {
      await conn.sendFile(m.chat, img, 'menu.jpg', text, m)
    } else {
      await conn.reply(m.chat, text, m)
    }

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error en el menú', m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}