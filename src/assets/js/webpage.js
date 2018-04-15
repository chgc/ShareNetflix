console.log('webpagejs loaded');
window.addEventListener(
  'GET_RESULT',
  event => {
    function getTitleInfo(netflix, titleid) {
      let result = {};
      const titleVideo = netflix.falkorCache['videos'][titleid];
      if (titleVideo && titleVideo.title) {
        result = {
          id: titleid,
          title: titleVideo.title.value,
          summary: titleVideo.regularSynopsis.value
        };
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
