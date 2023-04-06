import axios from 'axios';

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

  async fetchPhotos() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      ...this.baseSearchParams,
    });

    try {
      const response = await axios.get(`${this.#BASE_URL}?${searchParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
