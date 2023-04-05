'use strict';

import Notiflix from 'notiflix';
// import { debounce } from 'lodash';

import { PixabayAPI } from './pixabay-api';
import createGalleryCards from '../templates/gallery-card.hbs';

const searchFormEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const gallaryListEl = document.querySelector('.gallery');

let currentQuery = '';

const pixabayAPI = new PixabayAPI();

const handleSearchFormSubmit = event => {
  event.preventDefault();

  currentQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (!currentQuery) {
    return;
  }

  pixabayAPI.query = currentQuery;

  event.currentTarget.elements.searchQuery.value = '';

  pixabayAPI
    .fetchPhotos()
    .then(data => {
      console.log(data);
      gallaryListEl.innerHTML = createGalleryCards(data.hits);

      if (data.total < pixabayAPI.count) {
        return;
      }

      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });
};

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
