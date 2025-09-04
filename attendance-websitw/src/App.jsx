import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// DO NOT MODIFY THE FOLLOWING CONSTANTS
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const __initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userProfilesCollection = `/artifacts/${appId}/users`;
const googleProvider = new GoogleAuthProvider();

const UserRole = {
  Student: 'student',
  Faculty: 'faculty',
  Corporate: 'corporate',
  Unknown: 'unknown'
};

const AuthState = {
  Login: 'login',
  Register: 'register',
  Loading: 'loading',
  Authenticated: 'authenticated',
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRole.Unknown);
  const [authState, setAuthState] = useState(AuthState.Loading);
  const [error, setError] = useState('');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfileRef = doc(db, userProfilesCollection, user.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (userProfileSnap.exists()) {
          const profileData = userProfileSnap.data();
          setRole(profileData.role || UserRole.Unknown);
          setAuthState(AuthState.Authenticated);
        } else {
          // New user, prompt for role
          setAuthState(AuthState.Register);
        }
      } else {
        setAuthState(isRegister ? AuthState.Register : AuthState.Login);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [isRegister]);

  const handleEmailAuth = async (isRegistering) => {
    setError('');
    setAuthState(AuthState.Loading);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
      setAuthState(isRegister ? AuthState.Register : AuthState.Login);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setAuthState(AuthState.Loading);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(`Error: ${e.message}`);
      setAuthState(isRegister ? AuthState.Register : AuthState.Login);
    }
  };

  const handleProfileUpdate = async () => {
    setError('');
    setAuthState(AuthState.Loading);
    const user = auth.currentUser;
    if (user && role !== UserRole.Unknown) {
      const userProfileRef = doc(db, userProfilesCollection, user.uid);
      await setDoc(userProfileRef, { email: user.email, role: role });
      setAuthState(AuthState.Authenticated);
    } else {
      setError('Please select a role.');
      setAuthState(AuthState.Register);
    }
  };

  const renderContent = () => {
    if (!isAuthReady) {
      return (
        <div className="flex items-center justify-center p-6 text-gray-600">
          Loading authentication status...
        </div>
      );
    }

    if (authState === AuthState.Authenticated) {
      const user = auth.currentUser;
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">Signed in as: <span className="font-medium text-blue-600">{user.email}</span></p>
          <p className="text-gray-600">User Role: <span className="font-medium text-purple-600">{role}</span></p>
          <button
            onClick={() => auth.signOut()}
            className="mt-6 px-4 py-2 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      );
    }

    if (authState === AuthState.Register) {
      return (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Role</h2>
          <div className="w-full space-y-3">
            <label className="block">
              <input
                type="radio"
                name="role"
                value={UserRole.Student}
                checked={role === UserRole.Student}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Student
            </label>
            <label className="block">
              <input
                type="radio"
                name="role"
                value={UserRole.Faculty}
                checked={role === UserRole.Faculty}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Faculty
            </label>
            <label className="block">
              <input
                type="radio"
                name="role"
                value={UserRole.Corporate}
                checked={role === UserRole.Corporate}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Corporate
            </label>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <button
            onClick={handleProfileUpdate}
            disabled={role === UserRole.Unknown}
            className={`mt-6 w-full px-4 py-2 text-white rounded-lg shadow-md transition duration-200 ${role === UserRole.Unknown ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            Complete Registration
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleEmailAuth(isRegister)}
          className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          {isRegister ? 'Sign Up' : 'Sign In'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <div className="flex items-center w-full my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-md bg-white text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.21c0-.78-.07-1.54-.2-2.28h-9.28v3.47h5.27c-.22 1.13-.88 2.1-1.82 2.76v2.26h2.9c1.7-.86 2.68-2.67 2.68-4.88z" fill="#4285f4" />
            <path d="M10.28 20.48c2.81 0 5.17-.92 6.89-2.45l-2.9-2.26c-.8.54-1.84.86-3.99.86-3.08 0-5.7-2.07-6.6-4.9h-2.9v2.25c1.19 2.37 3.52 4.09 6.85 4.09z" fill="#34a853" />
            <path d="M3.92 11.66c-.22-.64-.35-1.33-.35-2.04s.13-1.4.35-2.04v-2.25h-2.9c-.83 1.66-1.31 3.53-1.31 5.5s.48 3.84 1.31 5.5l2.9-2.25z" fill="#fbbc05" />
            <path d="M10.28 3.53c1.69 0 3.2.59 4.39 1.72l2.58-2.58C14.73 1.12 12.63.15 10.28.15 6.95.15 4.62 1.87 3.43 4.24l2.9 2.25c.9-2.83 3.52-4.9 6.6-4.9z" fill="#ea4335" />
          </svg>
          {isRegister ? 'Sign up with Google' : 'Sign in with Google'}
        </button>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          {isRegister ? 'Already have an account? Sign In' : 'New here? Create an Account'}
        </button>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          CampusConnect
        </h1>
        {renderContent()}
        {authState === AuthState.Loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
