import { igApi } from 'insta-fetcher'
let ig = new igApi('csrftoken=uvaxSdOw62oUdkG3F3U7CXt3vbwXzIUW; mid=YwTY2wALAAFi1npJCAKbcTOLFrF6; ds_user_id=52715621407; sessionid=52715621407%3ANdv7NzZ6C20zgC%3A9%3AAYfR9MO-uBQkSOXT2ERseCLivZrxUnSqiB4Gy9oP_A; ig_did=7D73A703-8E41-4A34-BFFD-A40AEA756276')

let handler = async (m, { conn, text }) => {
	if (!text) throw 'Input Username'
	text = text.replace(/^@/, '')
	let data = await ig.fetchUser(text)
	let img = data?.['hd_profile_pic_url_info']?.url;
	['id', 'hd_profile_pic_url_info', 'account_type'].forEach(Reflect.deleteProperty.bind(null, data))
	let txt = Object.keys(data).map((v) => `*${v.replace(/[_]/g, ' ').capitalizeV2()}:* ${data[v]}`).join`\n`
	await conn.sendMessage(m.chat, { image: { url: img }, caption: txt.trim() }, { quoted: m })
}
handler.help = ['igstalk']
handler.tags = ['tools']
handler.command = /^igstalk|stalkig$/i

export default handler