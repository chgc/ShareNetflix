"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.autoLikes = functions.firestore
    .document('videoDetails/{videoId}/shareBy/{shareId}')
    .onCreate((snapshot, context) => {
    const videoId = context.params.videoId;
    const videoRef = admin
        .firestore()
        .collection('videos')
        .doc(videoId);
    return videoRef
        .get()
        .then(doc => {
        const likes = doc.get('likes') || 0;
        const data = {
            likes: likes + 1
        };
        return videoRef.update(data);
    })
        .catch(err => console.log(err));
});
//# sourceMappingURL=index.js.map