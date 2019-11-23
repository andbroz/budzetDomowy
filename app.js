/** ------------------------------------------------
 * BUDGET CONTROLLER
 */
const budgetController = (function() {
  // some code
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
  const DOM = UICtrl.getDOMStrings();

  const ctrlAddItem = function() {
    // TODO
    // Get the field input data
    const input = UICtrl.getInput();
    console.log(input);

    // Add the item to the budget controller
    // Add the item to the UI
    // Cakcukate the budget
    // Display the budget on the UI
  };

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
