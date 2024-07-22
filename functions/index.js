/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// const authenticate = async (req, res, next) => {
//   if (
//     !req.headers.authorization ||
//     !req.headers.authorization.startsWith("Bearer ")
//   ) {
//     res.status(403).send("Unauthorized");
//     return;
//   }

//   const idToken = req.headers.authorization.split("Bearer ")[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     res.status(403).send("Unauthorized");
//   }
// };

exports.getAllUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // authenticate(req, res, async () => {
    //   if (req.method !== "GET") {
    //     return res.status(405).send("Method Not Allowed");
    //   }
    try {
      const listUsersResult = await admin.auth().listUsers();
      const users = listUsersResult.users
        .filter((user) =>
          user.providerData.some(
            (provider) => provider.providerId == "password"
          )
        )
        .map((user) => ({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          customClaims: user.customClaims,
          disabled: user.disabled,
          metadata: {
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime,
          },
        }));
      res.status(200).json(users);
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).send("Internal Server Error");
    }
    // });
  });
});
