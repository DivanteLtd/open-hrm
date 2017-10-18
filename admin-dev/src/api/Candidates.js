import Vue from 'vue'

const Candidates = {
  get (candidateID) {
    return Vue.http.get('lead' + '/' + candidateID)
  },
  getFiltered (options) {
    return Vue.http.get('lead', {params: options})
  },
  addCandidate (data) {
    return Vue.http.post('lead', data)
  },
  deleteCandidate (candidateID) {
    return Vue.http.delete('lead/' + candidateID)
  }
}

export default Candidates
