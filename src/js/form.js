const form = document.querySelector("form");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="bi bi-hourglass-split me-2"></i>Mengirim...';

  const data = {
    nama_lengkap_anak: document.getElementById("nama_lengkap_anak").value,
    tanggal_lahir: document.getElementById("tanggal_lahir").value,
    jenis_kelamin: document.getElementById("jenis_kelamin").value,
    nama_orang_tua: document.getElementById("nama_orang_tua").value,
    email: document.getElementById("email").value,
    nomor_telepon: document.getElementById("nomor_telepon").value,
    alamat: document.getElementById("alamat").value,
    informasi_tambahan: document.getElementById("informasi_tambahan").value,
  };

  try {
    // GANTI URL INI!
    const response = await fetch(
      "/kutilang/api/simpan-pendaftaran.php", // URL ke backend PHP Anda
      {
        method: "POST",
        // HAPUS 'mode: "no-cors"'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json(); // Sekarang kita bisa membaca respons dari server

    if (result.status === "success") {
      alert("Formulir berhasil dikirim! Kami akan menghubungi Anda segera.");
      form.reset();
    } else {
      throw new Error(result.message || "Terjadi kesalahan pada server.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Terjadi kesalahan saat mengirim formulir. Silakan coba lagi atau hubungi kami langsung.\n\nDetail: " +
        error.message
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML =
      '<i class="bi bi-send me-2"></i>Kirim Formulir Pendaftaran';
  }
});
