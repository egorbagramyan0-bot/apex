/* ==========================================================================
   DENTAL CLINIC "APEX" (STAPEX) - INTERACTIVE JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Menu
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (burgerBtn) burgerBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) closeMobileMenu();
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // License Lightbox Modal
  const licenseCards = document.querySelectorAll('.license-card');
  const licenseModal = document.getElementById('licenseModal');
  const modalLicenseImg = document.getElementById('modalLicenseImg');
  const closeLicenseModal = document.getElementById('closeLicenseModal');

  licenseCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      if (imgSrc && licenseModal) {
        modalLicenseImg.src = imgSrc;
        licenseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLicenseModal) {
    closeLicenseModal.addEventListener('click', () => {
      licenseModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (licenseModal) {
    licenseModal.addEventListener('click', (e) => {
      if (e.target === licenseModal) {
        licenseModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Licenses Scroll Controls
  const licensesTrack = document.getElementById('licensesTrack');
  const licensesPrevBtn = document.getElementById('licensesPrevBtn');
  const licensesNextBtn = document.getElementById('licensesNextBtn');

  if (licensesTrack && licensesPrevBtn && licensesNextBtn) {
    licensesPrevBtn.addEventListener('click', () => {
      licensesTrack.scrollBy({ left: -310, behavior: 'smooth' });
    });
    licensesNextBtn.addEventListener('click', () => {
      licensesTrack.scrollBy({ left: 310, behavior: 'smooth' });
    });
  }

  // Appointment Modal
  const appointmentModal = document.getElementById('appointmentModal');
  const openAppointmentBtns = document.querySelectorAll('.js-open-appointment');
  const closeAppointmentModal = document.querySelector('.js-close-appointment') || document.getElementById('closeAppointmentModal');

  openAppointmentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceName) {
        const modalSelect = document.getElementById('modalServiceSelect');
        const modalInput = document.getElementById('modalServiceInput');
        if (modalSelect) modalSelect.value = serviceName;
        if (modalInput) modalInput.value = serviceName;
      }
      if (appointmentModal) {
        appointmentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeAppointmentModal) {
    closeAppointmentModal.addEventListener('click', () => {
      if (appointmentModal) appointmentModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (appointmentModal) {
    appointmentModal.addEventListener('click', (e) => {
      if (e.target === appointmentModal) {
        appointmentModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ================= SERVICES CATALOG SEARCH & FILTER (services.html) ================= */
  const serviceSearchInput = document.getElementById('serviceSearch');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const catalogItems = document.querySelectorAll('.catalog-item');
  const visibleCountEl = document.getElementById('visibleCount');
  const emptyStateEl = document.getElementById('emptyCatalogState');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  let activeCategory = 'all';

  function filterCatalog() {
    if (!catalogItems.length) return;

    const searchTerm = serviceSearchInput ? serviceSearchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    if (searchClearBtn) {
      if (searchTerm.length > 0) {
        searchClearBtn.classList.add('visible');
      } else {
        searchClearBtn.classList.remove('visible');
      }
    }

    catalogItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const itemSearchText = (item.getAttribute('data-search') || '' + ' ' + item.textContent).toLowerCase();

      const matchesCategory = (activeCategory === 'all' || itemCategory === activeCategory);
      const matchesSearch = (!searchTerm || itemSearchText.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visibleCount;

    if (emptyStateEl) {
      if (visibleCount === 0) {
        emptyStateEl.style.display = 'block';
      } else {
        emptyStateEl.style.display = 'none';
      }
    }
  }

  if (serviceSearchInput) {
    serviceSearchInput.addEventListener('input', filterCatalog);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      serviceSearchInput.value = '';
      filterCatalog();
      serviceSearchInput.focus();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'all';
      filterCatalog();
    });
  });

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      activeCategory = 'all';
      if (serviceSearchInput) serviceSearchInput.value = '';
      filterPills.forEach(p => {
        if (p.getAttribute('data-category') === 'all') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      filterCatalog();
    });
  }

  // Parse URL query parameter for category (e.g., services.html?category=therapy)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    const targetPill = Array.from(filterPills).find(p => p.getAttribute('data-category') === categoryParam);
    if (targetPill) {
      filterPills.forEach(p => p.classList.remove('active'));
      targetPill.classList.add('active');
      activeCategory = categoryParam;
    }
  }

  // Initial Filter Run
  filterCatalog();


  // Price List Modal & Live Search Filter
  const priceModal = document.getElementById('priceModal');
  const openPriceBtns = document.querySelectorAll('.js-open-price');
  const closePriceModal = document.getElementById('closePriceModal');
  const priceSearchInput = document.getElementById('priceSearchInput');
  const priceTabBtns = document.querySelectorAll('.price-tab-btn');

  openPriceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (priceModal) {
        priceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closePriceModal) {
    closePriceModal.addEventListener('click', () => {
      priceModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (priceModal) {
    priceModal.addEventListener('click', (e) => {
      if (e.target === priceModal) {
        priceModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Price Search Filter
  if (priceSearchInput) {
    priceSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().strip ? e.target.value.toLowerCase().strip() : e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.price-table tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Price Category Tab Filtering
  priceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      priceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      const rows = document.querySelectorAll('.price-table tbody tr');

      rows.forEach(row => {
        const rowCat = row.getAttribute('data-cat');
        if (cat === 'all' || rowCat === cat) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Form Submission Validation & Feedback
  const bookingForms = document.querySelectorAll('.js-booking-form');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        alert('Пожалуйста, заполните Ваше имя и номер телефона.');
        return;
      }

      // Show Toast Notification
      showToast(`Спасибо, ${nameInput.value.trim()}! Ваша заявка успешно отправлена. Мы свяжемся с Вами в ближайшее время.`);

      form.reset();
      if (appointmentModal && appointmentModal.classList.contains('active')) {
        appointmentModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Helper Toast Function
  function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>${msg}</span>
      </div>
    `;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: #272726;
      color: #FFFFFF;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
      z-index: 9999;
      font-size: 0.9rem;
      max-width: 400px;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Smooth Scroll offset adjustment
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
