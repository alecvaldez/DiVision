import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDatabase,
  set,
  ref as dbRef,
  get,
  DataSnapshot,
  push,
  update,
  remove,
  onValue,
  off,
} from "firebase/database";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  UploadResult,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Enemy, ProfileData } from "../App";
import { CharacterForm } from "../components/create-character/CreateCharacter";

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

export const updateUserProfile = (data: ProfileData): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  const userObject =
    data.photoUrl !== ""
      ? {
          alias: data.alias,
          descriptor: data.descriptor,
          primaryColor: data.primaryColor,
          theme: data.theme,
          photoUrl: data.photoUrl,
          email: data.email,
        }
      : {
          alias: data.alias,
          descriptor: data.descriptor,
          primaryColor: data.primaryColor,
          theme: data.theme,
          email: data.email,
        };

  return update(dbRef(db, "users/" + user?.uid), userObject);
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

export const getUserProfile = (): Promise<DataSnapshot> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  return get(dbRef(db, "users/" + user?.uid));
};

export const getUserProfileById = (userId: string): Promise<DataSnapshot> => {
  const db = getDatabase();
  const auth = getAuth();
  return get(dbRef(db, "users/" + userId));
};

// export const getUserProfilseById = (userIds: Array<string>): Promise<DataSnapshot> => {
//   const db = getDatabase();
//   const auth = getAuth();
//   return get(dbRef(db, "users/" + userId));
// };


export const getUserGames = (): Promise<DataSnapshot> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  return get(dbRef(db, "users/" + user?.uid + "/games"));
};

export const firebaseLogout = (): Promise<void> => {
  const auth = getAuth();
  return auth.signOut();
};

export const createNewGame = (
  photo: any,
  name: string,
  gameMasterId: string | undefined
): Promise<string> => {
  const db = getDatabase();
  const storage = getStorage();

  const uuid: string = uuidv4();
  const key = uuid.substring(uuid.length - 5).toUpperCase();

  return get(dbRef(db, "games/" + key))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return "error";
      } else if (photo) {
        const storageRef = ref(
          storage,
          "games" + `/${key}/` + "game-picture.jpg"
        );

        uploadBytes(storageRef, photo).then(() => {
          getDownloadURL(storageRef).then((url) => {
            return set(dbRef(db, "games/" + key), {
              name: name,
              imgUrl: url,
              gameMasterId: gameMasterId,
            }).then(() => {
              return key;
            });
          });
        });
      }
      return set(dbRef(db, "games/" + key), {
        name: name,
        imgUrl: "",
        gameMasterId: gameMasterId,
      }).then(() => {
        return key;
      });
    })
    .catch((_err) => {
      return "error";
    });
};

export const addGameToUser = (gameKey: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  return set(dbRef(db, "users/" + user?.uid + "/games/" + gameKey), [gameKey]);
};

export const removeGameFromUser = (gameKey: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  return remove(dbRef(db, "users/" + user?.uid + "/games/" + gameKey));
};

export const getGame = (gameKey: string): Promise<DataSnapshot> => {
  const db = getDatabase();
  return get(dbRef(db, "games/" + gameKey));
};

export const addPlayerToGame = (gameKey: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  return set(dbRef(db, "games/" + gameKey + "/players/" + user?.uid), [user?.uid]);
};

export const removePlayerFromGame = (gameKey: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  get(dbRef(db, "games/" + gameKey + "/selectedPlayer")).then(snapshot => {
    if(snapshot.exists()) {
      if(snapshot.val() === user?.uid) {
        remove(dbRef(db, "games/" + gameKey + "/selectedPlayer"));
      }
    }
  })

  return remove(dbRef(db, "games/" + gameKey + "/players/" + user?.uid));
};

export const addCharacterToGame = (gameKey: string, character: CharacterForm): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  return set(dbRef(db, "games/" + gameKey + "/players/" + user?.uid), character);
};

export const addGameListener = (gameKey: string, callback: (snapshot: DataSnapshot) => void): void => {
  const db = getDatabase();
  const auth = getAuth();

  onValue(dbRef(db, "games/" + gameKey), (snapshot) => {
    callback(snapshot);
  });
};

export const removeGameListener = (gameKey: string): void => {
  const db = getDatabase();
  const auth = getAuth();

  off(dbRef(db, "games/" + gameKey));
};


export const addEnemy = (gameKey: string, enemy: Enemy): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();

  return set(dbRef(db, "games/" + gameKey + "/enemies/" + enemy.name), enemy);
}

export const deleteEnemy = (gameKey: string, enemyName: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();

  return remove(dbRef(db, "games/" + gameKey + "/enemies/" + enemyName));
}

export const setSelectedEnemy  = (gameKey: string, enemyName: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();

  return set(dbRef(db, "games/" + gameKey + "/selectedEnemy"), enemyName);
}

export const setSelectedWeapon  = (gameKey: string, weaponName: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();

  return set(dbRef(db, "games/" + gameKey + "/selectedWeapon"), weaponName);
}


export const setSelectedPlayer  = (gameKey: string, playerId: string): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();

  return set(dbRef(db, "games/" + gameKey + "/selectedPlayer"), playerId);
}

export const setSelectedRoll = (gameKey: string, roll: string | number): Promise<void> => {
  const db = getDatabase();
  const auth = getAuth();

  return set(dbRef(db, "games/" + gameKey + "/selectedRoll"), roll);
}

