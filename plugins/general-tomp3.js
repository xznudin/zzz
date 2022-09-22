import { toAudio } from '../lib/converter.js'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn, text, usedPrefix, command }) => {
	let regex = /^(?:-|--)doc$/i, q = m.quoted ? m.quoted : m
	let mime = (q || q.msg).mimetype || q.mediaType || ''
	if (!/video|audio/.test(mime)) throw `Reply video/voice note you want to convert to audio/mp3 with command *${usedPrefix}${command}*`
	let media = await q.download()
	if (!media) throw 'Can\'t download media'
	let audio = await toAudio(media, 'mp4')
	if (!audio.data) throw 'Can\'t convert media to audio'
	let type = await fileTypeFromBuffer(audio.data),
		fileName = `Convert Audio (${new Date().toLocaleString('id', { timeZone: 'Asia/Jakarta' })}).${type.ext}`
	await conn.sendMessage(m.chat, { [regex.test(text) ? 'document' : 'audio']: audio.data, mimetype: 'audio/mp4', fileName }, { quoted: m })
}
handler.help = ['tomp3']
handler.tags = ['general']
handler.alias = ['tomp3', 'toaudio']
handler.command = /^to(mp3|audio)$/i

export default handler
