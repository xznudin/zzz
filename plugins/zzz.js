let handler = async (m, { conn, command, isOwner, isAdmin }) => {
	let isEnable = /on/i.test(command)
	let chat = global.db.data.chats[m.chat] || {}
	switch (command) {
		case 'onhidetag': case 'nohidetag':
			if (!m.isGroup) return dfail('group', m, conn)
			if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
			chat.lockHidetag = !isEnable
			break 
		default:
			break 
	}
	m.reply(`Fitur hidetag berhasil *${isEnable ? 'diaktifkan' : 'dinonaktifkan'}* di grup ini`)
}
handler.command = /^nohidetag|onhidetag$/i

export default handler