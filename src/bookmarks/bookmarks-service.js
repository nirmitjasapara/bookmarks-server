const BookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks');
    },
    getBookmark(knex, id) {
        return knex.select('*').from('bookmarks').where('id',id).first();
    },
    deleteBookmark(knex, id) {
        return knex.from('bookmarks').where('id',id).delete();
    },
    insertBookmark (knex, bookmark) {
        return knex.into('bookmarks').insert(bookmark)
        .returning('*').then(row => row[0]);
    }
}
module.exports = BookmarksService;