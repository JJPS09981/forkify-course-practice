import View from './View.js';
import icons from 'url:../../img/icons.svg';
import clockIcon from 'url:../../img/clock.png';
import groupIcon from 'url:../../img/group.png';
import minusIcon from 'url:../../img/minus.png';
import plusIcon from 'url:../../img/plus.png';
import userIcon from 'url:../../img/user.png';

import Fraction from 'fraction.js';
import { state } from '../model.js';

const formatQuantity = function (qty) {
  if (!qty) return '';

  // 先把數字四捨五入到小數點後兩位，避免浮點誤差
  const rounded = Math.round(qty * 100) / 100;

  // 定義一些常見分數對應
  const commonFractions = [
    { val: 0.125, text: '1/8' },
    { val: 0.25, text: '1/4' },
    { val: 0.33, text: '1/3' },
    { val: 0.5, text: '1/2' },
    { val: 0.66, text: '2/3' },
    { val: 0.75, text: '3/4' },
  ];

  // 🎯 找最接近的常見分數（誤差 < 0.02 就視為那個分數）
  for (const f of commonFractions) {
    if (Math.abs(rounded - f.val) < 0.02) return f.text;
  }

  // 🧠 其他數字用 fraction.js 處理
  const frac = new Fraction(rounded).simplify(1e-4);
  return frac.toFraction(true);
};

class RecipeView extends View {
  _parentElment = document.querySelector('.recipe');
  _errMsg = `找不到相關資料，請嘗試其他食譜`;
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElment.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElment.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
          <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
          </figure>
  
          <div class="recipe__details">
            <div class="recipe__info">
              
              <img src="${clockIcon}" class="recipe__info-icon" />
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
              }</span>
              <span class="recipe__info-text">分鐘</span>
            </div>
            <div class="recipe__info">
             
              <img src="${groupIcon}" class="recipe__info-icon" />
              <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
              }</span>
              <span class="recipe__info-text">人份</span>
  
              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings - 1
                }">
                  <img src="${minusIcon}" class="recipe__info-icon" />
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings + 1
                }">        
                  <img src="${plusIcon}" class="recipe__info-icon" />
                </button>
              </div>
            </div>
  
           <div class="recipe__user-generated ${
             this._data.key ? '' : 'hidden'
           }">
          
            <img src="${userIcon}"  />
            </div>
            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
              </svg>
            </button>
          </div>
  
          <div class="recipe__ingredients">
            <h2 class="heading--2">食譜成分</h2>
            <ul class="recipe__ingredient-list">
              ${this._data.ingredients
                .map(this._generateMarkupIngredient)
                .join(' ')}
            </ul>
          </div>
  
          <div class="recipe__directions">
            <h2 class="heading--2">烹煮方式</h2>
            <p class="recipe__directions-text">
              本食譜由
              <span class="recipe__publisher">${
                this._data.publisher
              }</span>. 設計，請直接到下方網站查詢
            </p>
            <a
              class="btn--small recipe__btn"
              href="${this._data.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              &rarr;
            </a>
          </div>`;
  }

  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${formatQuantity(
                ing.quantity
              )}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
  }
}

export default new RecipeView();
