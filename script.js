// Model of the cats
model = {
    catData: [
        // Cat name, Number of clicks of cat, Nicknames
        // Cat name: string
        // Number of clicks of cat: integer
        // Nicknames: array of string
        { name: "Cute Cat", clicks: 0, nicknames: ["Cutie", "Little", "CC"] },
        { name: "Hiding Cat", clicks: 0, nicknames: ["Shadow", "Phantom"] },
        { name: "Five Cats", clicks: 0, nicknames: ["Five Cats on grass", "Cat Pack"] },
        { name: "Green-eyed Cat", clicks: 0, nicknames: ["Emerald", "Greeny"] },
        { name: "Cat and Butterfly", clicks: 0, nicknames: ["Hunter", "Jumper", "Leaper"] },
        { name: "Cat Twins", clicks: 0, nicknames: ["Sleeping Beauties", "Twins"] },
    ],
}

function Cat(id) {
    // Create new cat from model.catData
    let self = this;

    self.name = ko.observable(model.catData[id].name);
    self.clicks = ko.observable(model.catData[id].clicks);
    self.nicknames = ko.observable(model.catData[id].nicknames);
}

function AppViewModel() {
    let self = this;

    // Create catData
    self.catData = ko.observableArray();
    for (let i = 0; i < model.catData.length; ++i) {
        self.catData.push(new Cat(i));
    }

    // Get current cat's properties
    self.currentCatId = ko.observable(0);
    self.currentCatName = ko.pureComputed(function() {
        return self.catData()[self.currentCatId()].name;
    }, self);
    self.currentCatClicks = ko.pureComputed(function() {
        return self.catData()[self.currentCatId()].clicks;
    }, self);
    self.currentCatNicknames = ko.pureComputed(function() {
        return self.catData()[self.currentCatId()].nicknames;
    }, self);

    // Handle click on cat list item
    self.setCurrentCatId = function(data, event) {
        let listItem = event.target;
        let id = listItem.id[listItem.id.length - 1];
        self.currentCatId(parseInt(id));

        if (viewAdmin.on) {
            viewAdmin.renderTurnOn();
        }
    };

    // Handle click on cat's image
    self.increaseCatClicks = function() {
        let clicks = self.catData()[self.currentCatId()].clicks;
        clicks(parseInt(clicks()) + 1);

        if (viewAdmin.on) {
            viewAdmin.renderTurnOn();
        }
    };

    // Admin button
    self.handleClickAdmin = function() {
        viewAdmin.renderTurnOn();
    };
};

let vm = new AppViewModel()
ko.applyBindings(vm);

// View of Admin area
let viewAdmin = {
    adminButton: document.getElementById("admin-button"),
    adminArea: document.getElementById("admin-area"),
    on: false,

    renderTurnOn: function () {
        viewAdmin.on = true;

        // Clear all
        viewAdmin.adminArea.innerHTML = "";

        let catName = vm.catData()[vm.currentCatId()].name();
        let catClicks = vm.catData()[vm.currentCatId()].clicks();

        let fragment = document.createDocumentFragment();

        // Input cat name
        let labelCatName = document.createElement("label");
        labelCatName.className = "font-weight-bold";
        labelCatName.textContent = "Cat's name:";
        let inputCatName = document.createElement("input");
        inputCatName.type = "text";
        inputCatName.className = "form-control";
        inputCatName.id = "input-cat-name";
        inputCatName.value = catName;
        fragment.appendChild(labelCatName);
        fragment.appendChild(inputCatName);

        // Input cat image
        let labelCatClicks = document.createElement("label");
        labelCatClicks.className = "font-weight-bold";
        labelCatClicks.textContent = "Cat's number of clicks:";
        let inputCatClicks = document.createElement("input");
        inputCatClicks.type = "number";
        inputCatClicks.className = "form-control";
        inputCatClicks.id = "input-cat-clicks";
        inputCatClicks.min = "0";
        inputCatClicks.value = catClicks;
        fragment.appendChild(labelCatClicks);
        fragment.appendChild(inputCatClicks);

        // Cancel button
        let cancelButton = document.createElement("button");
        cancelButton.className = "btn btn-secondary m-2";
        cancelButton.id = "cancel-button";
        cancelButton.textContent = "Cancel";
        fragment.appendChild(cancelButton);

        // Save button
        let saveButton = document.createElement("button");
        saveButton.className = "btn btn-success m-2";
        saveButton.id = "save-button";
        saveButton.textContent = "Save";
        fragment.appendChild(saveButton);

        viewAdmin.adminArea.appendChild(fragment);

        // Add data-bind for buttons
        $("#cancel-button").attr("onclick", "viewAdmin.renderTurnOff()");
        $("#save-button").attr("onclick", "viewAdmin.save()");
    },

    renderTurnOff: function() {
        viewAdmin.on = false;

        // Clear all
        viewAdmin.adminArea.innerHTML = "";
    },

    save: function() {
        // Get data from the form
        let inputCatName = document.getElementById("input-cat-name");
        let inputCatClicks = document.getElementById("input-cat-clicks");
        let catName = inputCatName.value;
        let catClicks = inputCatClicks.value;

        vm.catData()[vm.currentCatId()].name(catName);
        vm.catData()[vm.currentCatId()].clicks(catClicks);

        console.log(vm.catData()[vm.currentCatId()].clicks());

        viewAdmin.renderTurnOff();
    },
}