import axios from 'axios'
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia
} = (await import("@whiskeysockets/baileys")).default

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(message.chat, "❀ Por favor, ingrese un texto para realizar una búsqueda en tiktok.", message)

  async function createVideoMessage(url) {
    if (!url) return null
    try {
      const media = await prepareWAMessageMedia({ video: { url } }, { upload: conn.waUploadToServer })
      return media.videoMessage || null
    } catch (e) {
      return null
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1))
      const tmp = array[i]
      array[i] = array[k]
      array[k] = tmp
    }
  }

  try {
    const BOT_DEV = typeof dev !== 'undefined' ? dev : 'Angelithoxyz'
    const SOURCE_URL = typeof redes !== 'undefined' ? redes : 'https://github.com/Angelithoxyz'
    let avatarUrl = await conn.profilePictureUrl(conn.user.jid, 'image').catch(_ => 'https://tecnonoticias.cl/wp-content/uploads/2021/03/tiktok.jpg')
    let avatarFile = await conn.getFile(avatarUrl).catch(_ => null)
    let avatar = avatarFile ? avatarFile.data : null

    conn.reply(message.chat, '✧ *ENVIANDO SUS RESULTADOS..*', message, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          showAdAttribution: true,
          title: '♡  ͜ ۬︵࣪᷼⏜݊᷼𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨⏜࣪᷼︵۬ ͜ ',
          body: BOT_DEV,
          previewType: 0,
          thumbnail: avatar,
          sourceUrl: SOURCE_URL
        }
      }
    })

    const apiUrl = `https://api.stellarwa.xyz/search/tiktok?query=${encodeURIComponent(text)}&apikey=Angelithoxyz`
    const res = await axios.get(apiUrl)
    let searchResults = res.data?.data || res.data?.result || res.data || []
    if (!Array.isArray(searchResults)) searchResults = [searchResults]
    if (searchResults.length === 0) return conn.reply(message.chat, '✧ No se encontraron resultados para: ' + text, message)

    shuffleArray(searchResults)
    const topResults = searchResults.slice(0, 7)
    const cards = []

    for (const result of topResults) {
      const mediaUrl = result.nowm || result.play || result.video || result.url || result.download || result.link
      const videoMessage = await createVideoMessage(mediaUrl)
      if (videoMessage) {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: BOT_DEV }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: String(result.title || result.author || 'TikTok'),
            hasMediaAttachment: true,
            videoMessage
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
        })
      } else {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: String(result.description || result.title || '') }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: BOT_DEV }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: String(result.title || result.author || 'TikTok'),
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
        })
      }
    }

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({ text: "✧ RESULTADO DE: " + text }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: BOT_DEV }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    }, {
      quoted: message
    })

    await conn.relayMessage(message.chat, messageContent.message, { messageId: messageContent.key.id })
  } catch (error) {
    conn.reply(message.chat, `⚠︎ *OCURRIÓ UN ERROR:* ${error.message}`, message)
  }
}

handler.help = ["tiktoksearch <txt>"]
handler.register = true
handler.group = true
handler.tags = ["buscador"]
handler.command = ["tiktoksearch", "ttss", "tiktoks"]

export default handler