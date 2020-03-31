const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders')
  },
  insertFolder(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('folders')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('folders').select('*').where('id', id).first()
  },
  deleteFolder(knex, id) {
    return knex('folders')
      .where({ id })
      .delete()
  },
  updateFolder(knex, id, newArticleFields) {
    return knex('folders')
      .where({ id })
      .update(newArticleFields)
  },
}

module.exports = FoldersService