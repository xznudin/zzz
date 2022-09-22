import fetch from 'node-fetch'

let handler = async (m, { text }) => {
	if (!text) throw 'Input Query' 
	let data = await (await fetch(API('violetics', '/api/search/googleit', { query: text }, 'apikey'))).json()
	data = data.result.map((v) => `*${v.title}*\n_${v.link}_\n_${v.snippet}_`).join`\n\n`
	if (!data.length) throw `Query "${text}" Not Found`
	m.reply(data)
}
handler.help = ['google']
handler.tags = ['tools']
handler.command = /^google$/i

export default handler
