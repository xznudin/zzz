import util from 'util'
import _gis from 'g-i-s'
import fetch from 'node-fetch'
let gis = util.promisify(_gis)
let urlBuffer = 'https://mxmxk.herokuapp.com/buffer?url='

let handler = async (m, { conn, text, usedPrefix: _p, command: cmd }) => {
	text = text.endsWith('SMH') ? text.replace('SMH', '') : text 
	if (!text) throw 'Input Query'
	let query = text.split`|`[0], num = parseInt(text.split`|`[1]) || 1, json = await gis(query)
	if (!json.length) throw `Query "${text}" not found`
	if (num < json.length && num == 1) {
		let img = urlBuffer + json[num - 1].url
		await conn.sendButton(m.chat, `Result From: ${query.capitalize()}`, await shortUrl(img), img, [['Next', `${_p}${cmd} ${query}|${num + 1}`]], m)
	} else if (num < json.length) {
		let img = urlBuffer + json[num - 1].url
		await conn.sendButton(m.chat, `Result From: ${query.capitalize()}`, await shortUrl(img), img, [['Back', `${_p}${cmd} ${query}|${num - 1}`], ['Next', `${_p}${cmd} ${query}|${num + 1}`]], m)
	} else if (num == json.length) {
		let img = urlBuffer + json[num - 1].url
		await conn.sendButton(m.chat, `Result From: ${query.capitalize()}`, await shortUrl(img), img, [['Back', `${_p}${cmd} ${query}|${num - 1}`]], m)
	}
}
handler.help = ['image']
handler.tags = ['general']
handler.command = /^image$/i

export default handler

async function shortUrl(url) {
	return await (await fetch(`https://tinyurl.com/api-create.php?url=${url}`)).text()
}
