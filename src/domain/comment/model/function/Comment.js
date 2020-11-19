import moment from 'moment'
import _ from 'lodash'

import Comment from '../Comment'

export async function createComment({ author, article, content }) {
    const newComment = new Comment({ author, article, content, created_time: moment().utc() })
    return newComment.save()
}

export function editComment(id, { content }) {
    return Comment.findOneAndUpdate(id, { content }, { new: true })
}

export function findOne(id) {
    return Comment.findById(id)
}

export async function findComment({ article_id }, { after_time, limit = 10 }) {
    const filter = {}

    if (!_.isNil(article_id)) {
        filter.article = article_id
    }

    if (!_.isNil(after_time)) {
        filter.created_time = { $lt: moment(after_time) }
    }

    return Comment.find(filter, null, { limit, sort:{ created_time: -1 } })
}

export async function deleteCommentById(id) {
    return Comment.findOneAndDelete(id)
}

export async function deleteCommentByArticle(article) {
    return Comment.deleteMany({ article })
}