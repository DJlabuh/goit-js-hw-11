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

const hideElement = (DOMElem, lengthArray, countImages) => {
  if (lengthArray < countImages) {
    DOMElem.classList.add('is-hidden');
    return;
  }
};

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
      if (!data.hits.length) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      gallaryListEl.innerHTML = createGalleryCards(data.hits);

      hideElement(loadMoreBtnEl, data.hits.length, pixabayAPI.count);

      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure(error.message);
    });
};

const handleLoadMoreBtnClick = () => {
  pixabayAPI.page += 1;

  pixabayAPI
    .fetchPhotos()
    .then(data => {
      gallaryListEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(data.hits)
      );

      hideElement(loadMoreBtnEl, data.hits.length, pixabayAPI.count);
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure(error.message);
    });
};

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
