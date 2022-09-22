import axios from 'axios'
import cheerio from 'cheerio'
import cp from 'child_process'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text, args }) => {
	if (!text) throw 'Emoji?'
	if (args.length > 1 && args.length === 2) {
		let res = await emojiped(args.slice(1)[0]), data = Object.keys(res)
		if (data.includes(args[0])) {
			let stiker = await (new Sticker(res[args[0]], { type: 'full' })).toMessage()
			await conn.sendMessage(m.chat, stiker, { quoted: m })
		} else {
			let stiker = await (new Sticker(res.whatsapp, { type: 'full' })).toMessage()
			await conn.sendMessage(m.chat, stiker, { quoted: m })
		}
	} else if (text.includes('+')) {
		let [emo, emo2] = text.split`+`
		if (!(emo && emo2)) throw 'Lah...'
		let res = await emojiped(emo), res2 = await emojiped(emo2)
		let path = await conn.getFile(res.whatsapp, true),
			path2 = await conn.getFile(res2.whatsapp, true),
			path3 = './tmp/' + random('.png')
		cp.exec(`convert +append "${path.filename}" "${path2.filename}" "${path3}"`, async (e) => {
			if (e) throw String(e)
			let buffer = await conn.getFile(path3)
			let stiker = await (new Sticker(buffer.data, { type: 'full' })).toMessage()
			await conn.sendMessage(m.chat, stiker, { quoted: m })
		})
	} else {
		let res = await emojiped(args[0])
		let stiker = await (new Sticker(res.whatsapp, { type: 'full' })).toMessage()
		await conn.sendMessage(m.chat, stiker, { quoted: m })
	}
}
handler.help = ['emoji']
handler.tags = ['misc']
handler.command = /^(emoji)$/i

export default handler

function random(str) {
	return `${~~(Math.random() * 1e9)}${str}`
}

export async function emojiped(emoji) {
	let html = await axios.get(`https://emojipedia.org/${encodeURIComponent(emoji)}`)
	let $ = cheerio.load(html.data), result = {}
	$('section.vendor-list').find('div.vendor-container.vendor-rollout-target').each(function (a, b) {
		result[$(b).find('h2').text().toLowerCase().replace(/ /g, '_')] = $(b).find('img').attr('srcset').split(' ')[0]
	})
	return result
}