import { createOptimizedPicture, fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders('');
  const { clickhereformore, clickhereforless } = placeholders;
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';

      //  new assignment code
      const paragraphs = div.querySelectorAll('p');
      if (paragraphs.length > 1) {
        const description = paragraphs[1];
        description.style.display = 'none';
        const placeholderLink = document.createElement('a');
        placeholderLink.innerText = clickhereformore || 'click here for more';
        placeholderLink.style.cursor = 'pointer';
        description.before(placeholderLink);
        placeholderLink.addEventListener('click', (e) => {
          e.preventDefault();
          if (description.style.display === 'none') {
            description.style.display = 'block';
            placeholderLink.innerText = clickhereforless || 'click here for less';
          } else {
            description.style.display = 'none';
            placeholderLink.innerText = clickhereformore || 'click here for more';
          }
        });
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
}
