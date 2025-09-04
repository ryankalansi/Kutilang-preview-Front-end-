document.addEventListener("DOMContentLoaded", () => {
  class GalleryController {
    constructor() {
      this.initGalleries();
      this.setupImageModal();
    }

    initGalleries() {
      const gallerySections = document.querySelectorAll(".gallery-section");

      gallerySections.forEach((section) => {
        const gallery = {
          track: section.querySelector(".gallery-track"),
          prevButton: section.querySelector(".prev-arrow"),
          nextButton: section.querySelector(".next-arrow"),
          images: section.querySelectorAll(".gallery-track img"),
          currentIndex: 0,
          scrollAmount: 0,
        };

        if (gallery.images.length > 0) {
          const firstImage = gallery.images[0];
          if (firstImage.complete) {
            this.calculateScrollAmount(gallery);
            this.setupEventListeners(gallery);
          } else {
            firstImage.onload = () => {
              this.calculateScrollAmount(gallery);
              this.setupEventListeners(gallery);
            };
          }
        }
      });
    }

    calculateScrollAmount(gallery) {
      const imageStyle = window.getComputedStyle(gallery.images[0]);
      const imageWidth = gallery.images[0].offsetWidth;
      const margin =
        parseFloat(imageStyle.marginLeft) + parseFloat(imageStyle.marginRight);
      gallery.scrollAmount = imageWidth + margin;
      this.updateArrows(gallery);
    }

    setupEventListeners(gallery) {
      gallery.nextButton.addEventListener("click", () => {
        this.move(gallery, "next");
      });

      gallery.prevButton.addEventListener("click", () => {
        this.move(gallery, "prev");
      });
    }

    move(gallery, direction) {
      if (direction === "next") {
        gallery.currentIndex++;
      } else if (direction === "prev") {
        gallery.currentIndex--;
      }

      // *** INI BAGIAN PENTING YANG DIPERBAIKI ***
      const containerWidth = gallery.track.parentElement.offsetWidth;
      const trackWidth = gallery.track.scrollWidth;
      const maxScroll = trackWidth - containerWidth;

      let newTransform = -gallery.currentIndex * gallery.scrollAmount;

      // Jangan biarkan scroll melebihi batas maksimumnya untuk menghindari gap
      if (Math.abs(newTransform) > maxScroll) {
        newTransform = -maxScroll;
      }
      // *** AKHIR DARI PERBAIKAN ***

      gallery.track.style.transform = `translateX(${newTransform}px)`;
      this.updateArrows(gallery);
    }

    updateArrows(gallery) {
      // Tombol 'prev' dinonaktifkan jika di paling awal
      gallery.prevButton.disabled = gallery.currentIndex <= 0;

      // Logika baru untuk menonaktifkan tombol 'next'
      const containerWidth = gallery.track.parentElement.offsetWidth;
      const trackWidth = gallery.track.scrollWidth;
      const maxScroll = trackWidth - containerWidth;

      // Mengambil posisi transform saat ini secara akurat
      const currentTransform = this.getCurrentTransformX(gallery.track);

      // Nonaktifkan tombol 'next' jika sudah mentok atau sangat dekat dengan batas akhir
      gallery.nextButton.disabled = Math.abs(currentTransform) >= maxScroll - 1; // Toleransi 1px
    }

    // Fungsi bantuan untuk mendapatkan nilai translateX dari style transform
    getCurrentTransformX(element) {
      const style = window.getComputedStyle(element);
      const matrix = new DOMMatrix(style.transform);
      return matrix.m41;
    }

    // FUNGSI MODAL (TIDAK BERUBAH)
    setupImageModal() {
      const modal = document.getElementById("imageModal");
      if (!modal) return;

      const modalImg = document.getElementById("modalImage");
      const closeBtn = document.getElementById("modalClose");

      document.querySelectorAll(".gallery-track img").forEach((img) => {
        img.addEventListener("click", () => {
          modal.classList.add("show");
          modalImg.src = img.src;
          modalImg.alt = img.alt;
          document.body.style.overflow = "hidden";
        });
      });

      const closeModal = () => {
        modal.classList.remove("show");
        document.body.style.overflow = "";
      };

      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
          closeModal();
        }
      });
    }
  }

  window.addEventListener("load", () => {
    new GalleryController();
  });
});

// --- Fungsionalitas Audio ---
const audio = document.getElementById("backgroundAudio");
const audioToggleButton = document.getElementById("audioToggle");
let isPlaying = false; // Status awal: tidak memutar

audioToggleButton.addEventListener("click", () => {
  // Balik status setiap kali diklik
  isPlaying = !isPlaying;

  if (isPlaying) {
    // Jika sekarang harusnya memutar
    audio
      .play()
      .then(() => {
        // Berhasil memutar, ganti ikon ke 'volume up'
        audioToggleButton.innerHTML = '<i class="bi bi-volume-up"></i>';
      })
      .catch((error) => {
        // Gagal memutar (karena diblokir browser, dll)
        console.warn("Pemutaran audio diblokir:", error);
        isPlaying = false; // Kembalikan status karena gagal
        audioToggleButton.innerHTML = '<i class="bi bi-volume-mute"></i>';
      });
  } else {
    // Jika sekarang harusnya berhenti
    audio.pause();
    // Ganti ikon kembali ke 'volume mute'
    audioToggleButton.innerHTML = '<i class="bi bi-volume-mute"></i>';
  }
});
