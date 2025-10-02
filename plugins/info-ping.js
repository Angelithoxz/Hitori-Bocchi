import speed from 'performance-now'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  let txt = `
┏━━━━━━━━━━━━━━┓
┃   ✦ 𝑷𝑰𝑵𝑮 𝑻𝑬𝑺𝑻 ✦
┗━━━━━━━━━━━━━━┛

☆ 𝑷𝒐𝒏𝒈: *${latensi.toFixed(4)} ms* ⚡
♥︎ 𝑬𝒔𝒕𝒂𝒃𝒍𝒆: ✓
☆━━━━━━━━━━━━☆
`.trim()

  conn.reply(m.chat, txt, m)
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping','p']
handler.register = true
//handler.estrellas = 2;

export default handler