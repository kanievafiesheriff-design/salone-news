const articles = [
	{
		id: 1,
		title: 'Sierra Leone Government Announces New National Development Initiative',
		slug: 'sierra-leone-government-national-development-initiative',
		category: 'Politics',
		excerpt: 'The government has announced a new national development initiative focused on infrastructure, education, healthcare and economic opportunities.',
		content: 'The Sierra Leone government has announced a new development initiative designed to support infrastructure, education, healthcare and economic growth across the country.',
	},
	{
		id: 2,
		title: 'Sierra Leone Economy Records Positive Growth',
		slug: 'sierra-leone-economy-positive-growth',
		category: 'Business',
		excerpt: 'Economic activity continues to improve as businesses and investors respond to new opportunities across the country.',
		content: 'Businesses and investors are responding to new opportunities as economic activity continues to develop across Sierra Leone.',
	},
]

export function listArticles(request, response) {
	const category = request.query.category?.toLowerCase()
	const result = category
		? articles.filter((article) => article.category.toLowerCase() === category)
		: articles

	response.json(result)
}

export function getArticle(request, response) {
	const article = articles.find((item) => String(item.id) === request.params.id || item.slug === request.params.slug)

	if (!article) {
		return response.status(404).json({ error: 'Article not found' })
	}

	return response.json(article)
}
