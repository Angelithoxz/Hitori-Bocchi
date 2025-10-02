import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
  const activos = [...new Set(
    global.conns
      .filter(sock => sock.user && sock.ws.socket && sock.ws.socket.readyState !== ws.CLOSED)
      .map(sock => sock.user.jid)
  )]

  if (global.conn?.user?.jid && !activos.includes(global.conn.user.jid)) {
    activos.push(global.conn.user.jid)
  }

  const chat = global.db.data.chats[m.chat]
  const mencionados = m.mentionedJid || []
  const who = mencionados[0] ? mencionados[0] : m.quoted ? m.quoted.sender : false

  if (!who) {
    return conn.reply(
      m.chat,
      `┏━━━━━━━━━━━━━━━━━━━┓\n` +
      `   ✦❀ 𝐑𝐲𝐮𝐬𝐞𝐢 𝐂𝐥𝐮𝐛 𝐈𝐧𝐟𝐢𝐧𝐢𝐭𝐲 ❀✦\n` +
      `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
      ` Por favor, menciona a un *Socket activo* para asignarlo como Bot primario del grupo.`,
      m
    )
  }

  if (!activos.includes(who)) {
    return conn.reply(
      m.chat,
      `┏━━━━━━━━━━━━━━━━━━━┓\n` +
      `✦ꕥ El usuario mencionado no pertenece a los *Sockets de ${global.botname || "Ryusei Bot"}*.\n` +
      `┗━━━━━━━━━━━━━━━━━━━┛`,
      m
    )
  }

  if (chat.primaryBot === who) {
    return conn.reply(
      m.chat,
      `┏━━━━━━━━━━━━━━━━━━━┓\n` +
      `✦ꕥ @${who.split`@`[0]} ya está configurado como Bot primario en este grupo.\n` +
      `┗━━━━━━━━━━━━━━━━━━━┛`,
      m,
      { mentions: [who] }
    )
  }

  try {
    chat.primaryBot = who
    conn.reply(
      m.chat,
      `┏━━━━━━━━━━━━━━━━━━━┓\n` +
      `✦❀ Se ha asignado a @${who.split`@`[0]} como *Bot primario* del grupo.\n` +
      `> Ahora todos los comandos serán administrados por este Bot.\n` +
      `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
      `✦❀ 𝐑𝐲𝐮𝐬𝐞𝐢 𝐂𝐥𝐮𝐛 𝐈𝐧𝐟𝐢𝐧𝐢𝐭𝐲 ❀✦`,
      m,
      { mentions: [who] }
    )
  } catch (e) {
    conn.reply(
      m.chat,
      `┏━━━━━━━━━━━━━━━━━━━┓\n` +
      `⚠︎ Ha ocurrido un error inesperado.\n` +
      `> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}\n` +
      `┗━━━━━━━━━━━━━━━━━━━┛`,
      m
    )
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler