import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElment.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!curEl) return;

      const firstChild = newEl.firstChild;

      //更新text
      if (
        !newEl.isEqualNode(curEl) && // 新舊節點不同
        firstChild && // 有第一個 child
        firstChild.nodeType === Node.TEXT_NODE && // 第一個 child 是文字節點
        firstChild.nodeValue.trim() !== '' // 而且不是純空白
      ) {
        curEl.textContent = newEl.textContent;
      }

      //更新屬性
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElment.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}.svg#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errMsg) {
    const markup = `
        <div class="error">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="m48-144 432-720 432 720H48Zm127-72h610L480-724 175-216Zm304.79-48q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM444-384h72v-192h-72v192Zm36-86Z"/></svg>
            </div>
            <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
             <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M612-504q25 0 42.5-17.5T672-564q0-25-17.5-42.5T612-624q-25 0-42.5 17.5T552-564q0 25 17.5 42.5T612-504Zm-264 0q25 0 42.5-17.5T408-564q0-25-17.5-42.5T348-624q-25 0-42.5 17.5T288-564q0 25 17.5 42.5T348-504Zm131.9 240q69.1 0 125.6-39T683-408h-79q-19.92 33.3-52.96 52.65T480-336q-38 0-71.04-19.35Q375.92-374.7 356-408h-79q21 66 77.4 105 56.4 39 125.5 39Zm.38 168Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z"/></svg>
            </div>
            <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markup);
  }
}
