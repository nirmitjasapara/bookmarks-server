const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const {bookmarks} = require('../store')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body
    if (!title) {
        logger.error(`Title is required`);
        return res
          .status(400)
          .send('Invalid data');
    }
    if (!url) {
        logger.error(`url is required`);
        return res
          .status(400)
          .send('Invalid data');
    }
    if (!rating) {
        logger.error(`rating is required`);
        return res
          .status(400)
          .send('Invalid data');
    }
    const bookmark = { id: uuid(), title, url, description, rating }

    BookmarksService.insertBookmark(req.app.get('db'), bookmark)
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
        .json(bookmark)
      })
      .catch(next)
  })

  bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    BookmarksService.getBookmark(req.app.get('db'), id)
      .then(bookmark => {
        // make sure we found a bookmark
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
            .status(404)
            .send('Bookmark Not Found');
        }
    
        res.json(bookmark);
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    BookmarksService.deleteBookmark(req.app.get('db'), id)
      .then(bookmark => {
        // make sure we found a bookmark
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
            .status(404)
            .send('Bookmark Not Found');
        }
        logger.info(`Bookmark with id ${id} deleted.`);
        res
        .status(204)
        .end();
        res.json(bookmark);
      })
      .catch(next)
  })

module.exports = bookmarksRouter