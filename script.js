// Model of the cats
model = {
    catData: [
        // Cat name, Number of clicks of cat, Nicknames
        // Cat name: string
        // Number of clicks of cat: integer
        // Nicknames: array of string
        ["Cute Cat", 0, ["Cutie", "Little", "CC"] ],
        ["Hiding Cat", 0, ["Shadow", "Phantom"] ],
        ["Five Cats", 0, ["Five Cats on grass", "Cat Pack"] ],
        ["Green-eyed Cat", 0, ["Emerald", "Greeny"] ],
        ["Cat and Butterfly", 0, ["Hunter", "Jumper", "Leaper"] ],
        ["Cat Twins", 0, ["Sleeping Beauties", "Twins"] ],
    ],

    currentCatId: null,

    increaseCatClicks: function(i) {
        model.catData[i][1] += 1
    },

    setCurrentCatId: function(id) {
        model.currentCatId = id;
    },

    setCatName: function(id, name) {
        model.catData[id][0] = name;
    },

    setCatClicks: function(id, clicks) {
        model.catData[id][1] = parseInt(clicks);
    },
}

// Dom elements
let catList = document.getElementById("cat-list");
let catDisplayArea = document.getElementById("cat-display-area");
let adminArea = document.getElementById("admin-area");

// Octopus
let octopus = {
    init: function() {
        // Initialize views
        viewCatList.init();
        viewCatDisplayArea.init();
        viewAdmin.init();
    },

    getCurrentCatId: function() {
        return model.currentCatId;
    },

    setCurrentCatId: function(id) {
        model.setCurrentCatId(id);
    },

    getCatName: function (i) {
        let catName = model.catData[i][0];
        return catName;
    },

    setCatName: function(id, name) {
        model.setCatName(id, name);
    },

    getCatClicks: function(i) {
        let clicks = model.catData[i][1];
        return clicks;
    },

    setCatClicks: function(id, clicks) {
        model.setCatClicks(id, clicks);
    },

    increaseCatClicks: function(i) {
        model.increaseCatClicks(i);
    },

    getCatDataLength: function() {
        return model.catData.length;
    },

    getCatNicknames: function(id) {
        return model.catData[id][2];
    },
}

// View of Cat list
let viewCatList = {
    init: function () {
        viewCatList.renderCatList();
        viewCatList.handleClick();
    },

    renderCatList: function () {
        // Clear all
        catList.innerHTML = "";

        // Add items into cat-list
        let fragment = document.createDocumentFragment();  // Document fragment to reduce reflow and repaint
        let catDataLength = octopus.getCatDataLength();
        for (let i = 0; i < catDataLength; ++i) {
            let catName = octopus.getCatName(i);
            let catListItem = document.createElement("li");
            catListItem.textContent = catName;
            catListItem.className = "cat-list-item";
            catListItem.id = "cat-" + i;
            fragment.appendChild(catListItem);
        }
        catList.appendChild(fragment);
    },

    // Handle click on cat-list-item
    handleClick: function() {
        let fragment = document.createDocumentFragment();  // Document fragment to reduce reflow and repaint
        catList.addEventListener("click", function (event) {
            let target = event.target;
            if (target.tagName === "LI") {
                let i = target.id[target.id.length - 1];  // i is the last letter of target's id
                // Example: target's id is "cat-3" then i = 3

                octopus.setCurrentCatId(i);

                viewCatDisplayArea.renderCatImage(i, fragment);  // Call other view
                if (viewAdmin.on) {
                    // Re-render view of admin area
                    viewAdmin.renderTurnOn();  // Call other view
                }
            }
        });
    },
}

// View of Cat display area
let viewCatDisplayArea = {
    init: function() {
        viewCatDisplayArea.displayingCatImage = false;

        viewCatDisplayArea.handleClick();
    },

    renderNumberOfClicks: function(i) {
        let numClick = catDisplayArea.querySelector(".num-click");
        octopus.increaseCatClicks(i);
        clicks = octopus.getCatClicks(i);
        numClick.textContent = clicks;
    },

    renderCatImage: function (i, fragment) {
        viewCatDisplayArea.displayingCatImage = true;

        // Clear all
        while (catDisplayArea.lastChild) {
            catDisplayArea.removeChild(catDisplayArea.lastChild);
        }

        let catName = octopus.getCatName(i);

        // Create h3 that contain cat name
        let nameContainer = document.createElement("h3");
        nameContainer.textContent = catName;
        fragment.appendChild(nameContainer);

        // Create cat image
        let catImage = document.createElement("img");
        catImage.className = "cat-image";
        catImage.id = "cat-image-" + i;
        catImage.src = `images/cat${i}.jpg`;
        catImage.alt = catName + " Image";
        fragment.appendChild(catImage);

        // Create number of clicks
        let numClick = document.createElement("h4");
        let clicks = octopus.getCatClicks(i);
        numClick.innerHTML = `Number of clicks: <span class="num-click">${clicks}</span>`;
        fragment.appendChild(numClick);

        // Create nicknames
        let nicknamesHeading = document.createElement("h4");
        nicknamesHeading.textContent = "Cat's nicknames:";
        fragment.appendChild(nicknamesHeading);
        let nicknamesList = document.createElement("ul");
        nicknamesList.id = "nicknames-list";
        nicknamesList.setAttribute("data-bind", "foreach: nicknames")
        let nicknamesListItem = document.createElement("li");
        nicknamesListItem.setAttribute("data-bind", "text: $data")
        nicknamesList.appendChild(nicknamesListItem);
        fragment.appendChild(nicknamesList);

        catDisplayArea.appendChild(fragment)

        // Apply binding for cat's nicknames
        ko.applyBindings({
            nicknames: octopus.getCatNicknames(i),
        }, document.getElementById("nicknames-list"));
    },

    handleClick: function () {
        // Handle click on cat-image
        catDisplayArea.addEventListener("click", function (event) {
            let target = event.target;
            if (target.className === "cat-image") {
                let i = octopus.getCurrentCatId();

                viewCatDisplayArea.renderNumberOfClicks(i);

                if (viewAdmin.on) {
                    // Re-render view of admin area
                    viewAdmin.renderTurnOn();  // Call other view
                }
            }
        });
    },
}

// View of Admin area
let viewAdmin = {
    init: function() {
        viewAdmin.adminButton = document.getElementById("admin-button");
        viewAdmin.on = false;

        viewAdmin.handleClickAdmin();
    },

    renderTurnOn: function () {
        if (! viewCatDisplayArea.displayingCatImage) {
            return;
        }

        viewAdmin.on = true;

        // Clear all
        adminArea.innerHTML = "";

        i = octopus.getCurrentCatId();
        if (i == null) {
            return;
        }
        
        let catName = octopus.getCatName(i);
        let catClicks = octopus.getCatClicks(i);

        let fragment = document.createDocumentFragment();

        let form = document.createElement("form");

        // Input cat name
        let labelCatName = document.createElement("label");
        labelCatName.className = "font-weight-bold";
        labelCatName.textContent = "Cat's name:";
        let inputCatName = document.createElement("input");
        inputCatName.type = "text";
        inputCatName.className = "form-control";
        inputCatName.id = "input-cat-name";
        inputCatName.value = catName;
        form.appendChild(labelCatName);
        form.appendChild(inputCatName);

        // Input cat image
        let labelCatClicks = document.createElement("label");
        labelCatClicks.className = "font-weight-bold";
        labelCatClicks.textContent = "Cat's number of clicks:";
        let inputCatClicks = document.createElement("input");
        inputCatClicks.type = "text";
        inputCatClicks.className = "form-control";
        inputCatClicks.id = "input-cat-clicks";
        inputCatClicks.value = catClicks;
        form.appendChild(labelCatClicks);
        form.appendChild(inputCatClicks);

        // Cancel button
        let cancelButton = document.createElement("button");
        cancelButton.className = "btn btn-secondary m-2";
        cancelButton.id = "cancel-button";
        cancelButton.textContent = "Cancel";
        form.appendChild(cancelButton);

        fragment.appendChild(form);

        adminArea.appendChild(fragment);

        // Save button
        let saveButton = document.createElement("button");
        saveButton.className = "btn btn-success m-2";
        saveButton.id = "save-button";
        saveButton.textContent = "Save";
        form.appendChild(saveButton);

        fragment.appendChild(form);

        adminArea.appendChild(fragment);

        // Update value for buttons
        viewAdmin.cancelButton = document.getElementById("cancel-button");
        viewAdmin.saveButton = document.getElementById("save-button");

        viewAdmin.handleClickCancel();
        viewAdmin.handleClickSave();
    },

    renderTurnOff: function() {
        viewAdmin.on = false;

        // Clear all
        adminArea.innerHTML = "";
    },

    handleClickAdmin: function() {
        viewAdmin.adminButton.addEventListener("click", function() {
            viewAdmin.renderTurnOn();
        });
    },

    handleClickCancel: function() {
        viewAdmin.cancelButton.addEventListener("click", function() {
            viewAdmin.renderTurnOff();
        });
    },

    handleClickSave: function() {
        viewAdmin.saveButton.addEventListener("click", function() {
            // Get data form the form
            let inputCatName = document.getElementById("input-cat-name");
            let inputCatClicks = document.getElementById("input-cat-clicks");
            let catName = inputCatName.value;
            let catClicks = inputCatClicks.value;

            // Get currentCatId
            let i = octopus.getCurrentCatId();

            // Send data to octopus and make the changes for the model
            octopus.setCatName(i, catName);
            octopus.setCatClicks(i, catClicks);

            viewAdmin.renderTurnOff();
            viewCatList.renderCatList();
            let fragment = document.createDocumentFragment();
            viewCatDisplayArea.renderCatImage(i, fragment);
        });
    },
}

// Main
octopus.init();