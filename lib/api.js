import fetch from 'isomorphic-unfetch'
export const SITE_NAME = 'techcrunch.com'
export const BASE_URL = `https://${SITE_NAME}/wp-json/wp/v2`
export const POSTS_LIMIT = 4

export const searchPosts = async (keyword, page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/posts?search=${keyword}&page=${page}`)
    const data = await res.json()
    return data
  } catch (err) {
    return console.error(err)
  }
}

export const fetchPosts = async (limit = POSTS_LIMIT, page = 1) => {
  console.log('fetching posts...')
  try {
    const res = await fetch(`${BASE_URL}/posts?per_page=${limit}&page=${page}`)
    const data = await res.json()
    return data
  } catch (err) {
    return console.error(err)
  }
}

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/categories`)
    const data = await res.json()
    return data
  } catch (err) {
    return console.error('failed to fetch categories:', err)
  }
}

export const fetchCategoryBySlug = async slug => {
  const res = await fetch(`${BASE_URL}/categories?slug=${slug}`)
  const data = await res.json()
  return data[0]
}

export const fetchCategoryTitle = async id => {
  try {
    const res = await fetch(`${BASE_URL}/posts?categories=${id}`)
    const data = await res.json()
    return data.title.rendered
  } catch (err) {
    return console.error(err)
  }
}

export const fetchCategoryPosts = async (categoryId, limit = POSTS_LIMIT, page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/posts?categories=${categoryId}&per_page=${limit}&page=${page}`)
    const data = await res.json()
    return data
  } catch (err) {
    return console.error(err)
  }
}

export const fetchAllCategories = async () => {
  const categories = await fetchCategories()

  return Promise.all(categories.map(async category => {
    return {
      info: category,
      posts: await fetchCategoryPosts(category.id)
    }
  }))
}

export const fetchArticle = async (slug) => {
  try {
    const res = await fetch(`${BASE_URL}/posts?slug=${slug}`)
    const data = await res.json()
    return data[0]
  } catch (err) {
    return console.error('fetch article error:', err)
  }
}

export const fetchImage = async (img, SIZE) => {
  const imageSize = (sizes) => {
    if (sizes.medium) {
      return sizes.medium.source_url
    } else if (sizes.large) {
      return sizes.large.source_url
    } else {
      return sizes.full.source_url
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/media/${img}`)
    const data = await res.json()
    const sizes_2 = data.media_details.sizes

    if (!SIZE) {
      return imageSize(sizes_2)
    } else {
      switch (SIZE) {
        case 'medium':
          console.log('medium')
          return sizes_2.medium ? sizes_2.medium.source_url : imageSize(sizes_2)
        case 'large':
          console.log('large')
          return sizes_2.large ? sizes_2.large.source_url : imageSize(sizes_2)
        case 'full':
          console.log('full')
          return sizes_2.full ? sizes_2.full.source_url : imageSize(sizes_2)
      }
    }
  } catch (err) {
    return console.error('unable to fetch img:', img, err)
  }
}
