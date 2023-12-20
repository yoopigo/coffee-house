//Затемнение экрана при переключении страницы

document.addEventListener('DOMContentLoaded', function () {
  const transitionDelay = 50;
  const overlay = document.getElementById('overlay');

  overlay.style.opacity = 1;
  setTimeout(function () {
    overlay.style.opacity = 0;
  }, transitionDelay);
});

//Бургер

const headerBurger = document.querySelector('.header__burger');
const headerNav = document.querySelector('.header__nav');
const navItems = document.querySelectorAll('.header__nav-item');

headerBurger.addEventListener('click', () => {
  headerBurger.classList.toggle('active');
  headerNav.classList.toggle('active');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    headerNav.classList.remove('active');
    headerBurger.classList.remove('active');
  }
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    headerNav.classList.remove('active');
    headerBurger.classList.remove('active');
  });
});

//Слайдер

const arrowLeft = document.querySelector('.slider__arrow--left');
const arrowRight = document.querySelector('.slider__arrow--right');
const slides = document.querySelectorAll('.slider__slide');
const sliderLine = document.querySelector('.slider__line');
const dots = document.querySelectorAll('.slider__dot');

let activeDotIndex = 0;

const totalSlides = slides.length;
const timeSlide = 5000;
let count = 0;
let times = 0;

let setIntervalSlide = setInterval(autoSlide, timeSlide);

function updateSlidePosition() {
  let widthSliderLine = sliderLine.offsetWidth;
  slides.forEach((element) => {
    element.style.transform = `translateX(${-count * widthSliderLine}px)`;
  });
}

function autoSlide() {
  if (!headerNav.classList.contains('active')) {
    if (count < totalSlides - 1) {
      count += 1;
      activeDotIndex = count;
    } else {
      count = 0;
      activeDotIndex = count;
    }
    console.log(count);
    updateDotColor();
    updateSlidePosition();
  }
}

dots[0].style.backgroundColor = '#665F55';
function updateDotColor() {
  dots.forEach((dot, index) => {
    if (index === activeDotIndex) {
      dot.style.backgroundColor = '#665F55';
    } else {
      dot.style.backgroundColor = '#C1B6AD';
    }
  });
}

arrowRight.addEventListener('click', () => {
  clearInterval(setIntervalSlide);
  if (count < totalSlides - 1) {
    count += 1;
    activeDotIndex = count;
  } else {
    count = 0;
    activeDotIndex = count;
  }
  updateSlidePosition();
  updateDotColor();
  clearInterval(setIntervalSlide);
});

arrowLeft.addEventListener('click', () => {
  clearInterval(setIntervalSlide);
  if (count == 0) {
    count += 2;
    activeDotIndex = count;
  } else if (count <= totalSlides - 1) {
    count -= 1;
    activeDotIndex = count;
  }
  updateSlidePosition();
  updateDotColor();
  clearInterval(setIntervalSlide);
});

//dragging

let isDragging = false;
let startX;
let scrollLeft;

sliderLine.addEventListener('mousedown', startDragging);
sliderLine.addEventListener('touchstart', startDragging);

window.addEventListener('mouseup', stopDragging);
window.addEventListener('touchend', stopDragging);

window.addEventListener('mousemove', drag);
window.addEventListener('touchmove', drag);

function startDragging(evt) {
  clearInterval(setIntervalSlide);
  if (window.innerWidth <= 800) {
    isDragging = true;
    startX =
      evt.type === 'touchstart'
        ? evt.touches[0].pageX - sliderLine.offsetLeft
        : evt.pageX - sliderLine.offsetLeft;
    scrollLeft = sliderLine.scrollLeft;
  }
}

function stopDragging() {
  isDragging = false;
}

function drag(evt) {
  if (!isDragging) return;
  const x =
    evt.type === 'touchmove'
      ? evt.touches[0].pageX - sliderLine.offsetLeft
      : evt.pageX - sliderLine.offsetLeft;
  const deltaX = x - startX;
  if (deltaX > 50) {
    count = count === 0 ? totalSlides - 1 : count - 1;
    updateSlidePosition();
    activeDotIndex = count;
    updateDotColor();
    clearInterval(setIntervalSlide);
  } else if (deltaX < -50) {
    count = count === totalSlides - 1 ? 0 : count + 1;
    activeDotIndex = count;
    updateDotColor();
    clearInterval(setIntervalSlide);
    updateSlidePosition();
  }
}

///Остановка при нажатии

sliderLine.addEventListener('mousedown', () => {
  clearInterval(setIntervalSlide);
});
sliderLine.addEventListener('touchstart', () => {
  clearInterval(setIntervalSlide);
});

sliderLine.addEventListener('mouseup', () => {
  setIntervalSlide = setInterval(autoSlide, timeSlide);
});

sliderLine.addEventListener('touchend', () => {
  setIntervalSlide = setInterval(autoSlide, timeSlide);
});
