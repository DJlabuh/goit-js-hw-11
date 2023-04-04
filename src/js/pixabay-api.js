'use strict';

export class PixabayAPI {
  #API_KEY = '15070975-6aac66cd3fa729614718982a3';
  #BASE_URL = 'https://pixabay.com/api/';

  query = null;
  per_page = 40;
  page = 1;

  baseSearchParams = {
    key: this.#API_KEY,
    per_page: this.per_page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  fetchPhotos() {
    const searchParams = new URLSearchParams({
      q: this.query,
      ...this.baseSearchParams,
    });

    return fetch(`${this.#BASE_URL}?${searchParams}`).then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.json();
    });
  }
}
