import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { lookup } from 'mime-types'
import { URL_REGEX } from '@adiwajshing/baileys'

let handler = async (m, { conn, text, usedPrefix: _p, command: cmd }) => {
	text = text.endsWith('SMH') ? text.replace('SMH', '') : text 
	if (!text) throw 'Input Query / Pinterest Url'
	if (text.match(URL_REGEX)) {
		let res = await pinterest.download(text),
			mime = await lookup(res)
		await conn.sendMessage(m.chat, { [mime.split('/')[0]]: { url: res }, caption: `Succes Download: ${await shortUrl(res)}` }, { quoted: m })
	} else {
		let query = text.split`|`[0], num = parseInt(text.split`|`[1]) || 1, res = await pinterest.search(query)
		if (num < res.length && num == 1) {
			let img = res[num - 1].images.orig.url, mime = await lookup(img)
			await conn.sendButton(m.chat, `Result From: ${query.capitalize()}`, await shortUrl(img), img, [['Next', `${_p}${cmd} ${query}|${num + 1}`]], m)
		} else if (num < res.length) {
			let img = res[num - 1].images.orig.url, mime = await lookup(img)
			await conn.sendButton(m.chat, `Result From: ${query.capitalize()}`, await shortUrl(img), img, [['Back', `${_p}${cmd} ${query}|${num - 1}`], ['Next', `${_p}${cmd} ${query}|${num + 1}`]], m)
		} else if (num == res.length) {
			let img = res[num - 1].images.orig.url, mime = await lookup(img)
			await conn.sendButton(m.chat, `Result From: ${query.capitalize()}`, await shortUrl(img), img, [['Back', `${_p}${cmd} ${query}|${num - 1}`]], m)
		}
	}
}
handler.help = ['pinterest']
handler.tags = ['downloader']
handler.command = /^(pinterest)$/i

export default handler

export const pinterest = {
	download: async url => {
		let res = await fetch('https://www.expertsphp.com/facebook-video-downloader.php', {
			method: 'post',
			body: new URLSearchParams(Object.entries({ url }))
		})
		let $ = cheerio.load(await res.text())
		let data = $('table[class="table table-condensed table-striped table-bordered"]').find('a').attr('href')
		if (!data) throw 'Can\'t download post'
		return data
	},
	search: async query => {
		let res = await fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`)
		let json = await res.json()
		let data = json.resource_response.data.results
		if (!data.length) throw `Query "${query}" not found`
		// return data[~~(Math.random() * (data.length))]?.images?.orig?.url
		return data.filter(v => v.type == 'pin')
	}
}

async function shortUrl(url) {
	return await (await fetch(`https://tinyurl.com/api-create.php?url=${url}`)).text()
}