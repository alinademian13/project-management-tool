'use strict';

function reloadTable() {
    var tbody = document.getElementById("users-table").getElementsByTagName('tbody')[0];

    tbody.innerHTML = "";

    var users = getArrayFromLocalStorage('users');

    for (var i = 0; i < users.length; i++) {
        var row = tbody.insertRow(i);
        var idCell = row.insertCell(0);
        var nameCell = row.insertCell(1);

        idCell.innerHTML = users[i].id;
        nameCell.innerHTML = users[i].userName;
    }
}

function addUser() {
    var input = document.querySelector("input[name='userName']");
    var userName = input.value.trim();

    if (userName.length === 0) {
        alert('Name cannot be empty.');

        return;
    }

    var users = getArrayFromLocalStorage('users');
    var newUser = {
        id: users.length + 1,
        userName: input.value
    };

    users.push(newUser);

    setArrayToLocalStorage('users', users);

    input.value = "";

    reloadTable();
}
