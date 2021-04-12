import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import firebase from "firebase";
import { RegistrationValidator } from "./validators/RegistrationValidator";

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

const db = admin.firestore();
//get all posts
app.get('/posts', (request, response) => {
    db
    .collection('posts')
    .orderBy('time', 'desc')
    .get()
    .then(data => {
        let posts: {}[]= [];
        data.forEach(doc => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                time: doc.data().time
            })
        })
        return response.json(posts);
    })
    .catch(err => console.error(err));
});

//Add a post
app.post('/posts', (request, response) => {
        const newPost: {} = {
            userHandle : request.body.userHandle,
            body : request.body.body,
            time : new Date().toISOString()
        };
        db
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

//Register a user
app.post('/register', (request, response) => {
  const newUser = {
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      userHandle: request.body.userHandle,
    };

    let registrationValidator: RegistrationValidator = new RegistrationValidator();
    registrationValidator.validateRegistrationDetails(newUser);

    let uid, idToken: string | undefined = "";
    
    //Check if user handle exists before creating
    db.doc(`/users/${newUser.userHandle}`)
      .get()
      .then(doc => {
        if(doc.exists) {
          return response.status(400).json({ userHandle: "this handle is already taken" });
        }
        else if(!registrationValidator.isAcceptable()){
          return response.status(400).json({ registration: registrationValidator.getErrors()});
        } else {
          firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)      
            .then((data) => {
              uid = data.user?.uid;
              const userCredentials = {
                userHandle: newUser.userHandle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId: uid
                //TODO Append token to imageUrl. Work around just add token from image in storage.
              };
              return db.doc(`/users/${newUser.userHandle}`).set(userCredentials);
            }).then(()=>{
              return firebase.auth().currentUser?.getIdToken();
            }).then(token => {
                idToken = token;
            })
            return response.status(201).json({ userHandle: "handle created successfully", token: idToken })
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          return response.status(400).json({ email: "Email is already is use" });
        } else {
          return response.status(500).json({ error: err.code });
        }
      });
});

exports.api = functions.https.onRequest(app);