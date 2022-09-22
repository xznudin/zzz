import { extract } from 'zs-extract'
import { lookup } from 'mime-types'

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Input URL'
  if (!args[0].includes('zippyshare.com')) throw 'Invalid URL'
  await m.reply('_In progress, please wait..._')
  for (let i = 0; i < args.length; i++) {
    if (!args[i].includes('zippyshare.com/')) continue
    let res = await extract(args[i])
    let mimetype = await lookup(res.download)
    await conn.sendFile(m.chat, res.download, res.filename, '', m, false, { mimetype, asDocument: true })
  }
}
handler.help = ['zippyshare']
handler.tags = ['downloader']
handler.command = /^z(s|ippy(dl|share)?)$/i 

export default handler