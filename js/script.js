import { PRODUCTS, DB } from "./data.js";

const USERS = DB;
let userLogined = USERS.find((user) => Boolean(user.status));

const testIvan = {
  name: "Ivan",
  email: "testivan@gmail.com",
  password: "123",
  favourites: [9, 18, 7],
  orders: [
    { id: 5, count: 2 },
    { id: 6, count: 1 },
  ],
  cart: [9, 18, 7],
  status: false,
};

if (USERS.findIndex((user) => user.email === testIvan.email) < 0) {
  USERS.push(testIvan);
  localStorage.setItem("users", JSON.stringify(USERS));
}

// REGISTRATION FORM
// =================

const registrationForm = document.querySelector("#RegistrationForm");
if (registrationForm) {
  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const error = e.target.querySelector(".error");
    const name = e.target.querySelector('input[data-name="name"]').value;
    const email = e.target.querySelector('input[data-name="email"]').value;
    const password = e.target.querySelector(
      'input[data-name="password"]'
    ).value;
    const passwordVerify = e.target.querySelector(
      'input[data-name="passwordVerify"]'
    ).value;

    error.classList.remove("active");

    if (password !== passwordVerify) {
      error.innerText = "Passwords do not match";
      error.classList.add("active");

      return;
    }

    const userExist = USERS.find(
      (user) => user.email === email.trim().toLocaleLowerCase()
    );

    if (userExist) {
      error.innerText = "User exists";
      error.classList.add("active");

      return;
    }

    const user = {
      name: name.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: password,
      status: true,
      favourites: [],
      orders: [],
      cart: [],
    };

    USERS.forEach((value) => (value.status = false));
    USERS.push(user);

    localStorage.setItem("users", JSON.stringify(USERS));

    document.location.href = "account.html";
  });
}

// LOGIN FORM
// ==========
const loginForm = document.querySelector(`#LoginForm`);

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    USERS.forEach((value) => (value.status = false));
    localStorage.setItem("users", JSON.stringify(USERS));

    const error = e.target.querySelector(".error");
    const email = e.target.querySelector("input[data-name='email']").value;
    const password = e.target.querySelector(
      "input[data-name='password']"
    ).value;

    const user = USERS.find((user) => {
      if (
        user.email === email.trim().toLocaleLowerCase() &&
        user.password === password
      ) {
        return user;
      }
    });

    error.classList.remove("active");

    if (!user) {
      error.classList.add("active");
      return;
    }

    user.status = true;

    localStorage.setItem("users", JSON.stringify(USERS));

    document.location.href = "account.html";
  });
}

// HEADER
// ======

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const headerUser = document.querySelector(`#headerUser`);
  const headerFavourites = document.querySelector(`#headerFavourites`);
  const headerFavouritesCount = document.querySelector(
    `#headerFavouritesCount`
  );
  const headerShoppingCart = document.querySelector(`#headerShoppingCart`);
  const headerShoppingCartCount = document.querySelector(
    `#headerShoppingCartCount`
  );
  const headerLogout = document.querySelector(`#headerLogout`);

  if (userLogined) {
    headerUser.href = `account.html`;
    headerUser.innerText = userLogined.name;

    headerFavourites.href = `favourites.html`;
    headerFavouritesCount.innerText = userLogined.favourites?.length ?? 0;

    headerShoppingCart.href = `shopping-cart.html`;
    headerShoppingCartCount.innerHTML = userLogined.cart?.length ?? 0;

    userInfoEmail && (userInfoEmail.innerText = userLogined.email);

    headerLogout.classList.add(`active`);
    headerLogout.addEventListener("click", (e) => {
      e.preventDefault();
      userLogined.status = false;
      localStorage.setItem("users", JSON.stringify(USERS));
      document.location.href = "login.html";
    });
  }
});

// ACCOUNT
// =======

const orderTable = document.querySelector(`#orderTable`);
if (orderTable && userLogined) {
  userLogined.orders.forEach((order) => {
    let product = PRODUCTS.find((product) => order.id === product.id);

    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                      <td>
                        <div class="item__info"><img src="images/products/${
                          product.img
                        }.png" 
                        alt="${product.title}" 
                        height="100">
                            <div>
                            <p class="item__info--title">${product.title}</p>
                            </div>
                        </div>
                      </td>
                      <td>$${product.price}</td>
                      <td><span class="item__sale">- ${
                        product.sale ? product.salePercent + "%" : ""
                      }</span></td>
                      <td>${order.count}</td>
                      <td>$${
                        (product.price -
                          (product.sale
                            ? (product.price * product.salePercent) / 100
                            : 0)) *
                        order.count
                      }
                      </td>
                    </tr>`;
    orderTable.append(tr);
  });
}

// ACCOUNT BUTTONS
// ===============

const userInfo = document.querySelector("#userInfo");
if (userInfo) {
  userInfo.addEventListener("submit", (e) => {
    e.preventDefault();

    const newName = e.target.querySelector("input").value;
    userLogined.name = newName;
    localStorage.setItem("users", JSON.stringify(USERS));
    window.location.reload();
  });
}

const deleteAcc = document.querySelector("#deleteAcc");
if (deleteAcc) {
  deleteAcc.addEventListener("click", () => {
    if (userLogined) {
      const index = USERS.findIndex((user) => Boolean(user.status));
      USERS.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(USERS));
    }
    document.location.href = "login.html";
  });
}

// FAVOURITES
// ==========

const favouriteTable = document.querySelector("#favouriteTable")?.children[2];

function renderFavourite(user) {
  user.favourites.forEach((favouriteID) => {
    const favouriteProduct = PRODUCTS.find(
      (product) => product.id === favouriteID
    );

    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>
                          <div class="item__info">
                              <img src="images/products/${
                                favouriteProduct.img
                              }.png"
                               alt="${favouriteProduct.title}" height="100">
                              <div>
                                  <p class="item__info--title">${
                                    favouriteProduct.title
                                  }</p>
                              </div>
                          </div>
                      </td>
                      <td>$${favouriteProduct.price}</td>
                      <td>${
                        favouriteProduct.sale
                          ? "<span class='item__sale'>- " +
                            favouriteProduct.salePercent +
                            "%" +
                            "</span>"
                          : "-"
                      }
                      </td>
                      <td>$${
                        favouriteProduct.sale
                          ? favouriteProduct.price -
                            (favouriteProduct.price *
                              favouriteProduct.salePercent) /
                              100
                          : favouriteProduct.price
                      }
                      </td>
                      <td>
                          <button class="item__favourite"><img src="images/product__favourite--true.png" alt="favourite" height="20"  data-product_id="${
                            favouriteProduct.id
                          }"></button>
                          <button class="add-product-in-cart"><img src="images/product__shopping-cart.png" data-product_id="${
                            favouriteProduct.id
                          }" alt="favourite" height="20" "></button>
                      </td> </tr>`;

    favouriteTable.appendChild(tr);
  });

  const favouriteButtons = document.querySelectorAll(".item__favourite");

  favouriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const product_id = parseInt(e.target.dataset.product_id);

      const index = userLogined.favourites.findIndex(
        (value) => value === product_id
      );

      userLogined.favourites.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(USERS));
      document.querySelector(`#headerFavouritesCount`).innerText =
        userLogined.favourites?.length ?? 0;

      favouriteTable.innerHTML = "";
      renderFavourite(user);
    });
  });
}

if (favouriteTable && userLogined) {
  renderFavourite(userLogined);
}

// INDEX
// =====

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
if (favouritesAll && !userLogined) {
  favouritesAll.forEach((favourite) => {
    favourite.addEventListener("click", (e) => {
      e.preventDefault();
      document.location.href = "login.html";
    });
  });
}

if (favouritesAll && userLogined) {
  favouritesAll.forEach((favourite) => {
    favourite.addEventListener("click", (e) => {
      e.preventDefault();
      const product_id = e.target.dataset.product_id;

      if (product_id) {
        if (userLogined.favourites.includes(parseInt(product_id))) {
          const index = userLogined.favourites.findIndex(
            (value) => value === parseInt(product_id) // строка в число
          );

          userLogined.favourites.splice(index, 1); //удалит 1єл по index
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

// CART
// ====

const addProductInCart = document.querySelectorAll(".add-product-in-cart");
if (userLogined) {
  addProductInCart.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const product_id = e.target.dataset.product_id;

      if (product_id) {
        if (userLogined.cart.includes(parseInt(product_id))) {
          const index = userLogined.cart.findIndex(
            (el) => el === parseInt(product_id)
          );

          userLogined.cart.splice(index, 1);
        } else {
          userLogined.cart.push(parseInt(product_id));
        }

        document.querySelector(`#headerShoppingCartCount`).innerText =
          userLogined.favourites?.length ?? 0;

        localStorage.setItem("users", JSON.stringify(USERS));
        window.location.reload();
      }
    });
  });
}

const cartTable = document.querySelector(`#cartTable`)?.children[2];

function renderCart(user) {
  let totalSum = [];

  user.cart.forEach((el) => {
    const productInCart = PRODUCTS.find((product) => product.id === el);

    const price = productInCart.sale
      ? productInCart.price -
        (productInCart.price * productInCart.salePercent) / 100
      : productInCart.price;

    totalSum.push(price);

    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>
                          <div class="item__info">
                              <img src="images/products/${productInCart.img}.png"
                               alt="${productInCart.title}" height="100">
                              <div>
                                  <p class="item__info--title">${productInCart.title}</p>
                              </div>
                          </div>
                      </td>
                      <td>$${price}</td>
                      <td>
                          <button class="delete-product-in-cart"><img src="images/delete.png" data-product_id="${productInCart.id}" alt="favourite" height="20" "></button>
                      </td> </tr>`;

    cartTable.appendChild(tr);

    const totalPrice = document.querySelector(`.totalPrice`);
    totalPrice.innerText =
      `итого: ` + ` $ ` + totalSum.reduce((acc, price) => (acc += price), 0);
  });

  const deleteProductInCart = document.querySelectorAll(
    ".delete-product-in-cart"
  );

  deleteProductInCart.forEach((button) => {
    button.addEventListener("click", (e) => {
      const product_id = parseInt(e.target.dataset.product_id);

      const index = userLogined.cart.findIndex((value) => value === product_id);

      userLogined.cart.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(USERS));
      document.querySelector(`#headerShoppingCartCount`).innerText =
        userLogined.cart?.length ?? 0;

      if (user.cart.length === 0) {
        document.querySelector(`.buy-block`).innerHTML = "";
      }

      cartTable.innerHTML = "";
      renderCart(user);
    });
  });
}

if (cartTable && userLogined) {
  renderCart(userLogined);
}
