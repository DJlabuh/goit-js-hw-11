'use strict';

import { PixabayAPI } from './pixabay-api';
import createGalleryCards from '../templates/gallery-card.hbs';

const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const loadMoreBtnEl = document.querySelector('.load-more');
const gallaryListEl = document.querySelector('.gallery');

const pixabayAPI = new PixabayAPI();

const handleSearchFormSubmit = event => {
  event.preventDefault();

  pixabayAPI.query = searchInputEl.value.trim();

  pixabayAPI.fetchPhotos().then(data => {
    console.log(data.hits);
    gallaryListEl.innerHTML = createGalleryCards(data.hits);

    loadMoreBtnEl.classList.remove('is-hidden');
  });
};

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
