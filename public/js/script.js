// Bootstrap custom form validation
(() => {
  'use strict';

  // Select all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop through forms and prevent invalid submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
