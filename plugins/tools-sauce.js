import sagiri from 'sagiri'
import { webp2png } from '../lib/webp2mp4.js'
let sauceNao = sagiri('d78bfeac5505ab0a2af7f19d369029d4f6cd5176')

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m,
		mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/image/g.test(mime)) {
		let url = await webp2png(await q.download()),
			res = await sauceNao(url),
			img = await conn.getFile(res[0].thumbnail).catch(() => null),
			txt = res.map((v) => `${v.site}: ${v.authorName} (${v.similarity}%)\nSauce: ${v.url}\nArtist: ${v.authorUrl}`).join`\n\n`
		if (!txt.length) throw 'Not Found :/'
		if (img) return conn.sendHydrated(m.chat, txt.trim(), null, img.data, res[0].url, 'Source', null, null, [])
		else m.reply(txt.trim())
	} else throw `Send/reply an image with command ${usedPrefix + command}`
}
handler.help = ['sauce']
handler.tags = ['tools']
handler.command = /^(sauce)$/i

export default handler