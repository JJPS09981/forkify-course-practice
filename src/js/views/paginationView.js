import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElment = document.querySelector('.pagination');

  addhandlerClick(handler) {
    this._parentElment.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkupButtonNext(curPage) {
    return `<button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
            <span> 第 ${curPage + 1}頁</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z"/></svg>
          </button>`;
  }

  _generateMarkupButtonPrev(curPage) {
    return `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="m330-444 201 201-51 51-288-288 288-288 51 51-201 201h438v72H330Z"/></svg>
            <span> 第 ${curPage - 1} 頁</span>
          </button>`;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //第一頁或並且有其他頁
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButtonNext(curPage);
    }

    //最後一頁
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButtonPrev(curPage);
    }
    //其他頁
    if (curPage < numPages) {
      return `
      ${this._generateMarkupButtonNext(
        curPage
      )} ${this._generateMarkupButtonPrev(curPage)}`;
    }
    //第一頁並且沒有其他頁
    return ``;
  }
}

export default new PaginationView();
