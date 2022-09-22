import fetch from 'node-fetch'
import { tiktokdlv2, tiktokdlv3 } from '@bochilteam/scraper'

let handler = async (m, { conn, args, usedPrefix }) => {
	if (!args[0]) throw 'Input URL' 
	if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(args[0])) throw 'Invalid URL'
	let url = (await fetch(args[0])).url
	let data = await tiktokdlv3(url)
	let meta = await getInfo(url)
	await m.reply('_In progress, please wait..._')
	let buttons = [{ buttonText: { displayText: 'Audio' }, buttonId: `${usedPrefix}tomp3` }]
	conn.sendMessage(m.chat, { video: { url: data.video.no_watermark }, caption: meta?.description || data?.description || ' ', footer: await shortUrl(data.video.no_watermark) || ' ', buttons }, { quoted: m })
	// conn.sendMessage(m.chat, { video : { url: res.link }, caption: description }, { quoted: m })
}
handler.help = ['tiktok']
handler.tags = ['downloader']
handler.command = /^(tt|tiktok)(dl|nowm)?$/i

export default handler

async function getInfo(url) {
	// url = (await fetch(url)).url
	let id = url.split('?')[0].split('/')
	let res = await (await fetch(`https://www.tiktok.com/node/share/video/${id[3]}/${id[5]}/`)).json().catch(_ => {})
	return res?.seoProps?.metaParams
}

async function shortUrl(url) {
	return await (await fetch(`https://tinyurl.com/api-create.php?url=${url}`)).text()
}