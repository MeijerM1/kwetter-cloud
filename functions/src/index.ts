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

export const removeFavorite = functions.https.onRequest((request, response) => {

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', request.header('Access-Control-Request-Headers'));
    response.header('Access-Control-Allow-Methods', request.header('Access-Control-Request-Method'));

    console.log(request.method);

    if (request.method === 'OPTIONS') {
        response.send(204);
    } else if (request.method === 'DELETE') {
        const userTweet: UserTweet = new UserTweet();
        userTweet.user = request.body.user;
        userTweet.tweet = request.body.tweet;

        if (!userTweet.isValid()) {
            response.status(400).send('invalid body')
        }

        const query: any = firebase.firestore().collection('favorites').where('user', '==', userTweet.user).where('tweet', '==', userTweet.tweet);

        query.get().then((snapshot: any) => {
            snapshot.docs.forEach((doc: any) => {
                doc.ref.delete()

            });
            response.status(204).send();

        }).catch((err: any) => {
            response.status(400).send(err);
        })

    }
});

export const favorites = functions.https.onRequest((request, response) => {

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', request.header('Access-Control-Request-Headers'));
    response.header('Access-Control-Allow-Methods', request.header('Access-Control-Request-Method'));

    console.log(request.method);

    if (request.method === 'OPTIONS') {
        response.send(204);
    } else if (request.method === 'GET') {
        const user: string = request.query.user;


        if (!user) {
            response.status(400).send('No user specified in query params');
        }

        const query: any = firebase.firestore().collection('favorites').where('user', '==', user);

        query.get()
            .then((snapshot: any) => {
                if (!snapshot.empty) {
                    const tweets: any = [];
                    snapshot.docs.forEach((el: any) => {
                        const userTweet = el.data();
                        tweets.push(userTweet.tweet)
                    });
                    response.status(200).send(tweets);
                } else {
                    response.status(204).send();
                }

            }).catch((err: any) => {
                response.status(400).send(err);
            })
    }
});

