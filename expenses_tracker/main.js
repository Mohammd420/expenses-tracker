/* ------Select Elements  ---------*/
const totlaExpenses = document.querySelector(".total h2");
const expenseName = document.querySelector("#name");
const expenseAmount = document.querySelector("#amount");
const expenseCategory = document.querySelector("#category");
const addBtn = document.querySelector(".add-btn");
const expensesNum = document.querySelector(".nums-items");
const clearBtn = document.querySelector(".clear-btn");
const errorMsg = document.querySelector(".error");
const clearPop = document.querySelector(".clear-pop");

const options = {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
};

let id = 1;

//Array For Expenses
let expenses = [];

// Event Click In Add Button
addBtn.addEventListener("click", () => {
  if (validData()) {
    addEx();
    showExs(expenses);

    // Empty Inputs
    expenseName.value = "";
    expenseAmount.value = "";
    expenseCategory.value = "";

    id++;
    clearBtn.style.display = "block";
  }
});

// Validate Data
function validData() {
  let valid = true;
  if (expenseName.value.trim() === "") {
    document.querySelector("#name-error").style.display = "block";
    valid = false;
  } else {
    document.querySelector("#name-error").style.display = "none";
  }

  if (expenseAmount.value.trim() === "" || Number(expenseAmount.value <= 0)) {
    document.querySelector("#amount-error").style.display = "block";
    valid = false;
  } else {
    document.querySelector("#amount-error").style.display = "none";
  }

  if (expenseCategory.value.trim() == "") {
    document.querySelector("#categ-error").style.display = "block";
    valid = false;
  } else {
    document.querySelector("#categ-error").style.display = "none";
  }
  return valid;
}

expenseName.addEventListener("input", () => {
  document.querySelector("#name-error").style.display = "none";
});

expenseAmount.addEventListener("input", () => {
  document.querySelector("#amount-error").style.display = "none";
});

expenseCategory.addEventListener("input", () => {
  document.querySelector("#categ-error").style.display = "none";
});

function addEx() {
  const date = new Date();
  expenses.push({
    name: expenseName.value,
    amount: Number(expenseAmount.value),
    category: expenseCategory.value,
    exDate: date.toLocaleDateString("en-US", options),
    exId: id,
  });
  //Add To Local Storage
  svaleToLocalStorage();
}

// Save To Local Storage Function
function svaleToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

//Create Element --Helper--!
function createEl(tag, className, text) {
  let el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}

//Display Expenses
function showExs(arr) {
  document.querySelector(".items").innerHTML = "";

  if (arr.length !== 0) {
    document.querySelector(".no-items").style.display = "none";
    clearBtn.style.display = "block";

    arr.forEach((el) => {
      // Main Items Div
      let item = document.createElement("div");
      item.className = "item";

      //item name & date and category div
      let nameAndDateAndCateg = document.createElement("div");
      nameAndDateAndCateg.className = "item-name-and-date-categ";

      let itemName = createEl("h3", "title", el.name);
      let dateSpan = createEl("span", "date", `${el.exDate} - `);
      let categSpan = createEl("span", "category", el.category);

      nameAndDateAndCateg.appendChild(itemName);
      nameAndDateAndCateg.appendChild(dateSpan);
      nameAndDateAndCateg.appendChild(categSpan);

      item.appendChild(nameAndDateAndCateg);
      // Delete / amount div
      let deleteAndAmountDiv = document.createElement("div");
      deleteAndAmountDiv.className = "delete-and-amount";
      let amountSpan = createEl("span", "amount", `SDG ${el.amount}`);

      let deleteBtn = createEl("button", "delete-btn", "");
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i> `;
      deleteBtn.dataset.id = el.exId;

      deleteAndAmountDiv.appendChild(amountSpan);
      deleteAndAmountDiv.appendChild(deleteBtn);
      item.appendChild(deleteAndAmountDiv);

      document.querySelector(".items").appendChild(item);
    });
  } else {
    document.querySelector(".no-items").style.display = "block";
    clearBtn.style.display = "none";
  }
  document.querySelector(".nums-items").textContent = `${arr.length} items`;
  updateTotal();
}

//---------Delete Function ---------//
function deleteEx(id) {
  expenses = expenses.filter((ele) => ele.exId !== id);
  svaleToLocalStorage();
  showExs(expenses);
}

document.querySelector(".items").addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  console.log(btn);
  if (!btn) return;
  deleteEx(Number(btn.dataset.id));
});

//-------Updatte Total --------- //
function updateTotal() {
  if (expenses.length >= 0) {
    let total = 0;
    expenses.forEach((expense) => {
      total += parseFloat(expense.amount);
    });

    totlaExpenses.textContent = `SDG ${total}`;
  }
}

// --------Clear ------- //
clearBtn.addEventListener("click", function () {
  clearPop.style.display = "flex";

  clearPop.addEventListener("click", (e) => {
    if (e.target.closest(".confirm")) {
      expenses = [];
      svaleToLocalStorage();
      showExs(expenses);
      clearPop.style.display = "none";
    } else if (e.target.closest(".cancel")) {
      clearPop.style.display = "none";
    }
  });
});

//--------Display Items From Local Storage------ //
if (localStorage.getItem("expenses")) {
  expenses = JSON.parse(localStorage.getItem("expenses"));

  expenses.forEach((ex) => {
    ex.amount = Number(ex.amount);
  });

  if (expenses.length > 0) {
    id = expenses[expenses.length - 1].exId + 1;
  }
}

showExs(expenses);

// Press Enter to add expense
function pressEnter(e) {
  if (e.key === "Enter") {
    addBtn.click();
  }
}
expenseName.addEventListener("keydown", pressEnter);
expenseAmount.addEventListener("keydown", pressEnter);
expenseCategory.addEventListener("keydown", pressEnter);
