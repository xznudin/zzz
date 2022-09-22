import { Telesticker } from 'xfarr-api'
import { stickerTelegram } from '@bochilteam/scraper'

let handler = async (m, { conn, args, usedPrefix: _p, command: cmd }) => {
	if (args[0] && args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) {
		await m.reply('_In progress, please wait..._')
		let res = await Telesticker(args[0])
		await m.reply(`Sending ${res.length} stickers...`)
		if (m.isGroup && res.length > 30) {
			await m.reply('Number of stickers more than 30, bot will send it in private chat.')
			for (let x of res) await conn.sendMessage(m.sender, { sticker: { url: x.url }})
		} else {
			for (let x of res) await conn.sendMessage(m.chat, { sticker: { url: x.url }})
		}
		m.reply('Done')
	} else if (args[0]) {
		let query = args.join` `.split`|`[0], page = parseInt(args.join` `.split`|`[1]) || 1,
			res = await stickerTelegram(query, page)
		if (!res.length) throw `Query "${query}" not found`
		res = res.map(v => `*${v.title}*\n_${v.link}_`).join`\n\n`
		await conn.sendButton(m.chat, res, `Page: ${page}`, null, /0|1/.test(page) ? [['Next', `${_p + cmd} ${query}|${page + 1}`]] : [['Back', `${_p + cmd} ${query}|${page - 1}`], ['Next', `${_p + cmd} ${query}|${page + 1}`]], m)
	} else throw 'Input Query / Telesticker Url'
}
handler.help = ['telesticker']
handler.tags = ['downloader']
handler.command = /^(telestic?ker|stic?kertele)$/i

export default handler