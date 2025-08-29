import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const addDocument = async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getDocuments = async () => {
    try {
      const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docs);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [collectionName]);

  return { documents, addDocument, error, getDocuments };
};
