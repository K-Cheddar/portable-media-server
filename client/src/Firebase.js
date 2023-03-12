import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyD8JdTmUVvAhQjBYnt59dOUqucnWiRMyMk',
	authDomain: 'portable-media.firebaseapp.com',
	databaseURL: 'https://portable-media.firebaseio.com',
	projectId: 'portable-media',
	storageBucket: 'portable-media.appspot.com',
	messagingSenderId: '456418139697',
	appId: '1:456418139697:web:02dabb94557dbf1dc07f10'
};

const app = initializeApp(firebaseConfig);
export default getDatabase(app);