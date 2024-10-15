// Importar as funções necessárias do SDK do Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importar o Firestore

// Configuração do seu app Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC1dXBZKlSQ_3k7dpvmLD9K8dSpCmxRSgE',
  authDomain: 'mecanicarffteste.firebaseapp.com',
  projectId: 'mecanicarffteste',
  storageBucket: 'mecanicarffteste.appspot.com',
  messagingSenderId: '1041395128972',
  appId: '1:1041395128972:web:4954beeb0ea95288e8f9a9',
  measurementId: 'G-8Q1Q7WNLGS',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Inicializar o Firestore

export { app, auth, db }; // Exportar a instância do Firestore
