import { PRODUCTS } from "./data.js";
import { USERS, userLogined } from "./script.js";

const categoriesContainer = document.querySelector("#categoriesContainer");
const AllProducts = {};

if (categoriesContainer) {
  PRODUCTS.forEach((product) => {
    product.categories.forEach((category) => {
      const productBox = document.createElement("div");
      productBox.classList.add("product");
      productBox.innerHTML = `<button class="product__favourite">
                    <img src="images/product__favourite${
                      userLogined && userLogined.favourites.includes(product.id)
                        ? "--true"
                        : ""
                    }.png" 
                        data-product_id="${product.id}"
                        alt="favourite" 
                    height="20">
                    </button>
    <img src="images/products/${product.img}.png" class="product__img" alt="${
        product.title
      }" height="80">
    <p class="product__title">${product.title}</p>
    ${
      product.sale
        ? `<div class="product__sale">
                <span class="product__sale--old">$${product.price}</span>
                <span class="product__sale--percent">- ${
                  product.salePercent + "%"
                }</span>
                      </div>`
        : ""
    }
    <div class="product__info">
        <span class="product__price">$${
          product.sale
            ? product.price - (product.price * product.salePercent) / 100
            : product.price
        }</span>
        <button class="add-product-in-cart"><img src="images/product__shopping-cart.png" data-product_id="${
          product.id
        }" alt="favourite" height="20" "></button>
    </div>`;

      if (!AllProducts[category]) {
        const categorySection = document.createElement("section");
        categorySection.classList.add("category");

        categorySection.dataset.name = category;
        categorySection.innerHTML = `<h2>${category}</h2>`;

        const categoryWrapper = document.createElement("div");
        categoryWrapper.classList.add("category__container");
        AllProducts[category] = categoryWrapper;

        categorySection.appendChild(categoryWrapper);
        categoriesContainer.appendChild(categorySection);
      }
      AllProducts[category].appendChild(productBox);
    });
  });
}

const favouritesAll = document.querySelectorAll(".product__favourite");

if (!userLogined) {
  favouritesAll.forEach((favourite) => {
    favourite.addEventListener("click", (e) => {
      document.location.href = "login.html";
    });
  });
}

if (userLogined) {
  favouritesAll.forEach((favourite) => {
    favourite.addEventListener("click", (e) => {
      const product_id = e.target.dataset.product_id;

      if (product_id) {
        if (userLogined.favourites.includes(parseInt(product_id))) {
          const index = userLogined.favourites.findIndex(
            (value) => value === parseInt(product_id)
          );

          userLogined.favourites.splice(index, 1);
          e.target.src = `images/product__favourite.png`;
        } else {
          userLogined.favourites.push(parseInt(product_id));
          e.target.src = `images/product__favourite--true.png`;
        }

        document.querySelector(`#headerFavouritesCount`).innerText =
          userLogined.favourites?.length ?? 0;

        localStorage.setItem("users", JSON.stringify(USERS));
      }
    });
  });
}

const addProductInCart = document.querySelectorAll(".add-product-in-cart");
if (userLogined) {
  addProductInCart.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const product_id = e.target.dataset.product_id;

      if (userLogined.cart.includes(parseInt(product_id))) {
        const index = userLogined.cart.findIndex(
          (el) => el === parseInt(product_id)
        );

        userLogined.cart.splice(index, 1);
      } else {
        userLogined.cart.push(parseInt(product_id));
      }

      document.querySelector(`#headerShoppingCartCount`).innerText =
        userLogined.cart?.length ?? 0;

      localStorage.setItem("users", JSON.stringify(USERS));
    });
  });
}
