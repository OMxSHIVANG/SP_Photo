// Client-side Bootstrap Form Validation
(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
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

// Image Upload Live Preview Helper
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('imageFileInput');
  const imagePreview = document.getElementById('imagePreviewContainer');
  const previewImg = document.getElementById('imagePreview');

  if (fileInput && imagePreview && previewImg) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          imagePreview.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
      }
    });
  }
});