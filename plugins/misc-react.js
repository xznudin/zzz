let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Emoji?'
  let q = m.quoted ? await m.getQuotedObj() : m
  conn.sendMessage(m.chat, { react: { text: args[0], key: q.key }})
}
handler.help = ['react']
handler.tags = ['misc']
handler.command = /^(react)$/i

export default handler