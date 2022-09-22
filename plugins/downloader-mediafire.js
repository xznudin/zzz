import { lookup } from 'mime-types'
import { mediafiredl } from '@bochilteam/scraper'

let handler = async (m, { conn, args, isOwner }) => {
	if (!args[0]) throw 'Input URL' 
	if (!/https?:\/\/(www\.)?mediafire\.com/.test(args[0])) throw 'Invalid URL' 
	let res = await mediafiredl(args[0])
	let mimetype = await lookup(res.url)
	delete res.url2
	await m.reply(Object.keys(res).map(v => `*• ${v.capitalize()}:* ${res[v]}`).join('\n') + '\n\n_Sending file..._')
	isOwner ? await conn.sendMessage(m.chat, { document: { url: res.url }, fileName: res.filename, mimetype }, { quoted: m }) : await conn.sendFile(m.chat, res.url, res.filename, '', m, false, { mimetype, asDocument: true })
}
handler.help = handler.alias = ['mediafire']
handler.tags = ['downloader']
handler.command = /^(mediafire)$/i

export default handler
