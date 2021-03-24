import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import firebase from "firebase";
const app = express();
admin.initializeApp();

var firebaseConfig = {
    apiKey: "AIzaSyAZOpj_EdJMQwai-nV5teKOnalex2KlB6s",
    authDomain: "temple-10b29.firebaseapp.com",
    projectId: "temple-10b29",
    storageBucket: "temple-10b29.appspot.com",
    messagingSenderId: "338951895685",
    appId: "1:338951895685:web:c40b49ea608f2b754207ec",
    measurementId: "G-CW7Q8PRBR0"
  };

firebase.initializeApp(firebaseConfig);

app.get('/posts', (request, response) => {
    admin
    .firestore()
    .collection('posts')
    .orderBy('time', 'desc')
    .get()
    .then(data => {
        let posts: {}[]= [];
        data.forEach(doc => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                user: doc.data().user,
                time: doc.data().time
            })
        })
        return response.json(posts);
    })
    .catch(err => console.error(err));
});

app.post('/posts', (request, response) => {
        const newPost: {} = {
            user : request.body.user,
            body : request.body.body,
            time : new Date().toISOString()
        };
        admin
        .firestore()
        .collection('posts')
        .add(newPost)
        .then(doc => {
            response.json({message : `document ${doc.id} created successfully`})
        })
    .catch(err => {
        response.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
});

app.post('/register', (request, response) => {
    const newUser = {
        email : request.body.email,
        password : request.body.password,
        confirmPassword : request.body.confirmPassword,
        user : request.body.user,
    };

    firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then( data =>{
        if(data.user !== null){
            return response.status(201).json({message : `user ${ data.user.uid } signed up successfully`})
        }
        else{
            return response.status(500).json({error: "user is null"});
        }
    })
    .catch(err => {
        console.error(err);
        return response.status(500).json({error: err.code});
    })
});

exports.api = functions.https.onRequest(app);