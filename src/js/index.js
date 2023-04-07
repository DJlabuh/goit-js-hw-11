'use strict';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './pixabay-api';
import createGalleryCards from '../templates/gallery-card.hbs';

const searchFormEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const gallaryListEl = document.querySelector('.gallery');

const scrollCards = 2;
let currentQuery = '';

const pixabayAPI = new PixabayAPI();

const hideElement = (DOMElem, lengthArray, countImages) => {
  if (lengthArray < countImages) {
    DOMElem.classList.add('is-hidden');
    return;
  } else {
    loadMoreBtnEl.classList.remove('is-hidden');
  }
};

const scrollByCards = numCards => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * numCards,
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

    const lightbox = new SimpleLightbox('.gallery a', {
      overlayOpacity: 0.7,
      showCounter: false,
    });

    lightbox.refresh();
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

    const currentCount = document.getElementsByTagName('a').length;

    if (currentCount === data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    setTimeout(() => {
      scrollByCards(scrollCards);
    }, 1500);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
};

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
