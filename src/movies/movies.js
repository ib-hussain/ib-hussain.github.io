/* The deployed page reads ../data/films.json. All user-generated text is inserted as text nodes. */
(() => {
  'use strict';
  const grid = document.getElementById('favorites-grid');
  const list = document.getElementById('review-list');
  const filmPages = Object.freeze({
    'about-time': 'data/about-time.html',
    'casablanca': 'data/casablanca.html',
    'frozen-2013': 'data/frozen.html',
    'babylon-2022': 'data/babylon.html'
  });
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  const safePoster = value => typeof value === 'string' &&
    /^data\/[a-z0-9/_-]+\.(?:jpe?g|webp|png)$/i.test(value) ? value : '';
  function linkFor(film, className) {
    const page = filmPages[film.slug];
    const link = make(page ? 'a' : 'div', className);
    if (page) link.href = page;
    return link;
  }
  function poster(film, className) {
    const wrap = make('div', className);
    const fallback = make('span', 'poster-fallback', film.title || 'Film');
    wrap.append(fallback);
    const src = safePoster(film.poster);
    if (src) {
      const image = new Image();
      image.src = src;
      image.alt = `${film.title || 'Film'} poster`;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.onload = () => wrap.classList.add('has-image');
      image.onerror = () => image.remove();
      if (image.complete && image.naturalWidth) wrap.classList.add('has-image');
      wrap.prepend(image);
    }
    return wrap;
  }
  function rating(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < .5 || n > 5) return null;
    const normalized = Math.round(n * 2) / 2;
    const node = make('span', 'stars', '★'.repeat(Math.floor(normalized)) + (normalized % 1 ? '½' : ''));
    node.setAttribute('aria-label', `${normalized} out of 5 stars`);
    return node;
  }
  function dateText(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(date);
  }
  function favoriteCard(film) {
    const article = make('article', 'favorite-card');
    const link = linkFor(film, 'favorite-link');
    link.setAttribute('aria-label', `Read about ${film.title}`);
    link.append(poster(film, 'poster-shell'));
    const title = make('h3', '', film.title);
    if (film.year) title.append(make('span', 'film-year', film.year));
    link.append(title);
    const line = make('div', 'stars-line');
    const stars = rating(film.rating);
    line.append(stars || make('span', 'rating-missing', 'Unrated'));
    const heart=make('span',film.liked === true?'heart':'heart is-outline',film.liked === true?'♥':'♡');
    heart.setAttribute('aria-hidden','true');
    line.append(heart);
    link.append(line);
    if (film.snippet) link.append(make('p', 'review-snippet', film.snippet));
    article.append(link);
    return article;
  }
  function reviewCard(film) {
    const article = make('article', 'review-card');
    const coverLink = linkFor(film, 'review-cover');
    coverLink.append(poster(film, 'poster-shell'));
    const content = make('div', 'review-content');
    const title = make('h3', 'review-title');
    const titleLink = linkFor(film);
    titleLink.textContent = film.title || 'Untitled film';
    title.append(titleLink);
    if (film.year) title.append(make('span', 'film-year', film.year));
    content.append(title);
    const meta = make('div', 'review-meta');
    const stars = rating(film.rating);
    meta.append(stars || make('span', 'rating-missing', 'Unrated'));
    const heart=make('span',film.liked === true?'heart':'heart is-outline',film.liked === true?'♥':'♡');
    heart.setAttribute('aria-hidden','true');
    meta.append(heart);
    const watched = dateText(film.watchedDate);
    if (watched) {
      const time = make('time', '', `Watched ${watched}`);
      time.dateTime = film.watchedDate;
      meta.append(time);
    }
    content.append(meta);
    content.append(make('p', 'review-body', film.review || 'Notes to follow.'));
    if (filmPages[film.slug]) {
      const read = linkFor(film, 'review-link');
      read.textContent = 'Open film page →';
      content.append(read);
    }
    article.append(coverLink, content);
    return article;
  }
  function render(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid film data');
    const profile = data.profile || {};
    const stats = profile.stats || {};
    for (const [id, key] of [['stat-films','films'],['stat-this-year','thisYear'],['stat-following','following'],['stat-followers','followers']]) {
      if (Number.isInteger(stats[key]) && stats[key] >= 0) document.getElementById(id).textContent = stats[key].toLocaleString('en-GB');
    }
    if (profile.name) document.getElementById('profile-title').firstChild.textContent = profile.name;
    if (profile.bio) document.getElementById('profile-bio').textContent = profile.bio;
    grid.replaceChildren(); list.replaceChildren();
    const favorites = Array.isArray(data.favorites) ? data.favorites.filter(film => filmPages[film.slug]).slice(0,4) : [];
    const reviews = Array.isArray(data.reviews) ? data.reviews.slice(0,12) : [];
    if (favorites.length) favorites.forEach(film => grid.append(favoriteCard(film)));
    else grid.append(make('p','empty-note','No favourite films are available yet.'));
    if (reviews.length) reviews.forEach(film => list.append(reviewCard(film)));
    else list.append(make('p','empty-note','The recent diary is temporarily empty.'));
    const refreshed = typeof (data.reviewsUpdatedAt || data.updatedAt) === 'string' ? new Date(data.reviewsUpdatedAt || data.updatedAt) : null;
    const sync = document.getElementById('sync-status');
    if (refreshed && !Number.isNaN(refreshed.getTime())) sync.textContent = 'Updated ' + new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(refreshed);
    else if (data.snapshotAt) sync.textContent = 'Snapshot from ' + (dateText(data.snapshotAt) || data.snapshotAt);
  }
  fetch('../data/films.json', {cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error(`Film data ${response.status}`); return response.json(); })
    .then(render)
    .catch(() => {
      grid.replaceChildren(); list.replaceChildren();
      grid.append(make('p','empty-note','Film data could not load. Open this page through a local HTTP server or GitHub Pages.'));
      list.append(make('p','empty-note','Reviews will appear when local film data is available.'));
      document.getElementById('sync-status').textContent='Film data unavailable';
    });
  const nav=[...document.querySelectorAll('.film-nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      nav.forEach(a=>{if(a.getAttribute('href')==='#'+visible.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
    },{rootMargin:'-15% 0px -70% 0px'});
    ['profile','favorites','reviews'].forEach(id=>observer.observe(document.getElementById(id)));
  }
})();
