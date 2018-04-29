import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

exports.autoLikes = functions.firestore.document('videoDetails/{videoId}/shareBy/{shareId}').onCreate((snapshot, context) => {
  const videoId = context.params.videoId;
  const videoRef = admin.firestore().collection('videos').doc(videoId);

  return videoRef.get().then((doc) => {
    const likes = doc.get('likes') || 0;
    const genres = doc.get('genres');
    const data = {
      likes: likes + 1
    }
    return videoRef.update(data);
  }).catch((err) => console.log(err))

})
