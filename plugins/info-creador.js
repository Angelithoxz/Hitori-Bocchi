import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
   await m.react('✦')

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)
    let edtr = `@${m.sender.split`@`[0]}`
    let username = conn.getName(m.sender)

    let list = [{
        displayName: "Angelithoxyz ✦♥︎☆",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: ᴀɴɢᴇʟɪᴛʜᴏxʏᴢ ✦♥︎☆\nitem1.TEL;waid=51901019299:51901019299\nitem1.X-ABLabel:Número\nitem2.EMAIL;type=INTERNET: angelithoxyz@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://ryusei-web.vercel.app/\nitem3.X-ABLabel:Web\nitem4.ADR:;; Perú;;;;\nitem4.X-ABLabel:Región\nEND:VCARD`,
    }]

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contacto`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: '✦ Hola, soy ᴀɴɢᴇʟɪᴛʜᴏxʏᴢ ♥︎☆',
                body: 'Creador oficial',
                thumbnailUrl: 'https://cdn.stellarwa.xyz/files/1759421407773.jpeg',
                sourceUrl: 'https://ryusei-web.vercel.app/',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, {
        quoted: m
    })

    let txt = `✦👋 Hola \`${username}\`\nEste es el contacto de mi creador ♥︎☆`

    await conn.sendMessage(m.chat, { text: txt })
}

handler.help = ['owner', 'creator']
handler.tags = ['main']
handler.command = /^(owner|creator|creador|dueño)$/i

export default handler