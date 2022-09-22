let handler = async (m, { text }) => m.reply(text || '')

handler.command = /^(say)$/i

export default handler