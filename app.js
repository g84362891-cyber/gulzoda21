/**
 * META IT SCHOOL - JAVASCRIPT LOGIKASI
 * Mobil menyu, jonli counter, maska, modal va scrollspy
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTop');
  const statNumbers = document.querySelectorAll('.stat-number');
  const courseButtons = document.querySelectorAll('.course-enroll-btn');
  const courseSelect = document.getElementById('courseSelect');
  const registerForm = document.getElementById('registerForm');
  const phoneInput = document.getElementById('phoneInput');
  const nameInput = document.getElementById('nameInput');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalStudentName = document.getElementById('modalStudentName');
  const modalCourseName = document.getElementById('modalCourseName');
  const modalPhoneNumber = document.getElementById('modalPhoneNumber');

  // 1. Header scroll va Scroll-to-top ko'rinishi
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobil Hamburger menyu
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) toggleMobileMenu();
    });
  });

  // 3. Scrollspy (Faol menyu)
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${id}"]`);
      if (targetLink && scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        targetLink.classList.add('active');
      }
    });
  }, { passive: true });

  // 4. Elementlarning silliq chiqib kelishi (Scroll Reveal)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Jonli hisoblagich (Counter Animation)
  let countersAnimated = false;
  const startCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 2000;
      const startTime = performance.now();
      const easeOutQuad = (t) => t * (2 - t);

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        counter.textContent = Math.floor(easeOutQuad(progress) * target).toLocaleString('en-US');
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target.toLocaleString('en-US');
      };
      requestAnimationFrame(update);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          startCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObs.observe(statsSection);
  }

  // 6. Kurs kartalaridagi "Yozilish" tugmasi
  courseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = btn.getAttribute('data-course');
      if (courseSelect && courseName) {
        for (let i = 0; i < courseSelect.options.length; i++) {
          if (courseSelect.options[i].value.includes(courseName)) {
            courseSelect.selectedIndex = i;
            break;
          }
        }
      }
      const regSec = document.getElementById('register');
      if (regSec) {
        window.scrollTo({
          top: regSec.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth'
        });
        setTimeout(() => { if (nameInput) nameInput.focus(); }, 500);
      }
    });
  });

  // 7. Telefon raqami (+998 formati va maskasi)
  if (phoneInput) {
    if (!phoneInput.value) phoneInput.value = '+998 ';
    phoneInput.addEventListener('input', (e) => {
      let nums = e.target.value.replace(/\D/g, '');
      if (!nums.startsWith('998')) nums = '998' + nums;
      nums = nums.substring(0, 12);

      let formatted = '+998';
      if (nums.length > 3) formatted += ' (' + nums.substring(3, 5);
      if (nums.length >= 5) formatted += ') ';
      if (nums.length > 5) formatted += nums.substring(5, 8);
      if (nums.length >= 8) formatted += '-';
      if (nums.length > 8) formatted += nums.substring(8, 10);
      if (nums.length >= 10) formatted += '-';
      if (nums.length > 10) formatted += nums.substring(10, 12);
      e.target.value = formatted;
    });

    phoneInput.addEventListener('keydown', (e) => {
      if (phoneInput.selectionStart <= 5 && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
      }
    });
  }

  // 8. Forma validatsiyasi va chiroyli bildirishnoma modal
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const course = courseSelect.value;

      if (name.length < 3) {
        alert("Iltimos, to'liq ism va familiyangizni kiriting!");
        nameInput.focus();
        return;
      }
      if (phone.replace(/\D/g, '').length < 12) {
        alert("Iltimos, telefon raqamingizni to'liq kiriting: +998 (__) ___-__-__");
        phoneInput.focus();
        return;
      }
      if (!course) {
        alert("Iltimos, qiziqqan yo'nalishingizni tanlang!");
        courseSelect.focus();
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Yuborilmoqda...';

      setTimeout(() => {
        if (modalStudentName) modalStudentName.textContent = name;
        if (modalCourseName) modalCourseName.textContent = courseSelect.options[courseSelect.selectedIndex].text;
        if (modalPhoneNumber) modalPhoneNumber.textContent = phone;

        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        registerForm.reset();
        phoneInput.value = '+998 ';
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = origText;
      }, 700);
    });
  }

  const closeModal = () => {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  };
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (successModal) successModal.addEventListener('click', (e) => { if (e.target === successModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // 9. Scroll to Top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});