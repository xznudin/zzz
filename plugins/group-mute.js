let handler = async (m, { conn, args, command, isOwner, isAdmin }) => {
	let isEnable = !/un/i.test(command), regex = /^([0-9]{5,16}-[0-9]+|[0-9]+)@g\.us$/, group = m.chat
	if (regex.test(args[0])) group = args[0]
	if (!regex.test(group)) throw dfail('group', m, conn)
	let groupMeta = await conn.groupMetadata(group).catch(console.error)
	if (!groupMeta) throw 'groupMetadata is undefined :\\'
	let chat = global.db.data.chats[group] || {}
	switch (command) {
		case 'mute': case 'unmute':
			// if (!m.isGroup) return dfail('group', m, conn)
			if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
			chat.isBanned = isEnable
			break 
		default:
			break 
	}
	m.reply(`*${conn.user.name}* berhasil di *${command}* di grup ${groupMeta.subject}`)
}
handler.command = /^mute|unmute$/i

export default handler
