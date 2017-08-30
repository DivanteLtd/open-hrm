import Vue from 'vue'

const Notes = {
  get: function (candidateID) {
    return Vue.http.get('lead' + '/' + candidateID + '/note')
  },
  addNote: function (noteBody, parentID) {
    return Vue.http.post('note', {content: noteBody, parentId: parentID})
  },
  updateNote: function (noteID, noteBody) {
    return Vue.http.put('note' + '/' + noteID, noteBody)
  },
  deleteNote: function (noteID) {
    return Vue.http.delete('note' + '/' + noteID)
  }
}

export default Notes
