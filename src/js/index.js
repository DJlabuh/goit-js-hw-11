'use strict';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

const scrollToNewImages = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  const scrollHeight = cardHeight * 2;

  window.scrollBy({
    top: scrollHeight,
    behavior: 'smooth',
  });
};

const fetchPhotos = async () => {
  try {
    const data = await pixabayAPI.fetchPhotos();
    return data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
};

const handleSearchFormSubmit = async event => {
  event.preventDefault();

  currentQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (!currentQuery) {
    return;
  }

  pixabayAPI.query = currentQuery;

  event.currentTarget.elements.searchQuery.value = '';

  try {
    const data = await fetchPhotos();
    if (!data.hits.length) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    gallaryListEl.innerHTML = createGalleryCards(data.hits);

    hideElement(loadMoreBtnEl, data.hits.length, pixabayAPI.count);

    loadMoreBtnEl.classList.remove('is-hidden');

    const lightbox = new SimpleLightbox('.gallery a');

    lightbox.refresh();

    setTimeout(() => {
      scrollToNewImages();
    }, 1000);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
};

const handleLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const data = await fetchPhotos();
    gallaryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    const currentCount =
      gallaryListEl.querySelectorAll('.gallery__item').length;

    hideElement(loadMoreBtnEl, currentCount, data.totalHits);

    if (currentCount === data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    setTimeout(() => {
      scrollToNewImages();
    }, 1000);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
};

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
