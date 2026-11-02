/**
 * مركز السرعة - لخدمات السيارات المتكاملة (ميكانيك + غسيل)
 * JavaScript: script.js
 * 
 * Features:
 * 1. Mobile Drawer Navigation toggle and smooth link scrolling.
 * 2. Sticky Header elevation on scroll.
 * 3. Active Navigation ScrollSpy.
 * 4. Interactive Booking Modal with dynamic WhatsApp pre-filled message generation.
 * 5. Floating WhatsApp Button logic and direct pre-filled fallback.
 * 6. Dynamic Year in Footer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Center WhatsApp Phone Number (International format without + or spaces)
  const WHATSAPP_PHONE = '966501234567';

  /* --------------------------------------------------------------------------
     1. Mobile Drawer Navigation
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* --------------------------------------------------------------------------
     2. Sticky Header Elevation on Scroll & ScrollSpy
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header shadow elevation
    if (scrollY > 30) {
      siteHeader.style.boxShadow = '0 6px 20px rgba(13, 43, 78, 0.1)';
    } else {
      siteHeader.style.boxShadow = '0 4px 20px rgba(13, 43, 78, 0.04)';
    }

    // ScrollSpy active link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. Interactive Booking Modal & WhatsApp Pre-filled Message Generator
     -------------------------------------------------------------------------- */
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const clientNameInput = document.getElementById('clientName');
  const carModelInput = document.getElementById('carModel');
  const bookingDateInput = document.getElementById('bookingDate');
  const extraNotesInput = document.getElementById('extraNotes');
  const openModalButtons = document.querySelectorAll('.open-booking-modal');

  function openBookingModal(preselectedService) {
    if (preselectedService && serviceSelect) {
      // Find matching option or closest match
      let optionFound = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.includes(preselectedService) || preselectedService.includes(serviceSelect.options[i].value)) {
          serviceSelect.selectedIndex = i;
          optionFound = true;
          break;
        }
      }
      if (!optionFound) {
        // If not in dropdown directly, default to the closest or first
        serviceSelect.selectedIndex = 1; // Default to popular package
      }
    }

    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (carModelInput) carModelInput.focus();
    }, 150);
  }

  function closeBookingModal() {
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const serviceName = btn.getAttribute('data-service') || '';
      openBookingModal(serviceName);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookingModal && bookingModal.classList.contains('open')) {
        closeBookingModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    }
  });

  /* --------------------------------------------------------------------------
     4. Form Submit -> Format WhatsApp Message & Open
     -------------------------------------------------------------------------- */
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = clientNameInput ? clientNameInput.value.trim() : '';
      const carModel = carModelInput ? carModelInput.value.trim() : 'غير محدد';
      const selectedService = serviceSelect ? serviceSelect.value : 'حجز موعد عام';
      const bookingDate = bookingDateInput ? bookingDateInput.value.trim() : 'في أقرب وقت ممكن';
      const extraNotes = extraNotesInput ? extraNotesInput.value.trim() : '';

      // Construct professional, clean Arabic message
      let message = `مرحباً مركز السرعة ⚡\n`;
      message += `أود حجز موعد لصيانة/غسيل سيارتي بالبيانات التالية:\n\n`;
      if (clientName) {
        message += `👤 الاسم: ${clientName}\n`;
      }
      message += `🚗 نوع وموديل السيارة: ${carModel}\n`;
      message += `🛠️ الخدمة أو الباقة: ${selectedService}\n`;
      message += `📅 الموعد المفضل: ${bookingDate}\n`;
      if (extraNotes) {
        message += `📝 ملاحظات: ${extraNotes}\n`;
      }
      message += `\nأرجو تأكيد الموعد وإفادتي بالتفاصيل. شكراً لكم!`;

      // Generate WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

      // Open WhatsApp in new tab/app
      window.open(whatsappUrl, '_blank');

      // Close modal after opening
      closeBookingModal();
    });
  }

  /* --------------------------------------------------------------------------
     5. Dynamic Current Year in Footer
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     6. Smooth Scroll for internal hash links
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
