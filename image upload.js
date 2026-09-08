const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UNSIGNED_PRESET';

async function uploadImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    // Set custom avatar URL
    currentUser.avatarUrl = data.secure_url;
    
    // Display preview
    const preview = document.getElementById('avatarPreview');
    preview.src = data.secure_url;
    preview.style.display = 'block';
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}