async function loadPhotos() {
  const response = await fetch('/list-photos');
  const photos = await response.json();
  const container = document.getElementById('photos');
  container.innerHTML = '';
  photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = `/photos/${photo}`;
    container.appendChild(img);
  });
}
loadPhotos();