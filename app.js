/** ------------------------------------------------
 * BUDGET CONTROLLER
 */
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
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
    budget: 0,
    percentage: -1,
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
    deleteItem: function(type, id) {
      let ids, index;

      ids = data.allItems[type].map(function(cur) {
        return cur.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        // remove element
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that was spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      /*
       * a = 20
       * b = 10
       * c = 40
       * income = 100
       * percentages
       * a = 20/100 => 20%
       * b = 10/100 => 10%
       * c = 40/100 => 40%
       */

      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      let allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
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
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
  };

  /**
   * @description Formats number according to rules
   *  - sign before a number + or -
   *  - exactly 2 decimal places
   *  - comma separating thousands
   * @param {Number} num number to be formatted
   * @param {String} type expense 'exp' or income 'inc'
   * @returns {String} a formmated number in string format example +1,234.00
   */
  const formatNumber = function(num, type) {
    let int, dec, numSplit;
    num = Math.abs(num); // remove any existing sign
    num = num.toFixed(2); // format to 2 decimal places as String
    numSplit = num.split('.'); // separates integer part and decimal part

    /**@type {String} */
    int = numSplit[0];

    dec = numSplit[1];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    return (type === 'inc' ? '+ ' : '- ') + int + '.' + dec;
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will be either "inc" or "exp"
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    addListItem: function(obj, type) {
      let html, newHtml, element;
      // create html string with placeholder text
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description" >%description%</div ><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function(selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields: function() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ',' + DOMStrings.inputValue,
      );
      fieldsArr = Array.prototype.slice.call(fields);

      // eslint-disable-next-line no-unused-vars
      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });
      fieldsArr[0].focus();
    },
    /**@description Display budget on UI
     * @param {Object} obj object containing budget data
     */
    displayBudget: function(obj) {
      let type;
      obj.budget >= 0 ? (type = 'inc') : (type = 'exp');
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type,
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        'inc',
      );
      document.querySelector(
        DOMStrings.expensesLabel,
      ).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > -1) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },
    /**
     * Display percentages for expenses on UI
     * @param {Number[]} percentages Array containing calculated percentages
     */
    displayPercentages: function(percentages) {
      /**@type {HTMLElement} */
      let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      /**
       *
       * @param {*} list list of nodes
       * @param {*} callback function called on each node
       */
      const nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        //update percentages
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },
    /**
     * @description gets DOMStrings object
     */
    getDOMStrings: function() {
      /** @type {Object} */
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

    // attach to delete btn
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  const updateBudget = function() {
    let budget;
    // Cakcukate the budget
    budgetCtrl.calculateBudget();
    // Return the budget
    budget = budgetCtrl.getBudget();
    // Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function() {
    // calculate the percentages
    budgetCtrl.calculatePercentages();
    // read percentages from budget controller
    let percentages = budgetCtrl.getPercentages();
    // update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function() {
    let input, newItem;

    // TODO
    // Get the field input data
    input = UICtrl.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // clear the fields
      UIController.clearFields();
      // calculate and update budget
      updateBudget();

      //update percentages
      updatePercentages();
    }
  };
  const ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;
    // deletes element from list
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // delete item from data structure
      budgetCtrl.deleteItem(type, ID);
      // delete item from user interfase
      UICtrl.deleteListItem(itemID);
      // update and show new budget
      updateBudget();
      //update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('App has started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
