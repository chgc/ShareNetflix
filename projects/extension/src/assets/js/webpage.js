console.log('webpagejs loaded');
window.addEventListener(
  'GET_RESULT',
  event => {
    function getTitleInfo(netflix, titleId) {
      let result = {};
      const titleVideo = netflix.falkorCache['videos'][titleId];
      let bgImages = '',
        session = titleVideo['seasonCount'].value || 0,
        numSeasonsLabel = titleVideo['numSeasonsLabel'].value || '',
        episode = titleVideo['episodeCount'].value || 0,
        runtime = titleVideo['runtime'].value || 0,
        releaseYear = titleVideo['releaseYear'].value || 0,
        genres = [];
      const genresCount = Object.values(titleVideo['genres']).filter(item => Array.isArray(item)).length;
      if (titleVideo['BGImages'][480]['webp']) {
        bgImages = titleVideo['BGImages'][480]['webp'][0].url || '';
      }

      for (let i = 0; i < genresCount; ++i) {
        genres.push(+titleVideo['genres'][i][1]);
      }
      if (titleVideo && titleVideo.title) {
        result = {
          id: titleId,
          title: titleVideo.title.value,
          summary: titleVideo.regularSynopsis.value,
          session: session,
          numSeasonsLabel: numSeasonsLabel,
          episode: episode,
          runtime: runtime,
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
    if (window['netflix']) {
      let titleId;
      if (pathName.indexOf('watch') > -1) {
        const videoId = pathName.split('/').pop();
        const watchVideo = window['netflix']['falkorCache']['videos'][videoId];
        if (watchVideo['ancestor']) {
          titleId = watchVideo['ancestor'][1];
        }
      }
      if (pathName.indexOf('title') > -1) {
        titleId = pathName.split('/').pop();
      }
      if (titleId) {
        result = getTitleInfo(window['netflix'], titleId);
      }
    }
    //You can also use dispatchEvent
    window.postMessage({ action: 'GOT_RESULT', payload: result }, '*');
  },
  false
);
