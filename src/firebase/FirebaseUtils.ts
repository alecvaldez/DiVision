import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, UploadResult } from "firebase/storage";

export const firebaseEmailSigin = (
  email: string,
  password: string
): Promise<boolean> => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return false;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return true;
    });
};

export const firebaseEmailCreate = (
  email: string,
  password: string
): Promise<boolean> => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      return false;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      return true;
    });
};

export const updateUserProfilePhoto = (file: any): Promise<UploadResult> => {
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  // Create a Storage Ref w/ username
  const storageRef = ref(
    storage,
    user?.uid + "/profilePicture/" + "avatar.jpg"
  );

  // Upload file
  return uploadBytes(storageRef, file);
};

export const getUserProfilePhoto = (): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  const storageRef = ref(
    storage,
    user?.uid + "/profilePicture/" + "avatar.jpg"
  );
  return getDownloadURL(storageRef)
    .then((url) => {
      return url;
    })
    .catch((err) => {
      return "";
    });
};

export const firebaseLogout = (): Promise<void> => {
  const auth = getAuth();
  return auth.signOut();
};
