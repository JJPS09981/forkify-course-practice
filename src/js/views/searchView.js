class SearchView {
  _parentElment = document.querySelector('.search');

  getQuery() {
    const query = this._parentElment.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElment.querySelector('.search__field').value = '';
  }

  addHandleerSearch(handler) {
    this._parentElment.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
