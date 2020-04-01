const express = require('express')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(
      req.app.get('db')
    )
      .then(notes => {
        res.json(notes)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, folderid, content } = req.body
    const newNote = { note_name, folderid, content }
    
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    
    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(`/notes/${note.id}`)
          .json(note)
      })
      .catch(next)
})

notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    const { note_id } = req.params
    NotesService.getById(
      req.app.get('db'),
      note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note // save the note for the next middleware
        next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getById(knexInstance, req.params.note_id)
      .then(note => {
        if(!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.json(note)
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    const { note_id } = req.params
    NotesService.deleteNote(
      req.app.get('db'),
      note_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { note_name, folderid, content } = req.body
    const noteToUpdate = { note_name, folderid, content }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'folder_name', 'folderid', and 'content'`
        }
      })
    }

    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter