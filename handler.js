import { smsg } from "./lib/simple.js"
import { format } from "util"
import { fileURLToPath } from "url"
import path, { join } from "path"
import fs, { unwatchFile, watchFile } from "fs"
import chalk from "chalk"
import fetch from "node-fetch"
import ws from "ws"

const { proto } = (await import("@whiskeysockets/baileys")).default
const isNumber = x => typeof x === "number" && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []
  this.uptime = this.uptime || Date.now()
  if (!chatUpdate) return
  this.pushMessage(chatUpdate.messages).catch(console.error)
  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m) return

  if (global.db.data == null) await global.loadDatabase()

  try {
    m = smsg(this, m) || m
    if (!m) return
    m.exp = 0

    let user = global.db.data.users[m.sender]
    if (typeof user !== "object") global.db.data.users[m.sender] = {}
    if (user) {
      if (!("name" in user)) user.name = m.name
      if (!isNumber(user.exp)) user.exp = 0
      if (!isNumber(user.coin)) user.coin = 0
      if (!isNumber(user.bank)) user.bank = 0
      if (!isNumber(user.level)) user.level = 0
      if (!isNumber(user.health)) user.health = 100
      if (!("genre" in user)) user.genre = ""
      if (!("birth" in user)) user.birth = ""
      if (!("marry" in user)) user.marry = ""
      if (!("description" in user)) user.description = ""
      if (!("packstickers" in user)) user.packstickers = null
      if (!("premium" in user)) user.premium = false
      if (!user.premium) user.premiumTime = 0
      if (!("banned" in user)) user.banned = false
      if (!("bannedReason" in user)) user.bannedReason = ""
      if (!isNumber(user.commands)) user.commands = 0
      if (!isNumber(user.afk)) user.afk = -1
      if (!("afkReason" in user)) user.afkReason = ""
      if (!isNumber(user.warn)) user.warn = 0
    } else {
      global.db.data.users[m.sender] = {
        name: m.name,
        exp: 0,
        coin: 0,
        bank: 0,
        level: 0,
        health: 100,
        genre: "",
        birth: "",
        marry: "",
        description: "",
        packstickers: null,
        premium: false,
        premiumTime: 0,
        banned: false,
        bannedReason: "",
        commands: 0,
        afk: -1,
        afkReason: "",
        warn: 0
      }
    }

    let chat = global.db.data.chats[m.chat]
    if (typeof chat !== "object") global.db.data.chats[m.chat] = {}
    if (chat) {
      if (!("isBanned" in chat)) chat.isBanned = false
      if (!("welcome" in chat)) chat.welcome = true
      if (!("sWelcome" in chat)) chat.sWelcome = ""
      if (!("sBye" in chat)) chat.sBye = ""
      if (!("detect" in chat)) chat.detect = true
      if (!("primaryBot" in chat)) chat.primaryBot = null
      if (!("modoadmin" in chat)) chat.modoadmin = false
      if (!("antiLink" in chat)) chat.antiLink = true
      if (!("nsfw" in chat)) chat.nsfw = false
      if (!("economy" in chat)) chat.economy = true
      if (!("gacha" in chat)) chat.gacha = true
    } else {
      global.db.data.chats[m.chat] = {
        isBanned: false,
        welcome: true,
        sWelcome: "",
        sBye: "",
        detect: true,
        primaryBot: null,
        modoadmin: false,
        antiLink: true,
        nsfw: false,
        economy: true,
        gacha: true
      }
    }

    var settings = global.db.data.settings[this.user.jid]
    if (typeof settings !== "object") global.db.data.settings[this.user.jid] = {}
    if (settings) {
      if (!("self" in settings)) settings.self = false
      if (!("restrict" in settings)) settings.restrict = true
      if (!("jadibotmd" in settings)) settings.jadibotmd = true
      if (!("antiPrivate" in settings)) settings.antiPrivate = false
      if (!("gponly" in settings)) settings.gponly = false
      if (!("botname" in settings)) settings.botname = "Alya San"
      if (!("textbot" in settings)) settings.textbot = "Alya, Made With By Ryūsei Club"
      if (!("currency" in settings)) settings.currency = "Monedas"
      if (!("banner" in settings)) settings.banner = "https://cdn.stellarwa.xyz/files/1759105830341.jpeg"
      if (!("icono" in settings)) settings.icono = "https://cdn.stellarwa.xyz/files/1759105830341.jpeg"
    } else {
      global.db.data.settings[this.user.jid] = {
        self: false,
        botname: "Alya San",
        textbot: "Alya, Made With By Ryūsei Club",
        currency: "Monedas",
        banner: "https://cdn.stellarwa.xyz/files/1759105830341.jpeg",
        icono: "https://raw.githubusercontent.com/Angelithoxz/Ryusei-Club/main/adiciones/1759169801947.jpg",
        restrict: true,
        jadibotmd: true,
        antiPrivate: false,
        gponly: false
      }
    }
  } catch (e) {
    console.error(e)
  }

  if (typeof m.text !== "string") m.text = ""
  const user = global.db.data.users[m.sender]

  try {
    const actual = user.name || ""
    const nuevo = m.pushName || await this.getName(m.sender)
    if (typeof nuevo === "string" && nuevo.trim() && nuevo !== actual) user.name = nuevo
  } catch {}

  const chat = global.db.data.chats[m.chat]
  const setting = global.db.data.settings[this.user.jid]

  const isROwner = [...global.owner.map(n => n)].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
  const isOwner = isROwner || m.fromMe
  const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender) || user.premium

  if (opts["nyimak"]) return
  if (!m.fromMe && setting["self"]) return
  if (!m.fromMe && setting["gponly"] && !m.chat.endsWith("g.us") && !/code|p|ping|qr|estado|status|infobot|botinfo|report|reportar|invite|join|logout|suggest|help|menu/gim.test(m.text)) return
  if (opts["swonly"] && m.chat !== "status@broadcast") return

  if (opts["queque"] && m.text && !isPrems) {
    const queque = this.msgqueque, time = 5000
    const previousID = queque[queque.length - 1]
    queque.push(m.id || m.key.id)
    setInterval(async () => {
      if (queque.indexOf(previousID) === -1) clearInterval(this)
      await delay(time)
    }, time)
  }

  if (m.isBaileys) return
  m.exp += Math.ceil(Math.random() * 10)
  let usedPrefix

  const groupMetadata = m.isGroup ? { ...(conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(_ => null) || {}) } : {}
  const participants = ((m.isGroup ? groupMetadata.participants : []) || []).map(p => ({ id: p.jid, jid: p.jid, lid: p.lid, admin: p.admin }))
  const userGroup = (m.isGroup ? participants.find(u => conn.decodeJid(u.jid) === m.sender) : {}) || {}
  const botGroup = (m.isGroup ? participants.find(u => conn.decodeJid(u.jid) == this.user.jid) : {}) || {}
  const isRAdmin = userGroup?.admin == "superadmin" || false
  const isAdmin = isRAdmin || userGroup?.admin == "admin" || false
  const isBotAdmin = botGroup?.admin || false

  const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "./plugins")

  for (const name in global.plugins) {
    const plugin = global.plugins[name]
    if (!plugin || plugin.disabled) continue
    const __filename = join(___dirname, name)

    if (typeof plugin.all === "function") {
      try {
        await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename, user, chat, setting })
      } catch (err) {
        console.error(err)
      }
    }

    if (!opts["restrict"] && plugin.tags && plugin.tags.includes("admin")) continue

    const strRegex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
    const pluginPrefix = plugin.customPrefix || conn.prefix || global.prefix
    const match = (
      pluginPrefix instanceof RegExp
        ? [[pluginPrefix.exec(m.text), pluginPrefix]]
        : Array.isArray(pluginPrefix)
          ? pluginPrefix.map(prefix => {
              const regex = prefix instanceof RegExp ? prefix : new RegExp(strRegex(prefix))
              return [regex.exec(m.text), regex]
            })
          : typeof pluginPrefix === "string"
            ? [[new RegExp(strRegex(pluginPrefix)).exec(m.text), new RegExp(strRegex(pluginPrefix))]]
            : [[[], new RegExp]]
    ).find(prefix => prefix[1])

    if (typeof plugin.before === "function") {
      if (await plugin.before.call(this, m, { match, conn: this, participants, groupMetadata, userGroup, botGroup, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename, user, chat, setting })) continue
    }

    if (typeof plugin !== "function") continue

    if ((usedPrefix = (match[0] || "")[0])) {
      const noPrefix = m.text.replace(usedPrefix, "")
      let [command, ...args] = noPrefix.trim().split(" ").filter(v => v)
      args = args || []
      let _args = noPrefix.trim().split(" ").slice(1)
      let text = _args.join(" ")
      command = (command || "").toLowerCase()
      const fail = plugin.fail || global.dfail
      const isAccept = plugin.command instanceof RegExp
        ? plugin.command.test(command)
        : Array.isArray(plugin.command)
          ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command)
          : typeof plugin.command === "string"
            ? plugin.command === command
            : false

      global.comando = command

      if ((m.id.startsWith("NJX-") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20))) return

      if (global.db.data.chats[m.chat].primaryBot && global.db.data.chats[m.chat].primaryBot !== this.user.jid) {
        const primaryBotConn = global.conns.find(conn => conn.user.jid === global.db.data.chats[m.chat].primaryBot && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
        const participants = m.isGroup ? (await this.groupMetadata(m.chat).catch(() => ({ participants: [] }))).participants : []
        const primaryBotInGroup = participants.some(p => p.jid === global.db.data.chats[m.chat].primaryBot)
        if (primaryBotConn && primaryBotInGroup || global.db.data.chats[m.chat].primaryBot === global.conn.user.jid) throw !1
      }

      if (!isAccept) continue
      m.plugin = name
      if (isAccept) global.db.data.users[m.sender].commands = (global.db.data.users[m.sender].commands || 0) + 1

      if (chat) {
        const botId = this.user.jid
        const primaryBotId = chat.primaryBot
        if (name !== "group-banchat.js" && chat?.isBanned && !isMods) {
          if (!primaryBotId || primaryBotId === botId) {
            const aviso = `ꕥ El bot *${setting.botname}* está desactivado en este grupo\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`
            await m.reply(aviso)
            return
          }
        }
        if (m.text && user.banned && !isMods) {
          const mensaje = `ꕥ Estas baneado/a, no puedes usar comandos en este bot!\n\n> ● *Razón ›* ${user.bannedReason}\n\n> ● Si este Bot es cuenta oficial y tienes evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`
          if (!primaryBotId || primaryBotId === botId) {
            m.reply(mensaje)
            return
          }
        }
      }

      const adminMode = chat.modoadmin || false
      const wa = plugin.botAdmin || plugin.admin || plugin.group || plugin || noPrefix || pluginPrefix || m.text.slice(0, 1) === pluginPrefix || plugin.command
      if (adminMode && !isOwner && m.isGroup && !isAdmin && wa) return
      if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
        fail("owner", m, this)
        continue
      }
      if (plugin.rowner && !isROwner) {
        fail("rowner", m, this)
        continue
      }
      if (plugin.owner && !isOwner) {
        fail("owner", m, this)
        continue
      }
      if (plugin.premium && !isPrems) {
        fail("premium", m, this)
        continue
      }
      if (plugin.group && !m.isGroup) {
        fail("group", m, this)
        continue
      } else if (plugin.botAdmin && !isBotAdmin) {
        fail("botAdmin", m, this)
        continue
      } else if (plugin.admin && !isAdmin) {
        fail("admin", m, this)
        continue
      }
      if (plugin.private && m.isGroup) {
        fail("private", m, this)
        continue
      }

      m.isCommand = true
      m.exp += plugin.exp ? parseInt(plugin.exp) : 10
      let extra = { match, usedPrefix, noPrefix, _args, args, command, text, conn: this, participants, groupMetadata, userGroup, botGroup, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename, user, chat, setting }

      try {
        await plugin.call(this, m, extra)
      } catch (err) {
        m.error = err
        console.error(err)
      } finally {
        if (typeof plugin.after === "function") {
          try {
            await plugin.after.call(this, m, extra)
          } catch (err) {
            console.error(err)
          }
        }
      }
    }
  }

  try {
    if (opts["queque"] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
    }
    let user, stats = global.db.data.stats
    if (m) if (m.sender && (user = global.db.data.users[m.sender])) user.exp += m.exp
    if (!opts["noprint"]) await (await import("./lib/print.js")).default(m, this)
  } catch (err) {
    console.warn(err)
    console.log(m.message)
  }
}

global.dfail = (type, m, conn) => {
const msg = {
rowner: '《★》Esta función solo puede ser usada por mi creador', 
owner: '《★》Esta función solo puede ser usada por mi desarrollador.', 
mods: '《★》Esta función solo puede ser usada por los moderadores del bot', 
premium: '《★》Esta función solo es para usuarios Premium.', 
group: '《★》Esta funcion solo puede ser ejecutada en grupos.', 
private: '《★》Esta función solo puede ser usada en chat privado.', 
admin: '《★》Este comando solo puede ser usado por admins.', 
botAdmin: '《★》Para usar esta función debo ser admin.',
unreg: `《★》No te encuentras registrado, registrese para usar esta función\n*/reg nombre.edad*\n\n*Ejemplo* : */reg Bocchi.18*`,
restrict: '《★》Esta característica esta desactivada.'
}[type];
if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("Se actualizo 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})