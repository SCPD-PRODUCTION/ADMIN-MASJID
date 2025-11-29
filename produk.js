// =============================
// 🔹 Firebase Import (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// =============================
// 🔹 Firebase Config
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

// =============================
// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================
// 🔹 Menampilkan daftar produk
async function showProductList() {
  const produkList = document.getElementById("produkList");
  produkList.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "produk"));

    if (querySnapshot.empty) {
      produkList.innerHTML = "<p style='color:gray;'>Belum ada produk.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.classList.add("produk-card");

      card.innerHTML = `
        <img src="${data.gambar}" alt="${data.nama}">
        <h3>${data.nama}</h3>
        <p>${data.deskripsi}</p>
        <span class="harga">Rp ${data.harga}</span>
        <a href="https://wa.me/6281234567890" target="_blank" class="btn beli-btn">Beli</a>
      `;
      produkList.appendChild(card);
    });
  } catch (error) {
    produkList.innerHTML = "<p style='color:red;'>Gagal memuat produk.</p>";
    console.error(error);
  }
}

// Jalankan fungsi saat halaman dimuat
showProductList();
