/** ------------------------------------------------
 * BUDGET CONTROLLER
 */
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;
      //select last element of array of type inc or exp and get id of last element
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      // Push it into data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },
    testing: function() {
      console.log(data);
    },
  };
})();

/** ------------------------------------------------
 * UI CONTROLLER
 */
const UIController = (function() {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will be either "inc" or "exp"
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
  };
})();

/** ------------------------------------------------
 * GLOBAL APP CONTROLLER
 */
const controller = (function(budgetCtrl, UICtrl) {
  const setupEventListeners = function() {
    const DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = function() {
    let input, newItem;

    // TODO
    // Get the field input data
    input = UICtrl.getInput();

    // Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // Add the item to the UI
    // Cakcukate the budget
    // Display the budget on the UI
  };

  return {
    init: function() {
      console.log('App has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
