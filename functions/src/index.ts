import * as functions from 'firebase-functions';
import firebase from './Firebase'
import { UserTweet } from './UserTweet';

export const addFavorite = functions.https.onRequest((request, response) => {

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', request.header('Access-Control-Request-Headers'));
    response.header('Access-Control-Allow-Methods', request.header('Access-Control-Request-Method'));

    console.log(request.method);

    if (request.method === 'OPTIONS') {
        response.send(204);
    } else if (request.method === 'POST') {
        const userTweet: UserTweet = new UserTweet();
        userTweet.user = request.body.user;
        userTweet.tweet = request.body.tweet;
    
        if (!userTweet.isValid()) {
            response.status(400).send('invalid body')
        }

        const data = JSON.parse(JSON.stringify(userTweet));

        firebase.firestore().collection('favorites').add(data).then(writeResult => {
            response.status(201).send();
        }).catch(err => {
            response.status(400).send(err);
        });

    }
});
