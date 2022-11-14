import { PRODUCTS } from "./data.js";
import { USERS, userLogined } from "./script.js";

const orderTable = document.querySelector(`#orderTable`);

if (orderTable && userLogined) {
  userLogined.orders.forEach((order) => {
    let product = PRODUCTS.find((product) => product.id === order);

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
                    </tr>`;
    orderTable.append(tr);
  });
}

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
