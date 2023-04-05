'use strict';

export class PixabayAPI {
  #API_KEY = '15070975-6aac66cd3fa729614718982a3';
  #BASE_URL = 'https://pixabay.com/api/';

  query = null;
  count = 40;
  page = 1;

  baseSearchParams = {
    key: this.#API_KEY,
    per_page: this.count,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  fetchPhotos() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      ...this.baseSearchParams,
    });

    return fetch(`${this.#BASE_URL}?${searchParams}`).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });
  }
}
