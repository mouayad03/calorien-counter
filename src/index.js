import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, p, input, button, table, tr, td, br } = hh(h);

const createButton = "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded";
const cancleButton = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
const inputStyle = "border-2 border-black inline-block";
const rowStyle = "min-w-[450px] border border-slate-300 bg-neutral-400 focus:ring-2";
const dataRowStyle = "min-w-[450px] border border-slate-300 bg-neutral-200 focus:ring-2";
const deleteButtonStyle = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded";
const MSGS = {
  saveButton: "saveButton",
  total: "total",
  cancleButton: "cancleButton"
};

function view(dispatch, model) {
  return div ({ }, [ 
    div({ className: " text-center gap-4 items-center" }, [
    p({className: "text-xl inline-block px-5"}, `Meal:`),
    input({type:"text", className: inputStyle, id:"nameInput"}),
    br({}),
    br({}),
    p({className: "text-xl inline-block px-2" }, `Calories:`),
    input({type:"number", className: inputStyle, id:"caloriesInput"}),
    br({}),
    br({}),
    button({ className: createButton, onclick: () => dispatch(MSGS.saveButton) }, "Save" + model.currentMeal + model.currentCalories),
    button({ className: cancleButton, onclick: () => dispatch(MSGS.cancleButton) }, "Cancle"),
    ]),
    table({ className: "text-center mx-auto border-collapse mt-10", id:"table" }, [
      tr({ className: "" }, [
        td({ className: rowStyle }, "Meal"),
        td({ className: rowStyle }, "Calories"),
      ]),
    ]),
    br({}),
    p({className: "text-xl font-bold " }, `Calories Total: ${caloriesTotal}`)
  ]);
}

function update(msg, model) {
  switch (msg) {
    case MSGS.saveButton:
      const table = document.getElementById("table");
      const row = table.insertRow(-1);
      const meal = row.insertCell(-1);
      const calories = row.insertCell(-1);
      const deleteRow = row.insertCell(-1);
      const deleteButton = document.createElement("button");
      deleteRow.appendChild(deleteButton);

      meal.className = dataRowStyle;
      calories.className = dataRowStyle;
      deleteButton.className = deleteButtonStyle;

      deleteButton.addEventListener("click", function(event) {
        const td = event.target.parentNode; 
        const tr = td.parentNode;
        tr.parentNode.removeChild(tr);
      });

      meal.innerText = document.getElementById("nameInput").value;
      calories.innerText = document.getElementById("caloriesInput").value;
      deleteButton.innerText = "Delete";
      return model;
    case MSGS.total:
      caloriesTotal + model.currentCalories;
      return model ;
    case MSGS.cancleButton:
      return model;
    default:
      return model;
  }
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  currentMeal: "",
  currentCalories: ""
};

const caloriesTotal = 0;

const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);