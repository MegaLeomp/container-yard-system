import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvDg1-qqhUF3EYzZ492ncTHBUr2blJeBo",
  authDomain: "patio-conteiner.firebaseapp.com",
  projectId: "patio-conteiner",
  storageBucket: "patio-conteiner.appspot.com",
  messagingSenderId: "962825786298",
  appId: "1:962825786298:web:adicionar-app-id-aqui" // Adicione se tiver
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Ouvir containers em tempo real
export const listenToContainers = (callback) => {
  const q = query(collection(db, 'containers'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const containers = [];
    snapshot.forEach((doc) => {
      containers.push({ id: doc.id, ...doc.data() });
    });
    callback(containers);
  });
};

// Adicionar container
export const addContainer = async (containerData) => {
  try {
    const docRef = await addDoc(collection(db, 'containers'), {
      ...containerData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar container:', error);
    throw error;
  }
};

// Remover container
export const removeContainer = async (containerId) => {
  try {
    await deleteDoc(doc(db, 'containers', containerId));
  } catch (error) {
    console.error('Erro ao remover container:', error);
    throw error;
  }
};
