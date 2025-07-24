document.addEventListener("DOMContentLoaded", () => {
  class MarqueeController {
    constructor() {
      this.marquees = [];
      this.init();
    }

    init() {
      const marqueeWrappers = document.querySelectorAll(".marquee-wrapper");

      marqueeWrappers.forEach((wrapper) => {
        const marqueeContent = wrapper.querySelector(".marquee-content");

        const marqueeData = {
          wrapper,
          content: marqueeContent,
          isDragging: false,
          startX: 0,
          currentTransform: 0,
          // Menandai apakah user sudah berinteraksi (menggeser)
          hasBeenInteracted: false,
        };

        // Mengambil nilai transform awal dari animasi
        const style = window.getComputedStyle(marqueeContent);
        const matrix = new DOMMatrix(style.transform);
        marqueeData.currentTransform = matrix.m41;

        this.marquees.push(marqueeData);
        this.setupEventListeners(marqueeData);
      });

      this.setupImageModal();
    }

    setupEventListeners(marquee) {
      const startDrag = (e) => {
        // Jika ini interaksi pertama, hentikan animasi secara permanen
        if (!marquee.hasBeenInteracted) {
          // 1. Dapatkan posisi transform saat ini
          const currentStyle = window.getComputedStyle(marquee.content);
          const currentTransformMatrix = new DOMMatrix(currentStyle.transform);
          marquee.currentTransform = currentTransformMatrix.m41;

          // 2. Hapus animasi dari CSS
          marquee.content.style.animation = "none";

          // 3. Terapkan posisi terakhir sebagai style inline agar tidak reset
          marquee.content.style.transform = `translateX(${marquee.currentTransform}px)`;

          marquee.hasBeenInteracted = true;
        }

        marquee.isDragging = true;
        marquee.startX = e.pageX || e.touches[0].pageX;
        marquee.wrapper.style.cursor = "grabbing";
      };

      const duringDrag = (e) => {
        if (!marquee.isDragging) return;
        e.preventDefault();

        const x = e.pageX || e.touches[0].pageX;
        const walk = x - marquee.startX;
        marquee.content.style.transform = `translateX(${
          marquee.currentTransform + walk
        }px)`;
      };

      const endDrag = (e) => {
        if (!marquee.isDragging) return;
        marquee.isDragging = false;
        marquee.wrapper.style.cursor = "grab";

        // Simpan posisi transform terakhir setelah selesai menggeser
        const x = e.pageX || e.changedTouches[0].pageX;
        const walk = x - marquee.startX;
        marquee.currentTransform += walk;
      };

      // Mouse events
      marquee.wrapper.addEventListener("mousedown", startDrag);
      marquee.wrapper.addEventListener("mousemove", duringDrag);
      document.addEventListener("mouseup", endDrag); // Gunakan document agar tidak bug saat mouse keluar wrapper
      marquee.wrapper.addEventListener("mouseleave", (e) => {
        // Jika mouse dilepas di luar area, akhiri juga proses drag
        if (marquee.isDragging) {
          endDrag(e);
        }
      });

      // Touch events
      marquee.wrapper.addEventListener("touchstart", startDrag, {
        passive: true,
      });
      marquee.wrapper.addEventListener("touchmove", duringDrag, {
        passive: false,
      });
      marquee.wrapper.addEventListener("touchend", endDrag);
    }

    setupImageModal() {
      const modal = document.getElementById("imageModal");
      if (!modal) return;

      const modalImg = document.getElementById("modalImage");
      const closeBtn = document.getElementById("modalClose");

      document.querySelectorAll(".marquee-content img").forEach((img) => {
        img.addEventListener("click", (e) => {
          e.stopPropagation();
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

  new MarqueeController();
});
