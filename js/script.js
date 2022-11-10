import { PRODUCTS, DB } from "./data.js";

const USERS = [
  ...DB,
  {
    name: "Ivan",
    email: "ivan@gmail.com",
    password: "123",
    favourites: [9, 18, 7],
    orders: [
      { id: 5, count: 2 },
      { id: 6, count: 1 },
    ],
    status: false,
  },
];

const userLogined = USERS.find((user) => Boolean(user.status));

// Registartion FORM
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
    };

    USERS.forEach((value) => (value.status = false));
    USERS.push(user);

    localStorage.setItem("users", JSON.stringify(USERS));

    document.location.href = "account.html";
  });
}

// Login FORM
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
  const headerLogout = document.querySelector(`#headerLogout`);

  const userLogined = USERS.find((user) => Boolean(user.status));

  if (userLogined) {
    headerUser.href = `account.html`;
    headerUser.innerText = userLogined.name;

    headerFavourites.href = `favourites.html`;
    headerFavouritesCount.innerText = userLogined.favourites?.length ?? 0;

    headerLogout.classList.add(`active`);
    headerLogout.addEventListener("click", (e) => {
      e.preventDefault();
      userLogined.status = false;
      localStorage.setItem("users", JSON.stringify(USERS));
      document.location.href = "login.html";
    });
  }
});
