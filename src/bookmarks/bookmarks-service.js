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
    },
    updateBookmark (knex, id, bookmark) {
        return knex('bookmarks').update(bookmark).where('id',id);
    }
}
module.exports = BookmarksService;