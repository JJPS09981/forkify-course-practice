import View from './View.js';
import icons from 'url:../../img/icons.svg';

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
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C" class="recipe__info-icon"><path d="M580-320 444-456.19V-648h72v162l115 115-51 51ZM444-720v-72h72v72h-72Zm276 276v-72h72v72h-72ZM444-168v-72h72v72h-72ZM168-444v-72h72v72h-72ZM480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-630q30-70 82.5-122t122.46-82q69.96-30 149.5-30t149.55 30.24q70 30.24 121.79 82.08 51.78 51.84 81.99 121.92Q864-559.68 864-480q0 79.38-30 149.19T752-208.5Q700-156 629.87-126T480-96Zm.46-72q130.46 0 221-91Q792-350 792-480.46t-90.54-221Q610.92-792 480.46-792 350-792 259-701.46t-91 221Q168-350 259-259t221.46 91ZM480-480Z" /></svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
              }</span>
              <span class="recipe__info-text">分鐘</span>
            </div>
            <div class="recipe__info">
             <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C" class="recipe__info-icon"><path d="M96-192v-92q0-25.78 12.5-47.39T143-366q54-32 114.5-49T384-432q66 0 126.5 17T625-366q22 13 34.5 34.61T672-284v92H96Zm648 0v-92q0-42-19.5-78T672-421q39 8 75.5 21.5T817-366q22 13 34.5 34.67Q864-309.65 864-284v92H744ZM384-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm336-144q0 60-42 102t-102 42q-8 0-15-.5t-15-2.5q25-29 39.5-64.5T600-624q0-41-14.5-76.5T546-765q8-2 15-2.5t15-.5q60 0 102 42t42 102ZM168-264h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14t-99 42q-4.95 2.83-7.98 7.91-3.02 5.09-3.02 12V-264Zm216.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21ZM384-264Zm0-360Z"/></svg>
              <img src=""  />
              <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
              }</span>
              <span class="recipe__info-text">人份</span>
  
              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings - 1
                }">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C" class="recipe__info-icon"><path d="M288-444h384v-72H288v72ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings + 1
                }">        
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C" class="recipe__info-icon"><path d="M444-288h72v-156h156v-72H516v-156h-72v156H288v72h156v156Zm36.28 192Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                </button>
              </div>
            </div>
  
           <div class="recipe__user-generated ${
             this._data.key ? '' : 'hidden'
           }">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M237-285q54-38 115.5-56.5T480-360q66 0 127.5 18.5T723-285q35-41 52-91t17-104q0-129.67-91.23-220.84-91.23-91.16-221-91.16Q350-792 259-700.84 168-609.67 168-480q0 54 17 104t52 91Zm243-123q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm.28 312Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q52 0 100-16.5t90-48.5q-43-27-91-41t-99-14q-51 0-99.5 13.5T290-233q42 32 90 48.5T480-168Zm0-312q30 0 51-21t21-51q0-30-21-51t-51-21q-30 0-51 21t-21 51q0 30 21 51t51 21Zm0-72Zm0 319Z"/></svg> 
            </div>
            <button class="btn--round btn--bookmark">
             ${
               this._data.bookmarked
                 ? `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M480-407q43-39 68.98-64.27 25.98-25.27 40-43.5t18.52-31.73q4.5-13.5 4.5-29.05 0-29.45-21.27-50.95Q569.45-648 540-648q-17.5 0-33.75 6.91Q490-634.19 480-622q-10.32-12.19-26.66-19.09Q437-648 419.55-648q-28.55 0-50.05 21.38-21.5 21.39-21.5 50.99 0 15.63 4 28.63 4 13 18 31t39.88 43.46Q435.76-447.07 480-407ZM240-144v-600q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v600l-240-96-240 96Zm72-107 168-67 168 67v-493H312v493Zm0-493h336-336Z"/></svg>`
                 : `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M240-144v-600q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v600l-240-96-240 96Zm72-107 168-67 168 67v-493H312v493Zm0-493h336-336Z"/></svg>`
             }
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
             <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z"/></svg>
              <div class="recipe__quantity"> ${formatQuantity(
                ing.quantity
              )}</div>
              <div class="recipe__description">
                <span class="recipe__unit"> ${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
  }
}

export default new RecipeView();
