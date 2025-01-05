// Sayfa yüklendiğinde animasyonları başlat
document.addEventListener("DOMContentLoaded", () => {
  // Elementleri seç
  const content = document.querySelector(".content");
  const h1 = document.querySelector("h1");
  const title = document.querySelector(".title");
  const about = document.querySelector(".about");
  const socialLinks = document.querySelector(".social-links");
  const skillIconsContainer = document.querySelector(".skill-icons-container");
  const skillIcons = document.querySelector(".skill-icons");
  const emailIcon = document.querySelector(".email-icon");

  // İkonları küresel olarak yerleştir
  const icons = document.querySelectorAll(".skill-icon");
  const radius = 150; // Kürenin yarıçapını artırdım
  const totalIcons = icons.length;

  // Rastgele başlangıç pozisyonları oluştur
  icons.forEach((icon) => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    icon.dataset.x = x;
    icon.dataset.y = y;
    icon.dataset.z = z;

    icon.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  });

  let frame = 0;
  let sphereRotationX = 0;
  let sphereRotationY = 0;
  let isAutoRotating = true;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let moveSpeed = { x: 0, y: 0 };

  function animate() {
    frame++;

    if (isAutoRotating) {
      // Yumuşak otomatik dönüş
      sphereRotationX += moveSpeed.x;
      sphereRotationY += moveSpeed.y;

      // Hareket hızını yavaşça değiştir
      moveSpeed.x = Math.sin(frame / 200) * 0.2; // Dönüş hızını azalttım
      moveSpeed.y = Math.cos(frame / 200) * 0.2;
    }

    // Her ikonu güncelle
    icons.forEach((icon) => {
      const x = parseFloat(icon.dataset.x);
      const y = parseFloat(icon.dataset.y);
      const z = parseFloat(icon.dataset.z);

      // 3D rotasyon matrisi uygula
      const rotateX = (sphereRotationY * Math.PI) / 180;
      const rotateY = (sphereRotationX * Math.PI) / 180;

      // Yeni pozisyonları hesapla
      const cosX = Math.cos(rotateX);
      const sinX = Math.sin(rotateX);
      const cosY = Math.cos(rotateY);
      const sinY = Math.sin(rotateY);

      // 3D rotasyon
      const newX = x * cosY - z * sinY;
      const newY = y * cosX + (x * sinY + z * cosY) * sinX;
      const newZ = y * -sinX + (x * sinY + z * cosY) * cosX;

      // Z eksenine göre ölçeklendirme ve opaklık
      const scale = Math.max(0.6, (newZ + radius) / (radius * 2)); // Minimum ölçeği artırdım
      const opacity = Math.max(0.4, (newZ + radius) / (radius * 2)); // Minimum opaklığı artırdım

      icon.style.transform = `translate3d(${newX}px, ${newY}px, ${newZ}px) scale(${scale})`;
      icon.style.opacity = opacity;
      icon.style.zIndex = Math.floor(newZ);
    });

    requestAnimationFrame(animate);
  }

  // Fare hareketi
  skillIconsContainer.addEventListener("mousemove", (e) => {
    if (!isAutoRotating) {
      const rect = skillIconsContainer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      moveSpeed.x = (x - lastMouseX) * 1.5; // Hareket hızını azalttım
      moveSpeed.y = (y - lastMouseY) * 1.5;

      sphereRotationX += moveSpeed.x;
      sphereRotationY += moveSpeed.y;

      lastMouseX = x;
      lastMouseY = y;
    }
  });

  // Küreye hover olduğunda yavaşça dur
  skillIconsContainer.addEventListener("mouseenter", () => {
    const slowDown = () => {
      moveSpeed.x *= 0.95;
      moveSpeed.y *= 0.95;

      if (Math.abs(moveSpeed.x) < 0.01 && Math.abs(moveSpeed.y) < 0.01) {
        isAutoRotating = false;
      } else {
        requestAnimationFrame(slowDown);
      }
    };
    slowDown();
  });

  // Küreden çıkıldığında yavaşça başla
  skillIconsContainer.addEventListener("mouseleave", () => {
    const speedUp = () => {
      moveSpeed.x = Math.sin(frame / 150) * 0.3;
      moveSpeed.y = Math.cos(frame / 150) * 0.3;
      isAutoRotating = true;
    };
    setTimeout(speedUp, 300);
  });

  // Sayfa yüklendiğinde animasyonları başlat
  setTimeout(() => {
    content.classList.add("show");
    h1.classList.add("show");
    title.classList.add("show");
    about.classList.add("show");
    socialLinks.classList.add("show");
    skillIconsContainer.classList.add("show");

    // Timeline animasyonu
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, 1000 + index * 200);
    });

    // Animasyonu başlat
    animate();
  }, 100);

  // Email ikonuna tıklama olayı
  emailIcon.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "mailto:your.email@example.com";
  });
});
