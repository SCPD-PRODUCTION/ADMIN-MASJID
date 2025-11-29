import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors"; // Tambahan penting biar dashboard bisa akses backend

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // ✅ Izinkan akses dari browser (dashboard admin)
app.use(express.json({ limit: "10mb" })); // Biar bisa upload gambar base64

// Info repo
const GITHUB_REPO = "SCPD-PRODUCTION/MASJID JAMI BAITURRAHMAN";
const FILE_PATH = "data.json";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
const TOKEN = process.env.GITHUB_TOKEN;

// Log setiap request masuk (debug)
app.use((req, res, next) => {
  console.log("📩 Request masuk:", req.method, req.url);
  next();
});

// ✅ Route tes (cek koneksi)
app.get("/", (req, res) => {
  res.send("✅ Server SCPD Admin aktif dan siap menerima produk!");
});

// ✅ Route tambah produk
app.post("/add-product", async (req, res) => {
  try {
    const { judul, deskripsi, harga, foto } = req.body;
    console.log("📦 Data produk diterima:", { judul, deskripsi, harga });

    // Ambil produk lama dari GitHub
    const getRes = await fetch(GITHUB_API, {
      headers: { Authorization: `token ${TOKEN}` },
    });

    const oldData = await getRes.json();

    if (getRes.status !== 200) {
      console.error("❌ Gagal mengambil data lama:", oldData.message);
      return res.status(500).json({ success: false, error: oldData.message });
    }

    let produkList = [];
    let sha = null;

    if (oldData.content) {
      const decoded = Buffer.from(oldData.content, "base64").toString("utf-8");
      produkList = JSON.parse(decoded);
      sha = oldData.sha;
    }

    // Tambah produk baru
    produkList.push({ judul, deskripsi, harga, foto });

    const newContent = Buffer.from(JSON.stringify(produkList, null, 2)).toString("base64");

    // Push ke GitHub
    const updateRes = await fetch(GITHUB_API, {
      method: "PUT",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Tambah produk: ${judul}`,
        content: newContent,
        sha: sha || undefined,
      }),
    });

    const result = await updateRes.json();

    if (!updateRes.ok) {
      console.error("❌ Gagal push ke GitHub:", result.message);
      return res.status(500).json({ success: false, error: result.message });
    }

    console.log("✅ Produk berhasil ditambahkan ke GitHub:", judul);
    res.json({ success: true, commit: result.commit?.sha || "no commit sha" });

  } catch (err) {
    console.error("🔥 Error di server:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Jalankan server
const PORT = 6000;
app.listen(PORT, () => {
  console.log(`🚀 Server SCPD Admin berjalan di http://localhost:${PORT}`);
});
