import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

//let response:{'message': String, 'success': Boolean,'data':any};

export const signUp = functions.https.onRequest(async(req, res) => {
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

        // remove user password from json data
         delete userData.pwd;
         

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
   

export const getUidFormEmail = functions.https.onRequest(async (req, res) => {
   try {
       const e = await admin.auth().getUserByEmail(req.body.email);
       res.send({uid:e.uid,email:e.email,isVerified:e.emailVerified,photoUrl:e.phoneNumber,metadata:e.metadata});
       console.log(`Search found ${e.uid}`);
   } catch (error) {
       console.log(`Error Occurred: ${error}`);
       res.send(null);
   }
})

