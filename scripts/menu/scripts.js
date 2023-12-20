//Overlay

const overlay = document.querySelector('#overlay');
const body = document.querySelector('.page__body');

//burger

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

//Catalog

window.onload = function () {
  fetch('../../assets/products/products.json')
    .then((response) => response.json())
    .then((data) => {
      const productsArray = data.map((product) => {
        return {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          sizes: {
            s: {
              size: product.sizes.s.size,
              addPrice: product.sizes.s.addPrice,
            },
            m: {
              size: product.sizes.m.size,
              addPrice: product.sizes.m.addPrice,
            },
            l: {
              size: product.sizes.l.size,
              addPrice: product.sizes.l.addPrice,
            },
          },
          additives: [
            {
              name: product.additives[0].name,
              addPrice: product.additives[0].addPrice,
            },
            {
              name: product.additives[1].name,
              addPrice: product.additives[1].addPrice,
            },
            {
              name: product.additives[2].name,
              addPrice: product.additives[2].addPrice,
            },
          ],
        };
      });

      const catalogItems = document.querySelector('.catalog__items');
      const coffeeButton = document.querySelector(
        '.menu-offer__switch--coffee'
      );
      const teaButton = document.querySelector('.menu-offer__switch--tea');
      const dessertButton = document.querySelector(
        '.menu-offer__switch--dessert'
      );

      const clearProducts = (product) => {
        catalogItems.innerHTML = '';
      };

      const displayRefresh = () => {
        const countProducts = document.querySelectorAll('.catalog__item');

        if (window.innerWidth <= 768 && countProducts.length > 4) {
          refresh.style.opacity = '1';
          refresh.style.display = 'flex';
        } else {
          refresh.style.opacity = '0';
          refresh.style.display = 'none';
        }
      };

      const displayModal = (product) => {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        overlay.style.display = 'block';
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0.8';
        body.classList.add('modal-open');

        const isOpenModal = document.querySelector('.modal');
        if (isOpenModal) {
          isOpenModal.remove();
        }

        modal.innerHTML = `
          <div class="modal__img-wrapper">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div action="" class="modal__form">
            <div class="modal__form-info">
              <h2 class="modal__form-name">${product.name}</h2>
              <p class="modal__form-description">${product.description}</p>
            </div>
            <div class="modal__form-option">
              <p>Size</p>
              <div class="modal__form-option-buttons">
                <button class="modal__form-button modal__form-size-button modal__form-button--active">
                  <span>S</span>${product.sizes.s.size}
                </button>
                <button class="modal__form-button modal__form-size-button">
                  <span>M</span>${product.sizes.m.size}
                </button>
                <button class="modal__form-button modal__form-size-button">
                  <span>L</span>${product.sizes.l.size}
                </button>
              </div>
            </div>
            <div class="modal__form-option">
              <p>Additives</p>
              <div class="modal__form-option-buttons">
                <button class="modal__form-button modal__form-additives-button"><span>1</span>${product.additives[0].name}</button>
                <button class="modal__form-button modal__form-additives-button"><span>2</span>${product.additives[1].name}</button>
                <button class="modal__form-button modal__form-additives-button"><span>3</span>${product.additives[2].name}</button>
              </div>
            </div>
            <div class="modal__form-price">
              <span>Total:</span>
              <span>$${product.price}</span>
            </div>
            <p class="modal__form-disclaimer">
              The cost is not final. Download our mobile app to see the final price
              and place your order. Earn loyalty points and enjoy your favorite
              coffee with up to 20% discount.
            </p>
            <button class="modal__form-button--close">Close</button>
          </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
          modal.style.opacity = '1';
        }, 100);

        let selectedSize = 'S';
        const initialPrice = product.price;

        const sizeButtonClickHandler = (event) => {
          document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal__form-size-button')) {
              const sizeButtons = document.querySelectorAll(
                '.modal__form-size-button'
              );
              sizeButtons.forEach((button) => {
                button.classList.remove('modal__form-button--active');
              });
              event.target.classList.add('modal__form-button--active');

              const size = event.target.querySelector('span').textContent;

              if (size !== selectedSize) {
                let priceChange = 0;
                if (size === 'M') {
                  priceChange = 0.5;
                } else if (size === 'L') {
                  priceChange = 1;
                }

                let prevPriceChange = 0;
                if (selectedSize === 'M') {
                  prevPriceChange = 0.5;
                } else if (selectedSize === 'L') {
                  prevPriceChange = 1;
                }

                product.price = parseFloat(product.price) - prevPriceChange;
                product.price = parseFloat(product.price) + priceChange;

                const priceElement = document.querySelector(
                  '.modal__form-price span:last-child'
                );
                priceElement.textContent = `$${product.price.toFixed(2)}`;

                selectedSize = size;
              }
            } else if (event.target.closest('.modal__form-size-button')) {
              const button = event.target.closest('.modal__form-size-button');
              const simulatedEvent = new Event('click', {
                bubbles: true,
                cancelable: true,
              });
              button.dispatchEvent(simulatedEvent);
            }
          });
        };

        const additivesButtonClickHandler = (event) => {
          if (event.target.classList.contains('modal__form-additives-button')) {
            const isActive = event.target.classList.contains(
              'modal__form-button--active'
            );
            if (isActive) {
              event.target.classList.remove('modal__form-button--active');
              product.price = parseFloat(product.price) - 0.5;
            } else {
              event.target.classList.add('modal__form-button--active');
              product.price = parseFloat(product.price) + 0.5;
            }
            const totalAdditivesPrice = document.querySelector(
              '.modal__form-price span:last-child'
            );
            totalAdditivesPrice.textContent = `$${product.price.toFixed(2)}`;
          } else if (event.target.closest('.modal__form-additives-button')) {
            const button = event.target.closest(
              '.modal__form-additives-button'
            );
            const simulatedEvent = new Event('click', {
              bubbles: true,
              cancelable: true,
            });
            button.dispatchEvent(simulatedEvent);
          }
        };

        document.body.addEventListener('click', sizeButtonClickHandler);
        document.body.addEventListener('click', additivesButtonClickHandler);

        document.body.addEventListener('click', (event) => {
          const modal = document.querySelector('.modal');
          if (event.target.classList.contains('modal__form-button--close')) {
            modal.style.display = 'none';
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';
            overlay.style.display = 'none';
            body.classList.remove('modal-open');
            product.price = initialPrice;
            modal.style.opacity = '0';
            document.body.removeEventListener('click', sizeButtonClickHandler);
            document.body.removeEventListener(
              'click',
              additivesButtonClickHandler
            );
          }
        });

        document.body.addEventListener('keydown', (event) => {
          const modal = document.querySelector('.modal');
          if (event.key === 'Escape') {
            modal.style.display = 'none';
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';
            overlay.style.display = 'none';
            body.classList.remove('modal-open');
            product.price = initialPrice;
            modal.style.opacity = '0';
            document.body.removeEventListener('click', sizeButtonClickHandler);
            document.body.removeEventListener(
              'click',
              additivesButtonClickHandler
            );
          }
        });

        overlay.addEventListener('click', (event) => {
          if (event.target === overlay) {
            closeModal();
          }
        });

        const closeModal = () => {
          const modal = document.querySelector('.modal');
          modal.style.display = 'none';
          overlay.style.transition = 'opacity 0.5s';
          overlay.style.opacity = '0';
          overlay.style.display = 'none';
          body.classList.remove('modal-open');
          product.price = initialPrice;
          modal.style.opacity = '0';
          document.body.removeEventListener('click', sizeButtonClickHandler);
          document.body.removeEventListener(
            'click',
            additivesButtonClickHandler
          );
        };
      };

      const displayProducts = (category) => {
        productsArray.forEach((product) => {
          if (product.category == category) {
            const catalogItem = document.createElement('li');
            catalogItem.classList.add('catalog__item');

            const catalogItemImgContainer = document.createElement('div');
            catalogItemImgContainer.classList.add(
              'catalog__item-img-container'
            );
            catalogItem.appendChild(catalogItemImgContainer);

            const catalogItemImg = document.createElement('img');
            catalogItemImg.src = product.image;
            catalogItemImg.alt = product.name;
            catalogItemImg.classList.add('catalog__item-img');
            catalogItemImgContainer.appendChild(catalogItemImg);

            const catalogItemInfo = document.createElement('div');
            catalogItemInfo.classList.add('catalog__item-info');
            catalogItem.appendChild(catalogItemInfo);

            const catalogItemTitle = document.createElement('h2');
            catalogItemTitle.classList.add('catalog__item-title');
            catalogItemTitle.textContent = product.name;
            catalogItemInfo.appendChild(catalogItemTitle);

            const catalogItemDescription = document.createElement('p');
            catalogItemDescription.classList.add('catalog__item-description');
            catalogItemDescription.textContent = product.description;
            catalogItemInfo.appendChild(catalogItemDescription);

            const catalogItemPrice = document.createElement('p');
            catalogItemPrice.classList.add('catalog__item-price');
            catalogItemPrice.textContent = product.price;
            catalogItemInfo.appendChild(catalogItemPrice);

            catalogItems.appendChild(catalogItem);

            setTimeout(() => {
              catalogItem.style.opacity = '1';
            }, 100);
          }
        });
      };

      displayProducts('coffee');
      const modalItems = document.querySelectorAll('.catalog__item');
      modalItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          displayModal(productsArray[index]);
        });
      });

      function modalOpen(modalItems) {
        modalItems.forEach((item) => {
          item.addEventListener('click', () => {
            const productName = item.querySelector(
              '.catalog__item-title'
            ).textContent;
            const selectedProduct = productsArray.find(
              (product) => product.name === productName
            );
            displayModal(selectedProduct);
          });
        });
      }

      coffeeButton.addEventListener('click', () => {
        clearProducts();
        displayProducts('coffee');
        const modalItems = document.querySelectorAll('.catalog__item');
        coffeeButton.classList.add('menu-offer__switch--active');
        dessertButton.classList.remove('menu-offer__switch--active');
        teaButton.classList.remove('menu-offer__switch--active');
        coffeeButton.disabled = true;
        teaButton.disabled = false;
        dessertButton.disabled = false;

        setTimeout(() => {
          displayRefresh();
          modalOpen(modalItems);
        }, 100);
      });

      teaButton.addEventListener('click', () => {
        clearProducts();
        displayProducts('tea');
        const modalItems = document.querySelectorAll('.catalog__item');
        coffeeButton.classList.remove('menu-offer__switch--active');
        dessertButton.classList.remove('menu-offer__switch--active');
        teaButton.classList.add('menu-offer__switch--active');
        coffeeButton.disabled = false;
        teaButton.disabled = true;
        dessertButton.disabled = false;

        setTimeout(() => {
          displayRefresh();
          modalOpen(modalItems);
        }, 100);
      });

      dessertButton.addEventListener('click', () => {
        clearProducts();
        displayProducts('dessert');
        const modalItems = document.querySelectorAll('.catalog__item');
        coffeeButton.classList.remove('menu-offer__switch--active');
        dessertButton.classList.add('menu-offer__switch--active');
        teaButton.classList.remove('menu-offer__switch--active');
        coffeeButton.disabled = false;
        teaButton.disabled = false;
        dessertButton.disabled = true;

        setTimeout(() => {
          displayRefresh();
          modalOpen(modalItems);
        }, 100);
      });
    })
    .catch((error) => console.error(error));
};

//refresh

const refresh = document.querySelector('.catalog__refresh');

refresh.addEventListener('click', () => {
  const hiddenItems = document.querySelectorAll(
    '.catalog__items li:nth-child(n+5)'
  );
  hiddenItems.forEach((item) => {
    item.style.display = 'block';

    setTimeout(() => {
      item.style.opacity = '1';
      refresh.style.display = 'none';
      refresh.style.opacity = '0';
    }, 100);
  });
});
