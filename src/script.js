/* Add any JavaScript you need to this file. */
const sliderContainer = document.querySelector('.slider-container');
const imageContainer = document.querySelector('.image-container');
const sliderImages = document.querySelectorAll('.image-container img');

const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
let counter = 1;
let size = sliderImages[0].clientWidth;

window.onload = () => {
  size = sliderImages[0].clientWidth;
  imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';
};

window.addEventListener('resize', () => {
  size = sliderImages[0].clientWidth;
  imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';
});

imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';

nextBtn.addEventListener('click', () => {
  if (counter >= sliderImages.length - 1) return;
  imageContainer.style.transition = 'transform 0.3s ease-in-out';
  counter++;
  imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';
});

prevBtn.addEventListener('click', () => {
  if (counter <= 0) return;
  imageContainer.style.transition = 'transform 0.3s ease-in-out';
  counter--;
  imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';
});

imageContainer.addEventListener('transitionend', () => {
  if (sliderImages[counter].id === 'lastClone') {
    imageContainer.style.transition = 'none';
    counter = sliderImages.length - 2;
    imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';
  } else if (sliderImages[counter].id === 'firstClone') {
    imageContainer.style.transition = 'none';
    counter = sliderImages.length - counter;
    imageContainer.style.transform = 'translateX(' + -size * counter + 'px)';
  }
});

sliderContainer.addEventListener('mouseover', () => {
  prevBtn.style.display = 'block';
  nextBtn.style.display = 'block';
});

sliderContainer.addEventListener('mouseout', () => {
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
});

// products controlling below
// type 1: shirt, 2: pants, 3: shoes, 4: trousers
const productsDOM = document.querySelector('.products');
const innerBody = document.querySelectorAll('.inner-body');
const overlayDOM = document.querySelector('.overlay');
const windowDOM = document.querySelector('.window');
const closeButton = document.querySelector('.close-button');
const navbarChoices = document.querySelectorAll('.main-nav-bar li a');
const titleInOverlay = document.querySelector('.header h2');
const overlay = document.querySelector('.overlay');
const cartOverlay = document.querySelector('.cart-overlay');
const mainCart = document.querySelector('.cart');
const cartButton = document.querySelector('.cart-btn');
const closeButtonInCart = document.querySelector('.close-cart');
const cartContent = document.querySelector('.cart-content');
const amountPicked = document.querySelector('.cart-items');
const totalMoney = document.querySelector('.your-total');

let allProducts = [];
let cart = [];

async function getProducts(name) {
  try {
    const link = `./${name}.json`;
    const response = await fetch(link);
    const data = await response.json();
    let products = data.products;

    products = products.map(one => {
      const { id, name, type, price, img, size, date } = one;
      return { id, name, type, price, img, size, date };
    });
    return products;
  } catch (error) {
    console.log(error);
  }
}

const saveProductsToArray = (products, name) => {
  const object = { products: products, name: name };
  allProducts.push(object);
};

const displayProducts = (products, option) => {
  let dom = '';
  if (option < 1 || option > 4) {
    products.forEach(one => {
      dom += `<div class="one-box">
        <div class='want-to-buy' data-num="${one.id}">
          <button id="add-to-cart">Add to cart</button>
        </div>
        <img class='model-img' src="${one.img}" alt="" />
        <h3>${one.name}</h3>
        <h4>$${one.price}</h4>

      </div>`;
    });
  } else {
    products.forEach(one => {
      if (one.type === option) {
        dom += `<div class="one-box ">
        <div class='want-to-buy' data-num="${one.id}">
          <button id="add-to-cart">Add to cart</button>
        </div>
        <img class='model-img' src="${one.img}" alt="" />
        <h3>${one.name}</h3>
        <h4>$${one.price}</h4>
      </div>`;
      }
    });
  }

  productsDOM.innerHTML = dom;
  boxesEvents();
};

const boxesEvents = () => {
  const addToCart = document.querySelectorAll('#add-to-cart');
  addToCart.forEach(one => {
    const id = parseInt(one.parentElement.dataset.num);
    const inCart = cart.find(one => one.product.id === id);
    if (inCart) {
      one.innerText = 'In Cart';
      one.disabled = true;
    }

    one.addEventListener('click', e => {
      e.target.innerText = 'In Cart';
      e.target.disabled = true;

      const data = parseInt(e.target.parentElement.dataset.num);
      let next = true;
      for (let i = 0; i < allProducts.length && next; i++) {
        for (let j = 0; j < allProducts[i].products.length && next; j++) {
          if (allProducts[i].products[j].id === data) {
            next = false;
            cart.push({ product: allProducts[i].products[j], amount: 1 });
            updateInfo(cart);
            displayCart(cart);
          }
        }
      }
    });
  });
};

const inCartEvents = () => {
  mainCart.addEventListener('click', e => {
    if (e.target.classList.contains('remove-item')) {
      removeOneItem(e.target.dataset.num);
    } else if (e.target.classList.contains('fa-chevron-up')) {
      const id = parseInt(e.target.dataset.num);
      const item = cart.find(one => one.product.id === id);
      item.amount++;
      updateInfo(cart);
      e.target.nextElementSibling.innerText = item.amount;
    } else if (e.target.classList.contains('fa-chevron-down')) {
      const id = parseInt(e.target.dataset.num);
      const item = cart.find(one => one.product.id === id);
      item.amount--;
      if (item.amount === 0) {
        removeOneItem(id);
      } else {
        updateInfo(cart);
        e.target.previousElementSibling.innerText = item.amount;
      }
    } else if (e.target.classList.contains('place-order')) {
      cart.forEach(one => {
        removeOneItem(one.product.id);
      });
    }
  });
};

const removeOneItem = id => {
  id = parseInt(id);
  cart = cart.filter(one => one.product.id !== id);
  updateInfo(cart);
  displayCart(cart);
};

const displayCart = cart => {
  let dom = '';
  cart.forEach(one => {
    dom += `
      <div class='cart-item'>
        <img src="${one.product.img}" alt="">
        <div class='info-remove'>
          <h3>${one.product.name}</h3>
          <h4>$<span data-num="${one.product.id}">${one.product.price}</span></h4>
          <button class='remove-item' data-num="${one.product.id}">remove</button>
        </div>
        <div>
          <i class='fas fa-chevron-up' data-num="${one.product.id}"></i>
          <p class='item-amount'>${one.amount}</p>
          <i class='fas fa-chevron-down' data-num="${one.product.id}"></i>
        </div>
      </div>
    `;
  });
  cartContent.innerHTML = dom;
};

const updateInfo = cart => {
  let money = 0;
  let amount = 0;

  cart.forEach(one => {
    amount += one.amount;
    money += one.product.price * one.amount;
  });

  amountPicked.innerText = amount;
  totalMoney.innerText = money;
};

const openCart = () => {
  cartOverlay.classList.remove('hide');
  mainCart.classList.remove('hide');
};

const closeCart = () => {
  cartOverlay.classList.add('hide');
  mainCart.classList.add('hide');
};

cartOverlay.addEventListener('click', e => {
  if (e.target.classList.contains('cart-overlay')) {
    closeCart();
  }
});

cartButton.addEventListener('click', () => {
  openCart();
});

closeButtonInCart.addEventListener('click', () => {
  closeCart();
});

overlay.addEventListener('click', event => {
  if (event.target.classList.contains('overlay')) {
    closeOverlay();
  }
});

const closeOverlay = () => {
  windowDOM.classList.add('hide');
  overlayDOM.classList.add('hide');
};

closeButton.addEventListener('click', () => {
  closeOverlay();
});

navbarChoices.forEach(one => {
  one.addEventListener('click', () => {
    overlayDOM.classList.remove('hide');
    windowDOM.classList.remove('hide');
    titleInOverlay.innerHTML = one.textContent;
    const dataID = parseInt(one.dataset.id);
    switch (dataID) {
      case 6:
        break;
      case 7:
        load(0, 'men');
        break;
      case 8:
        load(0, 'women');
        break;
      case 9:
        load(0, 'kids');
        break;
      case 10:
        break;
      default:
        break;
    }
  });
});

innerBody.forEach(one => {
  one.addEventListener('click', () => {
    overlayDOM.classList.remove('hide');
    windowDOM.classList.remove('hide');

    const key = one.dataset.id;
    const num = parseInt(key.charAt(0));
    let letter = key.charAt(1);

    if (letter === 'm') letter = 'men';
    else if (letter === 'k') letter = 'kids';
    else letter = 'women';
    titleInOverlay.innerHTML = letter + "'s products";

    load(num, letter);
  });
});

const load = (num, letter) => {
  if (allProducts.length === 0) {
    getProducts(letter).then(products => {
      displayProducts(products, num);
      saveProductsToArray(products, letter);
      inCartEvents();
    });
  } else {
    let temp = true;
    for (let i = 0; i < allProducts.length && temp; i++) {
      if (allProducts[i].name === letter) {
        temp = false;
        displayProducts(allProducts[i].products, num);
      }
    }
    if (temp === true) {
      getProducts(letter).then(products => {
        displayProducts(products, num);
        saveProductsToArray(products, letter);
      });
    }
  }
};
