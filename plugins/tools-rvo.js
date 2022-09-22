let handler = async (m, { conn }) => {
	if (!/viewOnce/.test(m.quoted?.mtype)) throw 'Reply a viewOnceMessage'
	let val = { ...await m.getQuotedObj() }
	let msg = val.message.viewOnceMessage.message
	delete msg[Object.keys(msg)[0]].viewOnce
	val.message = msg
	await conn.sendMessage(m.chat, { forward: val }, { quoted: m })
}
handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = /^(retrieve|rvo|readviewonce)$/i

export default handler