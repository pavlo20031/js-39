export function renderImages(images) {
  const createMarkup = images.map(
    ({ webformatURL, likes, views, comments, downloads, largeImageURL, description}) => {
      return `<div class="photo-card">

  <img src="${webformatURL}" data-large="${largeImageURL}" alt="${description}" />



  <div class="stats">

    <p class="stats-item">

      <i class="material-icons">thumb_up</i>

      ${likes}

    </p>

    <p class="stats-item">

      <i class="material-icons">visibility</i>

      ${views}

    </p>

    <p class="stats-item">

      <i class="material-icons">comment</i>

      ${comments}

    </p>

    <p class="stats-item">

      <i class="material-icons">cloud_download</i>

      ${downloads}

    </p>

  </div>

</div>`;
    },
    ).join("");
    return createMarkup;
}
