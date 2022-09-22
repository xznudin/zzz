import axios from 'axios'

let parseResult = data => {
	let arr = []
	for (let x of data) arr.push({
		id: x.id, title: x.title,
		language: x.lang, pages: x.num_pages,
		cover: x.cover?.t?.replace(/a.kontol|b.kontol/, 'c.kontol') || x.cover?.replace(/a.kontol|b.kontol/, 'c.kontol')
	})
	return arr
}

let nhentai = {
	home: (type = 'latest') => new Promise((resolve, reject) => {
		type = { latest: 'all', popular: 'popular' }[type]
		axios.get('https://same.yui.pw/api/v4/home').then((res) => resolve(parseResult(res.data[type]))).catch(reject)
	}),
	search: (query, sort, page) => new Promise((resolve, reject) => {
		axios.get(`https://same.yui.pw/api/v4/search/${query}/${sort}/${page}/`).then((res) => resolve(parseResult(res.data.result))).catch(reject)
	}),
	getDoujin: (id) => new Promise((resolve, reject) => {
		axios.get(`https://same.yui.pw/api/v4/book/${+id}`). then((res) => resolve(res.data)).catch(reject)
	}),
	getRelated: (id) => new Promise((resolve, reject) => {
		axios.get(`https://same.yui.pw/api/v4/book/${+id}/related/`).then((res) => resolve(parseResult(res.data.books))).catch(reject)
	}).catch(reject)
}

export default nhentai