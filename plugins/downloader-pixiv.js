import { URL_REGEX } from '@adiwajshing/baileys'
import { Pixiv } from '@ibaraki-douji/pixivts'
const pixiv = new Pixiv()

let handler = async (m, { conn, args, usedPrefix: _p, command: cmd }) => {
	if (!args[0]) throw 'Input Query / Pixiv Url'
	if (args[0].match(URL_REGEX)) {
		let query = args[0].replace(/\D/g, '')
		if (!/[^/]+\/artworks\/[0-9]+/i.test(args[0])) throw 'Invalid Pixiv Url'
		let res = await pixiv.getIllustByID(query).catch(_ => null)
		if (!res) throw `ID "${query}" Not Exists`
		await m.reply('_In progress, please wait..._')
		for (let x = 0; x < res.urls.length; x++) {
			let caption = x == 0 ? `${res.title}\n\n*By:* ${res.user.name}\n*Tags:* ${res.tags.tags.map(v => v.tag)}` : '',
				buffer = (await pixiv.download(new URL(res.urls[x].original))),
				{ mime } = await conn.getFile(buffer)
			await conn.sendMessage(m.chat, { [mime.split('/')[0]]: buffer, caption, mimetype: mime }, { quoted: m })
		}
	} else {
		let query = args.join` `.split`|`[0], num = parseInt(args.join` `.split`|`[1]) || 1,
			data = await pixiv.getIllustsByTag(query)
		if (!data.length) throw `Tag's "${query}" Not Found`
		if (num < data.length && num == 1) {
			let res = await pixiv.getIllustByID(data[num - 1].id)
			for (let x = 0; x < res.urls.length; x++) {
				let caption = x == 0 ? `${res.title}\n\n*By:* ${res.user.name}\n*Tags:* ${res.tags.tags.map(v => v.tag)}` : '',
					buffer = (await pixiv.download(new URL(res.urls[x].original)))
				await conn.sendButton(m.chat, caption, `Image: ${num}/${data.length}`, buffer, [['Next', `${_p}${cmd} ${query}|${num + 1}`]], m)
			}
		} else if (num < data.length) {
			let res = await pixiv.getIllustByID(data[num - 1].id)
			for (let x = 0; x < res.urls.length; x++) {
				let caption = x == 0 ? `${res.title}\n\n*By:* ${res.user.name}\n*Tags:* ${res.tags.tags.map(v => v.tag)}` : '',
					buffer = (await pixiv.download(new URL(res.urls[x].original)))
				await conn.sendButton(m.chat, caption, `Image: ${num}/${data.length}`, buffer, [['Back', `${_p}${cmd} ${query}|${num - 1}`], ['Next', `${_p}${cmd} ${query}|${num + 1}`]], m)
			}
		} else if (num == data.length) {
			let res = await pixiv.getIllustByID(data[num - 1].id)
			for (let x = 0; x < res.urls.length; x++) {
				let caption = x == 0 ? `${res.title}\n\n*By:* ${res.user.name}\n*Tags:* ${res.tags.tags.map(v => v.tag)}` : '',
					buffer = (await pixiv.download(new URL(res.urls[x].original)))
				await conn.sendButton(m.chat, caption, `Image: ${num}/${data.length}`, buffer, [['Back', `${_p}${cmd} ${query}|${num - 1}`]], m)
			}
		}
	}
}
handler.help = ['pixiv']
handler.tags = ['downloader']
handler.command = /^(pixiv)$/i

export default handler