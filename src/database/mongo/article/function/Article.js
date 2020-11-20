import moment from 'moment'
import _ from 'lodash'

import Article from '../Article'

export async function createArticle({ author, content }) {
    const newArticle = new Article({ author, content, created_time: moment().utc() })
    return newArticle.save()
}

export function editArticle(id, { content }) {
    return Article.findOneAndUpdate(id, { content }, { new: true })
}

export function findOne(id) {
    return Article.findById(id)
}

export async function findArticle({ author }, { after_time, limit = 10 }) {
    const filter = {}

    if (!_.isNil(author)) {
        filter.author = author
    }

    if (!_.isNil(after_time)) {
        filter.created_time = { $lt: moment(after_time) }
    }

    return Article.find(filter, null, { limit, sort:{ created_time: -1 } })
}

export async function deleteArticle(id) {
    return Article.findOneAndDelete(id)
}