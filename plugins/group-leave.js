let handler = async (m, { conn, args, isOwner, isAdmin }) => {
	if (!(isOwner || isAdmin)) throw dfail('admin', m, conn)
	let regex = /^([0-9]{5,16}-[0-9]+|[0-9]+)@g\.us$/, group = m.chat
	if (regex.test(args[0])) group = args[0]
	if (!regex.test(group)) throw dfail('group', m, conn)
	let groupMeta = await conn.groupMetadata(group).catch(console.error)
	if (!groupMeta) throw 'groupMetadata is undefined :\\'
	if (!'participants' in groupMeta) throw 'participants is not defined :('
	let me = groupMeta.participants.find(v => v.id === conn.user.jid)
	if (!me) throw 'Aku tidak ada di grup itu :(' 
	await conn.groupLeave(group)
}
handler.command = /^leave(gc|gro?up)?$/i

export default handler