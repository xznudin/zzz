import axios from 'axios'
import uploadFile from '../lib/uploadFile.js'

let handler = async (m, { conn, args }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (!mime) throw 'No media found'
	let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
	let media = await q.download()
	if (isTele && media?.length < 5242880) {
		let data = await uploadFile(conn, media, args[0] || 'tele')
		m.reply(data)
	} else if (/image|video|audio|sticker|document/.test(mime)) {
		let data = await uploadFile(conn, media, args[0])
		data = await shortUrl(data)
		m.reply(data)
	}
}
handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^tourl|upload$/i

export default handler

export async function shortUrl(url) {
	let form = new URLSearchParams
	form.append('u', url)
	return 'https://' + (await axios.post('https://www.shorturl.at/shortener.php', form)).data.split('<input id="shortenurl" type="text" value="')[1].split('"')[0]
}