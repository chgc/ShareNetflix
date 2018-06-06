console.log('webpagejs loaded');
window.addEventListener(
  'GET_RESULT',
  event => {
    function getTitleInfo(videoDocument, titleId) {
      let result = {};
      let bgImages = '',
        title = '',
        summary = '',
        duration = '',
        releaseYear = '',
        genres = [];

      const ngImagesElement =
        videoDocument.querySelector('.image-rotator-image') ||
        videoDocument.querySelector('.fullbleed-bg');
      if (ngImagesElement) {
        bgImages = ngImagesElement.style.backgroundImage
          .match(/\((.*?)\)/)[1]
          .replace(/('|")/g, '');
      }

      if (videoDocument.querySelector('.title .logo')) {
        title = videoDocument.querySelector('.title .logo').alt;
      }

      if (videoDocument.querySelector('.title .text')) {
        title = videoDocument.querySelector('.title .text').innerText;
      }

      if (videoDocument.querySelector('.synopsis')) {
        summary = videoDocument.querySelector('.synopsis').innerText;
      }

      if (videoDocument.querySelector('.duration')) {
        duration = videoDocument.querySelector('.duration').innerText;
      }

      if (videoDocument.querySelector('.year')) {
        releaseYear = videoDocument.querySelector('.year').innerText;
      }

      if (videoDocument.querySelector('.genres .list-items')) {
        genres = Array.from(
          videoDocument
            .querySelector('.genres > .list-items')
            .querySelectorAll('a')
        ).map(item => {
          return item.href.split('/').pop();
        });
      }

      if (title) {
        result = {
          id: titleId,
          title: title,
          summary: summary,
          duration: duration,
          releaseYear: releaseYear,
          bgImages: bgImages,
          genres: {}
        };

        genres.forEach(key => {
          result.genres[key] = true;
        });
      }
      return result;
    }

    const pathName = window.location.pathname;
    let result = {};
    let titleId;
    let videoDocument = document.querySelector('.jawBoneFadeInPlaceContainer');
    if (!videoDocument && pathName.indexOf('title') > -1) {
      titleId = pathName.split('/').pop();
      videoDocument = document.querySelector(`[id="${titleId}"]`);
    } else {
      if (videoDocument) {
        titleId = videoDocument.querySelector('.jawBoneContainer').id;
      }
    }
    if (videoDocument) {
      result = getTitleInfo(videoDocument, titleId);
    }
    //You can also use dispatchEvent
    window.postMessage({ action: 'GOT_RESULT', payload: result }, '*');
  },
  false
);
