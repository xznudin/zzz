let limit = 50
import axios from 'axios'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import cp from 'child_process'
import { youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper'

let handler = async (m, { conn, args, isPrems, isOwner }) => {
	// let key = 'AIzaSyA2-LY3jRpNm1ycJ_ribbSOvOr99wMQQqA'
	if (ytdl.validateURL(args[0])) {
		let id = await ytdl.getVideoID(args[0]), vid = await yts({ videoId: id })
		let { description: desc, timestamp, views, uploadDate, ago, author: { name }} = vid
		let { thumbnail, audio: _audio, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0])).catch(async _ => await youtubedlv3(args[0]))
		await m.reply('_In progress, please wait..._')
		let limitedSize = (isPrems || isOwner ? 99 : limit) * 1024
		let audio, quality, link, lastError, isLimit //source
		for (let i in _audio) {
			try {
				audio = _audio[i]
				quality = audio.quality
				console.log(audio)
				isLimit = audio.fileSize > limitedSize
				link = await audio.download()
				if (link) break
			} catch (e) {
				audio = link = null
				lastError = e
				continue
			}
		}
		if (!link) throw 'Error: ' + (lastError || 'Can\'t download audio')
		let caption = `*Title:* ${title}\n*Quality:* ${quality}\n*Channel:* ${name}\n*Duration:* ${timestamp}\n`
			+ `*Upload Date:* ${uploadDate}\n*Views:* ${views}${desc ? `\n*Description:*\n${desc}` : ''}`.trim()
		if (args[1] && args[1].includes(':') && args[1].includes('-')) {
			let { data, filename } = await conn.getFile(link, true), path = `./tmp/${random('.mp3')}`, from = toSeconds(args[1].split('-')[0]), to = toSeconds(args[1].split('-')[1])
			cp.exec(`ffmpeg -i "${filename}" -ss ${from} -to ${to} "${path}"`, async (e) => {
				if (e) return m.reply(String(e))
				await conn.sendMessage(m.chat, { [/^(?:-|--)doc$/i.test(args[2]) || isLimit ? 'document' : 'audio']: { url: path }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m }).then(async (msg) => {
					await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: msg })
				})
			})
		} else {
			await conn.sendMessage(m.chat, { [/^(?:-|--)doc$/i.test(args[1]) || isLimit ? 'document' : 'audio']: { url: link }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m }).then(async (msg) => {
				await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: msg })
			})
		}
	} else throw 'Invalid URL'
}

handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.alias = ['yta', 'ytmp3']
handler.command = /^yt(a|mp3)$/i
handler.exp = 0

export default handler

function toSeconds(str) {
	let p = str.split(':'), s = 0, m = 1
	while (p.length > 0) {
		s += m * parseInt(p.pop(), 10)
		m *= 60
	}
	return s
}

function random(ext) {
	return `${~~(Math.random() * 1e9)}${ext}`
}

function convertTime(num) {
	num = num.match(/(\d+)(?=[HMS])/gi) || []
	num = num.map((v) => {
		if (v.length < 2) return '0' + v
		return v
	}).join(':')//.padStart(5, '00:0')
	return num
}

async function shortUrl(url) {
	url = encodeURIComponent(url)
	let res = await axios.get(`https://is.gd/create.php?format=simple&url=${url}`)
	return res.data
}
