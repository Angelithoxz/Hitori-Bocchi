const {
  proto,
  generateWAMessage,
  areJidsSameUser,
} = (await import('@whiskeysockets/baileys')).default;

export async function all(m, chatUpdate) {
  try {
    if (m.isBaileys) return;
    if (!m.message) return;
    if (!m.msg?.fileSha256) return;

    if (!global.db.data.sticker) global.db.data.sticker = {};

    const hashId = Buffer.from(m.msg.fileSha256).toString('base64');
    if (!(hashId in global.db.data.sticker)) return;

    const hash = global.db.data.sticker[hashId];
    const { text, mentionedJid } = hash;

    const messages = await generateWAMessage(
      m.chat,
      { text, mentions: mentionedJid },
      {
        userJid: this.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      }
    );

    messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;

    if (m.isGroup) messages.participant = m.sender;

    const msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: 'append',
    };

    this.ev.emit('messages.upsert', msg);
  } catch (e) {
    console.error('Error en el handler de stickers:', e);
  }
}