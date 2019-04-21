import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

//let response:{'message': String, 'success': Boolean,'data':any};

export const helloWorld = functions.https.onRequest(async(req, res) => {
    let userData = req.body;
    let response:any={};
     try {
        // create user account
        const userRecord = await admin.auth().createUser({
            email: userData.email,
            emailVerified: false,
            password: userData.pwd,
            displayName: `${userData.lastName} ${userData.firstName}`,
            disabled: false
        });
        console.log('Successfully created new user:', userRecord.uid);

        // remove user secret from json data
        delete userData.secret;

        //create user profile with firestore
        await db.doc(`user/${userRecord.uid}`).set(userData);
        console.log('Successfully Opened new user profile:', userData);


        //prepare response
        response.data = true;
        response.message = 'Account created successfully';
        response.success = true;

        //send responses
        res.send(response);
    } catch (error) {
        console.log('Error creating user account', error);

        //prepare response
        response.data = error;
        response.message = error.message;
        response.success = false;
        res.send(response);
    }
    
       



    
   });