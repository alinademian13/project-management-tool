'use strict';

function reloadTable() {
    var tbody = document.getElementById("sprints-table").getElementsByTagName('tbody')[0];

    tbody.innerHTML = "";

    var sprints = getArrayFromLocalStorage('sprints');

    for (var i = 0; i < sprints.length; i++) {
        var row = tbody.insertRow(i);
        var idCell = row.insertCell(0);
        var nameCell = row.insertCell(1);

        idCell.innerHTML = sprints[i].id;
        nameCell.innerHTML = sprints[i].sprintName;
    }
}

function addSprint() {
    var input = document.querySelector("input[name='sprintName']");
    var sprintName = input.value.trim();

    if (sprintName.length === 0) {
        alert('Name cannot be empty.');

        return;
    }

    var sprints = getArrayFromLocalStorage('sprints');
    var newSprint = {
        id: sprints.length + 1,
        sprintName: input.value
    };

    sprints.push(newSprint);

    setArrayToLocalStorage('sprints', sprints);

    input.value = "";

    reloadTable();
}
