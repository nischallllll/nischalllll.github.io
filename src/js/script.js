'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile (guard in case element missing)
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function (guard)
const testimonialsModalFunc = function () {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// add click event to all modal items (guard)
if (testimonialsItem && testimonialsItem.length && modalImg && modalTitle && modalText) {
  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const titleEl = this.querySelector("[data-testimonials-title]");
      const textEl = this.querySelector("[data-testimonials-text]");

      if (avatar && modalImg) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt || '';
      }
      if (titleEl && modalTitle) modalTitle.innerHTML = titleEl.innerHTML;
      if (textEl && modalText) modalText.innerHTML = textEl.innerHTML;

      testimonialsModalFunc();
    });
  }
}

// add click event to modal close button (guard)
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);



// Initialize filter/select behavior per section (projects, talks)
const sectionsWithFilters = document.querySelectorAll("section.projects, section.talks");

sectionsWithFilters.forEach((section) => {
  const select = section.querySelector("[data-select]");
  const selectItems = section.querySelectorAll("[data-select-item]");
  const selectValue = section.querySelector("[data-selecct-value]");
  const filterBtn = section.querySelectorAll("[data-filter-btn]");
  const filterItems = section.querySelectorAll("[data-filter-item]");

  if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });

    selectItems.forEach((si) => {
      si.addEventListener("click", function () {
        const selectedValue = this.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        applyFilter(selectedValue, filterItems);
      });
    });
  }

  if (filterBtn.length) {
    let lastClickedBtn = filterBtn[0];
    filterBtn.forEach((fb) => {
      fb.addEventListener("click", function () {
        const selectedValue = this.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = this.innerText;
        applyFilter(selectedValue, filterItems);

        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    });
  }

});

const applyFilter = function (selectedValue, items) {
  items.forEach((it) => {
    const itemCategories = it.dataset.category;
    if (selectedValue === "all") {
      it.classList.add("active");
    } else if (itemCategories && itemCategories.includes(selectedValue)) {
      it.classList.add("active");
    } else {
      it.classList.remove("active");
    }
  });
};



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
// only select article elements as pages to avoid matching nav buttons that also carry data-page
const pages = document.querySelectorAll("article[data-page]");

// add event to all nav link
// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const clickedName = (this.getAttribute('data-page') || this.textContent).toLowerCase().trim();

    // Find the target article (page) element by its data-page attribute
    const targetPage = document.querySelector(`article[data-page="${clickedName}"]`);

    if (targetPage) {
      // deactivate all pages then activate the target
      Array.from(pages).forEach((p) => p.classList.remove('active'));
      targetPage.classList.add('active');

      // persist the currently active page so it can be restored on load
      try {
        localStorage.setItem('activePage', clickedName);
      } catch (e) {
        // ignore storage errors (e.g., Safari private mode)
      }
    }

    // update nav link active state
    Array.from(navigationLinks).forEach((nl) => nl.classList.remove('active'));
    this.classList.add('active');

    window.scrollTo(0, 0);
  });
}


// Restore saved active page (if any) on load so navbar keeps state
try {
  const savedPage = (localStorage.getItem('activePage') || '').toLowerCase().trim();
  if (savedPage) {
    const savedArticle = document.querySelector(`article[data-page="${savedPage}"]`);
    const savedNav = Array.from(navigationLinks).find((nl) => {
      return ((nl.getAttribute('data-page') || nl.textContent) || '').toLowerCase().trim() === savedPage;
    });

    if (savedArticle) {
      Array.from(pages).forEach((p) => p.classList.remove('active'));
      savedArticle.classList.add('active');
    }

    if (savedNav) {
      Array.from(navigationLinks).forEach((nl) => nl.classList.remove('active'));
      savedNav.classList.add('active');
    }
  }
} catch (e) {
  // ignore storage read errors
}