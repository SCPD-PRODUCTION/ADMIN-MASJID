// ==== FIREBASE CONFIG ====
// Ganti dengan konfigurasi asli dari Firebase Console kamu
const firebaseConfig = {
  apiKey: "AIzaSyC5gAbdlbVL3t6oreb_ZZhAUT1YJVTKwPU",
  authDomain: "scpd-production.firebaseapp.com",
  databaseURL: "https://scpd-production-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scpd-production",
  storageBucket: "scpd-production.firebasestorage.app",
  messagingSenderId: "72136560829",
  appId: "1:72136560829:web:1c14d8087f9c3b88ade7d4",
  measurementId: "G-LGXCFVNFTH"
};

// ==== INISIALISASI FIREBASE ====
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ==== LOGIN GOOGLE ====
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log("Login berhasil:", result.user);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Login gagal:", error);
      alert("Login gagal: " + error.message);
    });
}

// ==== CEK STATUS LOGIN (opsional, untuk dashboard.html) ====
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Sudah login:", user.email);
  } else {
    console.log("Belum login");
  }
});
