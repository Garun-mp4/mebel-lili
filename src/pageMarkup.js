export const PAGE_HTML = /* html */ String.raw`

<div id="page">
<a class="skip-link screen-reader-text" href="#content">Перейти к содержимому</a>
<header class="cb-site-header has-dark-logo" role="banner">
<nav aria-label="Основная навигация" class="cb-site-header__nav">
<div class="cb-site-header__logo-wrap">
<a aria-current="page" class="custom-logo-link lili-logo" href="#top" rel="home">
<img alt="Mebel Lili" class="custom-logo" src="/assets/lili-logo.svg"/>
</a>
<a class="cb-site-header__logo--dark lili-logo lili-logo--dark" href="#top">
<img alt="Mebel Lili" class="custom-logo" src="/assets/lili-logo.svg"/>
</a>
</div>
<button aria-controls="cb-primary-menu" aria-expanded="false" aria-label="Открыть меню" class="cb-site-header__burger" data-label-close="Закрыть меню" data-label-open="Открыть меню">
<svg fill="none" height="40" viewBox="0 0 40 40" width="40" xmlns="http://www.w3.org/2000/svg">
<circle cx="14" cy="14" fill="currentColor" r="2">
</circle>
<circle cx="26" cy="14" fill="currentColor" r="2">
</circle>
<circle cx="14" cy="26" fill="currentColor" r="2">
</circle>
<circle cx="26" cy="26" fill="currentColor" r="2">
</circle>
</svg>
</button>
<div class="cb-site-header__menu-wrapper">
<div class="cb-site-header__menu-content">
<ul class="cb-site-header__menu" id="cb-primary-menu">
<li class="menu-item current-menu-item">
<a aria-current="page" href="#top">01 ГЛАВНАЯ</a>
</li>
<li class="menu-item">
<a href="#furniture">02 МЕБЕЛЬ</a>
</li>
<li class="menu-item">
<a href="#reviews">03 ОТЗЫВЫ</a>
</li>
<li class="menu-item">
<a href="#projects">04 ПРОЕКТЫ</a>
</li>
<li class="menu-item">
<a href="#request">05 КОНТАКТЫ</a>
</li>
</ul>
</div>
</div>
</nav>
</header>
<main id="content">
<section id="top" class="cb-block cb-block--hero-frontpage cb-fullbleed--both lili-hero" style="--margin-lg-top:0px;--margin-lg-bottom:100px;--margin-md-top:0px;--margin-md-bottom:50px;--margin-sm-top:0px;--margin-sm-bottom:20px;">
<img class="hero-frontpage__video hero-frontpage__image" src="/assets/kitchen-modern.webp" alt="Интерьер угловой кухни в светлых тонах" fetchpriority="high" width="1672" height="941"/>
<div class="hero-frontpage__content">
<h1 class="hero-frontpage__heading">МЕБЕЛЬ ДЛЯ<br/>ВАШЕГО ПРОСТРАНСТВА</h1>
<p class="hero-frontpage__intro">Кухни, шкафы и корпусная мебель на заказ. Обсудим планировку, материалы и то, как вы хотите пользоваться своим пространством.</p>
<form class="lead-form hero-lead-form" data-form-name="hero" action="/api/leads" method="post">
<div class="form-honeypot" aria-hidden="true">
<label>Ваш сайт<input name="website" tabindex="-1" autocomplete="off"/>
</label>
</div>
<div class="hero-form-fields">
<label>
<span>Имя</span>
<input name="name" maxlength="80" autocomplete="name" placeholder="Как к вам обращаться" required/>
</label>
<label>
<span>Телефон</span>
<input name="phone" type="tel" maxlength="32" inputmode="tel" autocomplete="tel" placeholder="+7 ___ ___-__-__" required/>
</label>
<button class="cb-button cb-btn--primary lead-submit" type="submit">
<span class="cb-button__title">Обсудить проект</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</button>
</div>
<p class="lead-form__status" aria-live="polite" role="status">
</p>
<p class="form-purpose">Оставляя заявку, вы просите связаться с вами по указанному телефону.</p>
</form>
</div>
<div aria-hidden="true" class="hero-frontpage__ticker" style="--ticker-duration:120s">
<div class="hero-frontpage__ticker-track">
<span class="hero-frontpage__ticker-item">КУХНИ</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">ШКАФЫ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">КОРПУСНАЯ МЕБЕЛЬ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">МЕБЕЛЬ НА ЗАКАЗ</span>
<span class="hero-frontpage__ticker-sep">*</span>
<span class="hero-frontpage__ticker-item">САМАРА</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">КУХНИ</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">ШКАФЫ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">КОРПУСНАЯ МЕБЕЛЬ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">МЕБЕЛЬ НА ЗАКАЗ</span>
<span class="hero-frontpage__ticker-sep">*</span>
<span class="hero-frontpage__ticker-item">САМАРА</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">КУХНИ</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">ШКАФЫ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">КОРПУСНАЯ МЕБЕЛЬ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">МЕБЕЛЬ НА ЗАКАЗ</span>
<span class="hero-frontpage__ticker-sep">*</span>
<span class="hero-frontpage__ticker-item">САМАРА</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">КУХНИ</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">ШКАФЫ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">КОРПУСНАЯ МЕБЕЛЬ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">МЕБЕЛЬ НА ЗАКАЗ</span>
<span class="hero-frontpage__ticker-sep">*</span>
<span class="hero-frontpage__ticker-item">САМАРА</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">КУХНИ</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">ШКАФЫ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">КОРПУСНАЯ МЕБЕЛЬ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">МЕБЕЛЬ НА ЗАКАЗ</span>
<span class="hero-frontpage__ticker-sep">*</span>
<span class="hero-frontpage__ticker-item">САМАРА</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">КУХНИ</span>
<span class="hero-frontpage__ticker-sep">×</span>
<span class="hero-frontpage__ticker-item">ШКАФЫ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">КОРПУСНАЯ МЕБЕЛЬ</span>
<span class="hero-frontpage__ticker-sep">→</span>
<span class="hero-frontpage__ticker-item">МЕБЕЛЬ НА ЗАКАЗ</span>
<span class="hero-frontpage__ticker-sep">*</span>
<span class="hero-frontpage__ticker-item">САМАРА</span>
<span class="hero-frontpage__ticker-sep">×</span>
</div>
</div>
</section>

<section class="cb-block cb-block--statement-text cb-halfbleed--right" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:50px;--margin-md-bottom:50px;--margin-sm-top:20px;--margin-sm-bottom:20px;">
<div class="separator" aria-hidden="true">
<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="#17181A">
</path>
</svg>
<hr/>
<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="#17181A">
</path>
</svg>
</div>
<header class="statement-text__text">
<p>Мы создаём <strong>мебель</strong> вокруг <strong>вашего пространства</strong>: учитываем размеры, хранение, привычки и визуальный ритм интерьера. Задача — получить <strong>цельное решение</strong>, которым удобно пользоваться каждый день.</p>
</header>
<div class="kpi-gallery__wrapper">
<div class="kpi-gallery__content">
<div class="kpi-gallery__card">
<svg class="top left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="top right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<div class="kpi-gallery__card-content">
<p class="kpi__name">4.3</p>
<p class="kpi__label">рейтинг на Яндекс Картах</p>
</div>
</div>
<div class="kpi-gallery__card">
<svg class="top left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="top right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<div class="kpi-gallery__card-content">
<p class="kpi__name">11</p>
<p class="kpi__label">оценок в карточке</p>
</div>
</div>
<div class="kpi-gallery__card">
<svg class="top left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="top right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<div class="kpi-gallery__card-content">
<p class="kpi__name">5</p>
<p class="kpi__label">опубликованных отзывов</p>
</div>
</div>
<div class="kpi-gallery__card">
<svg class="top left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="top right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom left" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<svg class="bottom right" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9951 0V24M24 11.995L0 11.995" stroke="var(--neutral-600)">
</path>
</svg>
<div class="kpi-gallery__card-content">
<p class="kpi__name">79</p>
<p class="kpi__label">фотографий в карточке</p>
</div>
</div>
</div>
<p class="data-source-note">По данным карточки Mebel Lili на Яндекс Картах.</p>
</div>
</section>

<section class="cb-block cb-block--text-animation lili-process" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:50px;--margin-md-bottom:50px;--margin-sm-top:70px;--margin-sm-bottom:20px;">
<div class="text-animation__content">
<div class="text-animation__sticky">
<p class="text-animation__subline">ПОДХОД</p>
<h2 class="text-animation__heading">ОТ ЗАДАЧИ.<br/>К ТОЧНОМУ РЕШЕНИЮ.</h2>
<div class="text-animation__reveal">
<div class="text-animation__text-item">
<div class="text-animation__text">
<p>Начинаем с пространства и того, как вы хотите им пользоваться.</p>
</div>
</div>
<div class="text-animation__text-item">
<div class="text-animation__text">
<p>Уточняем размеры, обсуждаем материалы и компоновку, чтобы мебель не спорила с интерьером, а становилась его частью.</p>
</div>
</div>
<div class="text-animation__text-item">
<div class="text-animation__text">
<p>Если у вас уже есть эскиз или фотографии помещения, возьмите их за отправную точку обсуждения.</p>
</div>
</div>
<div class="text-animation__text-item">
<div class="text-animation__text">
<p>КУХНИ × ШКАФЫ → КОРПУСНАЯ МЕБЕЛЬ * ИНДИВИДУАЛЬНЫЕ РЕШЕНИЯ</p>
</div>
</div>
<a class="cb-button cb-btn--primary" href="#furniture">
<span class="cb-button__title">Посмотреть направления</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</a>
</div>
</div>
</div>
<div class="text-animation__container lili-process__visual">
<img src="/assets/yandex-hallway.webp" alt="Шкаф в прихожей — фото к отзыву ринатты р. в Яндекс" loading="lazy" width="576" height="1024"/>
</div>
</section>

<section id="furniture" class="cb-block cb-block--business-areas cb-fullbleed--both business-areas--snap" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:50px;--margin-md-bottom:50px;--margin-sm-top:20px;--margin-sm-bottom:20px;">
<div class="business-areas__sticky">
<div class="business-areas__grid">
<article class="business-areas__card" style="--card-bg:#E8EBEB;--card-color:var(--neutral-600);--card-color-inverse:var(--neutral-100);">
<div class="business-areas__card-left">
<span class="business-areas__number">01</span>
<div class="business-areas__card-info">
<div class="business-areas__card-header">
<h3 class="business-areas__title">Кухни</h3>
<ul class="business-areas__labels">
<li class="business-areas__label">планировка</li>
<li class="business-areas__label">хранение</li>
<li class="business-areas__label">рабочая зона</li>
</ul>
</div>
<div class="business-areas__card-content">
<p class="business-areas__excerpt">Кухня начинается не с фасада, а с вашего пространства. Продумываем расположение модулей и хранение так, чтобы мебель была удобной в ежедневном использовании.</p>
<a class="cb-button business-areas__btn" data-project="Кухня" href="#request">
<span class="cb-button__title">Обсудить кухню</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</a>
</div>
</div>
</div>
<div class="business-areas__card-right">
<div class="business-areas__image-wrap">
<img src="/assets/yandex-main-kitchen.webp" alt="Кухни Mebel Lili" loading="lazy" width="707" height="1024"/>
</div>
</div>
</article>
<article class="business-areas__card" style="--card-bg:#9eabad;--card-color:var(--neutral-600);--card-color-inverse:var(--neutral-100);">
<div class="business-areas__card-left">
<span class="business-areas__number">02</span>
<div class="business-areas__card-info">
<div class="business-areas__card-header">
<h3 class="business-areas__title">Шкафы</h3>
<ul class="business-areas__labels">
<li class="business-areas__label">прихожая</li>
<li class="business-areas__label">спальня</li>
<li class="business-areas__label">системы хранения</li>
</ul>
</div>
<div class="business-areas__card-content">
<p class="business-areas__excerpt">Шкафы и встроенные решения под конкретную нишу, стену или комнату. Поможем подобрать компоновку и материалы под интерьер и задачи хранения.</p>
<a class="cb-button business-areas__btn" data-project="Шкаф" href="#request">
<span class="cb-button__title">Обсудить шкафы</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</a>
</div>
</div>
</div>
<div class="business-areas__card-right">
<div class="business-areas__image-wrap">
<img src="/assets/yandex-wardrobe.webp" alt="Шкафы Mebel Lili" loading="lazy" width="768" height="1024"/>
</div>
</div>
</article>
<article class="business-areas__card" style="--card-bg:#697172;--card-color:var(--neutral-100);--card-color-inverse:var(--neutral-600);">
<div class="business-areas__card-left">
<span class="business-areas__number">03</span>
<div class="business-areas__card-info">
<div class="business-areas__card-header">
<h3 class="business-areas__title">Корпусная мебель</h3>
<ul class="business-areas__labels">
<li class="business-areas__label">тумбы</li>
<li class="business-areas__label">модули</li>
<li class="business-areas__label">хранение</li>
</ul>
</div>
<div class="business-areas__card-content">
<p class="business-areas__excerpt">Тумбы, модули и другие корпусные решения, которые связывают интерьер в единую систему и используют доступное пространство без случайных элементов.</p>
<a class="cb-button business-areas__btn" data-project="Корпусная мебель" href="#request">
<span class="cb-button__title">Обсудить корпусную мебель</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</a>
</div>
</div>
</div>
<div class="business-areas__card-right">
<div class="business-areas__image-wrap">
<img src="/assets/yandex-vanity.webp" alt="Корпусная мебель Mebel Lili" loading="lazy" width="768" height="1024"/>
</div>
</div>
</article>
<article class="business-areas__card" style="--card-bg:#4a4f52;--card-color:var(--neutral-100);--card-color-inverse:var(--neutral-600);">
<div class="business-areas__card-left">
<span class="business-areas__number">04</span>
<div class="business-areas__card-info">
<div class="business-areas__card-header">
<h3 class="business-areas__title">Мебель на заказ</h3>
<ul class="business-areas__labels">
<li class="business-areas__label">индивидуальные размеры</li>
<li class="business-areas__label">под интерьер</li>
<li class="business-areas__label">нестандартные задачи</li>
</ul>
</div>
<div class="business-areas__card-content">
<p class="business-areas__excerpt">Когда типовое решение не подходит по размерам или задумке, мебель можно адаптировать под конкретную планировку и сценарий использования.</p>
<a class="cb-button business-areas__btn" data-project="Другая мебель на заказ" href="#request">
<span class="cb-button__title">Обсудить мебель на заказ</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</a>
</div>
</div>
</div>
<div class="business-areas__card-right">
<div class="business-areas__image-wrap">
<img src="/assets/yandex-storage.webp" alt="Мебель на заказ Mebel Lili" loading="lazy" width="768" height="1024"/>
</div>
</div>
</article>
<article class="business-areas__card" style="--card-bg:#212529;--card-color:var(--neutral-100);--card-color-inverse:var(--neutral-600);">
<div class="business-areas__card-left">
<span class="business-areas__number">05</span>
<div class="business-areas__card-info">
<div class="business-areas__card-header">
<h3 class="business-areas__title">Стеклянная мебель</h3>
<ul class="business-areas__labels">
<li class="business-areas__label">витрины</li>
<li class="business-areas__label">фасады</li>
<li class="business-areas__label">комбинированные решения</li>
</ul>
</div>
<div class="business-areas__card-content">
<p class="business-areas__excerpt">Стекло помогает сделать массивную мебель визуально легче и подходит для витрин, фасадов и комбинированных интерьерных решений.</p>
<a class="cb-button business-areas__btn" data-project="Стеклянная мебель" href="#request">
<span class="cb-button__title">Обсудить стеклянную мебель</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</a>
</div>
</div>
</div>
<div class="business-areas__card-right">
<div class="business-areas__image-wrap">
<img src="/assets/yandex-main-kitchen.webp" alt="Стеклянные витрины в кухне — главное фото карточки Mebel Lili" loading="lazy" width="707" height="1024"/>
</div>
</div>
</article>
</div>
</div>
</section>

<section id="reviews" class="cb-block cb-block--logo-gallery reviews-band" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:50px;--margin-md-bottom:50px;--margin-sm-top:20px;--margin-sm-bottom:20px;">
<header class="logo-gallery__header">
<p class="logo-gallery__heading">КЛИЕНТЫ О MEBEL LILI</p>
<div class="logo-gallery__separator">
</div>
<p class="reviews-band__rating">4.3 / 5 · Яндекс Карты</p>
</header>
<div class="logo-gallery__grid reviews-grid">
<article class="review-card">
<blockquote class="review-card__quote">Заказывали шкаф в прихожей. Выполнили все быстро и качественно. Клиентоориентированный подход, приятное общение. Подробно рассказали про материалы, помогли с выбором. Рекомендуем!</blockquote>
<div class="review-card__meta">
<span>ринатта р.</span>
<span>22 декабря 2025</span>
</div>
</article>
<article class="review-card">
<blockquote class="review-card__quote">Парни красавчики, все сделали быстро, качественно и аккуратно!</blockquote>
<div class="review-card__meta">
<span>Сергей Ульянов</span>
<span>24 января</span>
</div>
</article>
<article class="review-card">
<blockquote class="review-card__quote">Заказал кухню, приехали, замеряли и в указанный срок все качественно сделали. Доволен и всем советую!</blockquote>
<div class="review-card__meta">
<span>Максим Личардин</span>
<span>3 сентября 2018</span>
</div>
</article>
<article class="review-card">
<blockquote class="review-card__quote">Всё отлично 👍</blockquote>
<div class="review-card__meta">
<span>Сергей Сергеев</span>
<span>28 апреля</span>
</div>
</article>
<article class="review-card">
<blockquote class="review-card__quote">Все было отлично . Все сделали быстро в срок , респект</blockquote>
<div class="review-card__meta">
<span>Александр</span>
<span>17 января 2025</span>
</div>
</article>
</div>
<p class="reviews-source">Снимок Яндекс от 03.10.2026 · <a href="https://yandex.com/maps/org/mebel_lili/1806470657/reviews/" target="_blank" rel="noopener noreferrer">Читать отзывы на Яндекс Картах ↗</a>
</p>
</section>

<section class="cb-block cb-block--newsletter cb-fullbleed--both lili-mid-lead" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:50px;--margin-md-bottom:50px;--margin-sm-top:20px;--margin-sm-bottom:20px;">
<div class="newsletter__content">
<h2 class="newsletter__heading">НАЧНИТЕ С ПАРЫ ФОТО И РАЗМЕРОВ</h2>
<p class="newsletter__subline">Предварительно обсудим задачу до встречи</p>
<div class="newsletter__text">
<p>Оставьте номер и выберите, что планируете. Подготовьте фотографии помещения и примерные размеры. После заявки договоримся, как передать материалы и какие детали уточнить.</p>
</div>
</div>
<div class="newsletter__form">
<form class="lead-form mid-lead-form" data-form-name="mid" action="/api/leads" method="post">
<div class="form-honeypot" aria-hidden="true">
<label>Ваш сайт<input name="website" tabindex="-1" autocomplete="off"/>
</label>
</div>
<label>
<span>Ваше имя</span>
<input name="name" maxlength="80" autocomplete="name" placeholder="Имя" required/>
</label>
<label>
<span>Телефон</span>
<input name="phone" type="tel" maxlength="32" inputmode="tel" autocomplete="tel" placeholder="+7 ___ ___-__-__" required/>
</label>
<label>
<span>Что планируете</span>
<select name="project" required>
<option value="" selected disabled>Выберите вариант</option>
<option>Кухня</option>
<option>Шкаф</option>
<option>Корпусная мебель</option>
<option>Другая мебель на заказ</option>
<option>Стеклянная мебель</option>
</select>
</label>
<button class="mid-lead-submit" type="submit">
<span>Получить консультацию</span>
<span aria-hidden="true">→</span>
</button>
<p class="lead-form__status" aria-live="polite" role="status">
</p>
<p class="form-purpose">Оставляя заявку, вы просите связаться с вами по указанному телефону.</p>
</form>
</div>
</section>

<section id="projects" class="cb-block cb-block--post-gallery cb-fullbleed--both lili-projects" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:50px;--margin-md-bottom:50px;--margin-sm-top:20px;--margin-sm-bottom:20px;">
<div class="inner">
<div class="post-gallery__headerline">
<h2 class="post-gallery__heading">ПРОЕКТЫ И ДЕТАЛИ</h2>
<div class="gallery-controls">
<button type="button" data-gallery="previous" aria-label="Предыдущие фотографии" aria-controls="project-track">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M20 12H4m7-7-7 7 7 7" stroke="currentColor" stroke-width="1.5"/>
</svg>
</button>
<button type="button" data-gallery="pause" aria-pressed="false">Пауза</button>
<button type="button" data-gallery="next" aria-label="Следующие фотографии" aria-controls="project-track">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M4 12h16m-7-7 7 7-7 7" stroke="currentColor" stroke-width="1.5"/>
</svg>
</button>
</div>
</div>
</div>
<div class="swiper" id="project-track" tabindex="0" role="region" aria-label="Фотографии мебели — листайте стрелками или свайпом">
<div class="swiper-wrapper">
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Кухня с витринами</span>
<span class="item__label item__date">КУХНЯ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-main-kitchen.webp" alt="Кухня с витринами — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="707" height="1024"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Стеклянные фасады и контрастная рабочая зона. Фото из карточки Mebel Lili.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Шкаф в прихожей</span>
<span class="item__label item__date">ШКАФЫ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-hallway.webp" alt="Шкаф в прихожей — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="576" height="1024"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Композиция прихожей. Фото к отзыву ринатты р.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Высокий шкаф</span>
<span class="item__label item__date">ШКАФЫ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-wardrobe.webp" alt="Высокий шкаф — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="768" height="1024"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Лаконичные светлые фасады. Фото к отзыву Сергея Ульянова.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Тумба под раковину</span>
<span class="item__label item__date">ТУМБЫ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-vanity.webp" alt="Тумба под раковину — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="768" height="1024"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Подвесная тумба с деревянной столешницей. Фото к отзыву Сергея Ульянова.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Хранение с нишей</span>
<span class="item__label item__date">ШКАФЫ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-storage.webp" alt="Хранение с нишей — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="768" height="1024"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Шкаф с открытой нишей. Фото к отзыву Сергея Ульянова.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Подвесная тумба</span>
<span class="item__label item__date">ДЕТАЛИ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-vanity-detail.webp" alt="Подвесная тумба — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="1024" height="768"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Светлые фасады и фактура столешницы. Фото к отзыву Сергея Ульянова.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
<article class="post-gallery__item swiper-slide">
<a class="link" href="#request">
<header>
<span class="item__label item__title">Светлая кухня</span>
<span class="item__label item__date">КУХНЯ</span>
</header>
<div class="thumbnail thumbnail--img">
<img src="/assets/yandex-kitchen.webp" alt="Светлая кухня — фотография Mebel Lili из Яндекс Карт" loading="lazy" width="1024" height="768"/>
</div>
<div class="excerpt">
<p class="excerpt__text">Угловая композиция с высокими модулями. Фото к отзыву Сергея Сергеева.</p>
<span class="read-more">
<span>обсудить похожее решение</span>
<span aria-hidden="true">→</span>
</span>
</div>
</a>
</article>
</div>
</div>
<p class="gallery-source">
<a href="https://yandex.com/maps/org/mebel_lili/1806470657/photos/" target="_blank" rel="noopener noreferrer">Фотографии из карточки Mebel Lili на Яндекс Картах ↗</a>
</p>
</section>

<section id="request" class="cb-block cb-block--contact lili-contact" style="--margin-lg-top:100px;--margin-lg-bottom:100px;--margin-md-top:45px;--margin-md-bottom:50px;--margin-sm-top:20px;--margin-sm-bottom:20px;">
<div class="contact__inner">
<div class="contact__left">

<h2 class="contact__heading">ОБСУДИМ ВАШ ПРОЕКТ</h2>
<div class="contact__text">
<p>Расскажите, какая мебель нужна и для какого помещения. Можно начать с идеи, фотографии или примерных размеров.</p>
</div>
<div class="contact__details">
<p class="contact__details-find-us">Контакты:</p>
<div class="contact__detail-wrapper">
<a class="contact__detail" href="tel:+79170372563">
<span class="contact-icon">↗</span>
<span class="contact__detail-link">+7 (917) 037-25-63</span>
</a>
<a class="contact__detail" href="https://yandex.com/maps/org/mebel_lili/1806470657" target="_blank" rel="noopener noreferrer">
<span class="contact-icon">⌖</span>
<span class="contact__detail-link">Открыть на Яндекс Картах</span>
</a>
</div>
<div class="contact-address">Самара, посёлок Кряж,<br/>Камышинская улица, 28</div>
</div>
</div>
<div class="contact__right">
<form class="contact__form lead-form" data-form-name="contact" action="/api/leads" method="post">
<div class="form-honeypot" aria-hidden="true">
<label>Ваш сайт<input name="website" tabindex="-1" autocomplete="off"/>
</label>
</div>
<div class="contact__form-field">
<label for="contact-name">Имя</label>
<input autocomplete="name" id="contact-name" name="contact_name" maxlength="80" placeholder="Как к вам обращаться" required type="text"/>
</div>
<div class="contact__form-field">
<label for="contact-phone">Телефон</label>
<input autocomplete="tel" id="contact-phone" name="contact_phone" placeholder="+7 ___ ___-__-__" required type="tel" maxlength="32" inputmode="tel"/>
</div>
<div class="contact__form-field">
<label for="contact-message">Комментарий</label>
<textarea id="contact-message" name="contact_message" placeholder="Коротко опишите задачу" rows="3" maxlength="1500">
</textarea>
</div>
<button class="contact-button" type="submit">
<span class="cb-button__title">Отправить заявку</span>
<span aria-hidden="true" class="cb-button__arrow">
</span>
</button>
<p aria-live="polite" class="contact__form-status lead-form__status" role="status">
</p>
<p class="form-purpose">Оставляя заявку, вы просите связаться с вами по указанному телефону.</p>
</form>
</div>
</div>
</section>
</main>
<footer class="cb-site-footer" role="contentinfo">
<div class="cb-site-footer__top">
<div class="cb-site-footer__newsletter lili-footer-brand">
<img src="/assets/lili-logo.svg" alt="Mebel Lili"/>
<p class="cb-site-footer__newsletter-heading">МЕБЕЛЬ, СОБРАННАЯ ВОКРУГ ВАШЕГО ПРОСТРАНСТВА.</p>
<p class="cb-site-footer__newsletter-text">Кухни · шкафы · корпусная мебель · мебель на заказ</p>
</div>
<div class="cb-site-footer__contact">
<div class="footer-mark">ML</div>
<address class="cb-site-footer__address">Mebel Lili<br/>
<br/>Самара, посёлок Кряж<br/>Камышинская улица, 28</address>
<div class="cb-site-footer__contact-divider">
</div>
<div class="cb-site-footer__contact-links">
<a class="cb-site-footer__contact-link" href="tel:+79170372563">+7 (917) 037-25-63</a>
<a class="cb-site-footer__contact-link" href="https://yandex.com/maps/org/mebel_lili/1806470657" target="_blank" rel="noopener noreferrer">Яндекс Карты ↗</a>
</div>
</div>
</div>
<div class="cb-site-footer__bar">
<nav aria-label="Навигация в подвале" class="cb-site-footer__nav">
<a class="cb-site-footer__nav-link" href="#furniture">02 МЕБЕЛЬ</a>
<a class="cb-site-footer__nav-link" href="#projects">04 ПРОЕКТЫ</a>
</nav>
<p class="cb-site-footer__copyright">© MEBEL LILI 2026</p>
<nav aria-label="Дополнительные ссылки" class="cb-site-footer__legal">
<a class="cb-site-footer__legal-link" href="#reviews">ОТЗЫВЫ</a>
<a class="cb-site-footer__legal-link" href="#request">КОНТАКТЫ</a>
</nav>
</div>
</footer>
</div>

`;
