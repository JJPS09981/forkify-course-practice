import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) 標記選擇的搜尋結果並更新result View
    resultsView.update(model.getSearchResultsPage());

    // 1) 更新書籤畫面
    bookmarksView.update(model.state.bookmarks);

    // 2) 抓取api
    await model.loadRecipe(id);

    // 3) render畫面
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error('Fetch error →', err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    //render 結果
    resultsView.render(model.getSearchResultsPage(1));
    //render頁數按鈕
    paginationView.render(model.state.search);
  } catch (err) {
    console.error('Fetch error →', err);
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //render 新結果
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render新頁數按鈕
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //更新菜單
  model.updateServings(newServings);
  //更新recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //新增或刪除書籤
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);

  //更新畫面
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    //上傳新的食譜
    await model.uploadRecipe(newRecipe);

    //render食譜
    recipeView.render(model.state.recipe);

    //成功訊息
    addRecipeView.renderMessage();

    //render書籤畫面
    bookmarksView.render(model.state.bookmarks);

    //改變URL的ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    //關閉輸入表單
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandleerSearch(controlSearchResults);
  paginationView.addhandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
