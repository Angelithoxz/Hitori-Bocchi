import axios from 'axios'
const {
  prepareWAMessageMedia
} = (await import("@whiskeysockets/baileys")).default

let handler = async (message, { conn, text }) => {
  if (!text) return conn.reply(message.chat, "❀ Por favor, ingrese un texto para realizar una búsqueda en TikTok.", message)

  try {
    const BOT_DEV = typeof dev !== 'undefined' ? dev : 'Angelithoxyz'
    const apiUrl = `https://api.stellarwa.xyz/search/tiktok?query=${encodeURIComponent(text)}&apikey=Angelithoxyz`
    const res = await axios.get(apiUrl)
    let searchResults = res.data?.data || res.data?.result || res.data || []
    if (!Array.isArray(searchResults)) searchResults = [searchResults]
    if (searchResults.length === 0) return conn.reply(message.chat, '✧ No se encontraron resultados para: ' + text, message)

    let result = searchResults[0]
    let caption = `✧ *Resultado de:* ${text}\n\n🎬 *Título:* ${result.title || "Sin título"}\n👤 *Autor:* ${result.author || "Desconocido"}\n\n${BOT_DEV}`

    if (result.images && Array.isArray(result.images) && result.images.length > 0) {
      await conn.sendMessage(message.chat, { caption, image: { url: result.images[0] } }, { quoted: message })
      if (result.images.length > 1) {
        for (let i = 1; i < result.images.length; i++) {
          await conn.sendMessage(message.chat, { image: { url: result.images[i] } }, { quoted: message })
        }
      }
    } else {
      let videoUrl = result.nowm || result.play || result.video || result.url || result.download || result.link
      if (!videoUrl) return conn.reply(message.chat, "⚠︎ No se pudo obtener el video.", message)
      await conn.sendMessage(message.chat, { video: { url: videoUrl }, caption }, { quoted: message })
    }

    let audioUrl = result.audio || result.music || result.sound || null
    if (audioUrl) {
      await conn.sendMessage(message.chat, { audio: { url: audioUrl }, mimetype: "audio/mpeg", fileName: "tiktok.mp3" }, { quoted: message })
    }

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