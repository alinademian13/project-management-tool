'use strict';

const users = getArrayFromLocalStorage('users');

const sprints = getArrayFromLocalStorage('sprints');

let issues = getArrayFromLocalStorage('issues');

function reloadTable() {
    var tbody = document.getElementById("issues-table").getElementsByTagName('tbody')[0];

    tbody.innerHTML = "";

    for (var i = 0; i < issues.length; i++) {
        var row = tbody.insertRow(i);
        var idCell = row.insertCell(0);
        var typeCell = row.insertCell(1);
        var nameCell = row.insertCell(2);
        var sprintCell = row.insertCell(3);
        var createdByCell = row.insertCell(4);
        var assigneeCell = row.insertCell(5);
        var descriptionCell = row.insertCell(6);
        var statusCell = row.insertCell(7);
        var tasksCell = row.insertCell(8);
        var commentsCell = row.insertCell(9);
        var updatedAtCell = row.insertCell(10);
        var createdAtCell = row.insertCell(11);
        var btnUpdate = row.insertCell(12);

        var type = findObjectById(issues[i].type, types);
        var sprint = findObjectById(issues[i].sprint, sprints);
        var createdBy = findObjectById(issues[i].createdBy, users);
        var assignee = findObjectById(issues[i].assignee, users);
        var status = findObjectById(issues[i].status, statuses);

        var subtasksNames = [];

        for (var j = 0; j < issues[i].subtasks.length; j++) {
            var subtaskId = issues[i].subtasks[j];
            var subtask = findObjectById(subtaskId, issues);

            subtasksNames.push(subtask.name);
        }

        idCell.innerHTML = issues[i].id;
        typeCell.innerHTML = type.name;
        nameCell.innerHTML = issues[i].name;
        sprintCell.innerHTML = sprint.sprintName;
        createdByCell.innerHTML = createdBy.userName;
        assigneeCell.innerHTML = assignee.userName;
        descriptionCell.innerHTML = issues[i].description;
        statusCell.innerHTML = status.name;
        tasksCell.innerHTML = subtasksNames.join('; ');
        commentsCell.innerHTML = "";
        updatedAtCell.innerHTML = issues[i].updatedAt;
        createdAtCell.innerHTML = issues[i].createdAt;
        btnUpdate.innerHTML = '<button type="button" class="btn btn-primary btn-sm active" onclick="editRow()">Update</button>';
    }
}

function addIssue() {
    var tfoot = document.getElementById('issues-table').getElementsByTagName('tfoot')[0];

    var fields = tfoot.querySelectorAll('[name]');

    var issue = {};

    for (var i = 0; i < fields.length; i++) {
        if (fields[i].name === "subtasks") {
            var subtasks = Array.from(fields[i].querySelectorAll('option:checked'), o => o.value);

            issue[fields[i].name] = subtasks;
        } else {
            issue[fields[i].name] = fields[i].value.trim();
        }
    }

    issue.id = issues.length + 1;
    issue.createdAt = issue.updatedAt = new Date();

    issues.push(issue);

    setArrayToLocalStorage('issues', issues);

    reloadTable();
    refreshSubtasks();
}

function populateDropdowns() {
    var sprintDropdown = document.getElementById('sprint-dropdown');

    for (var i = 0; i < sprints.length; i++) {
        sprintDropdown.options[i] = new Option(sprints[i].sprintName, sprints[i].id);
    }

    var createdByDropdown = document.getElementById('created-by-dropdown');
    var assigneeDropdown = document.getElementById('assignee-dropdown');

    for (var i = 0; i < users.length; i++) {
        createdByDropdown.options[i] = new Option(users[i].userName, users[i].id);
        assigneeDropdown.options[i] = new Option(users[i].userName, users[i].id);
    }

    var statusDropdown = document.getElementById('status-dropdown');

    for (var i = 0; i < statuses.length; i++) {
        statusDropdown.options[i] = new Option(statuses[i].name, statuses[i].id);
    }

    var typeDropdown = document.getElementById('type-dropdown');

    for (var i = 0; i < types.length; i++) {
        typeDropdown.options[i] = new Option(types[i].name, types[i].id);
    }

    refreshSubtasks();
}

function refreshSubtasks() {
    var subtasksDropdown = document.getElementById('subtasks-dropdown');

    var tasks = issues.filter(issue => {
        return issue.type === TYPE_TASK;
    });

    for (var i = 0; i < tasks.length; i++) {
        subtasksDropdown.options[i] = new Option(tasks[i].name, tasks[i].id);
    }
}

function changeType() {
    var typeDropdown = document.getElementById('type-dropdown');
    var subtasksDropdown = document.getElementById('subtasks-dropdown');

    subtasksDropdown.disabled = typeDropdown.value === TYPE_TASK;

    if (typeDropdown.value === TYPE_TASK) {
        refreshSubtasks();
    }
}

function filter() {

    var filter = event.target.value.toUpperCase();
    var rows = document.querySelector("#issues-table tbody").rows;

    for (var i = 0; i < rows.length; i++) {
        var firstCol = rows[i].cells[3].textContent.toUpperCase();
        var secondCol = rows[i].cells[7].textContent.toUpperCase();
        if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function findObjectById(id, objects) {
    return objects.find(object => {
        return object.id == id;
    });
}

function editRow() {
    const row = event.target.parentNode.parentNode;

    var typeCell = row.cells[1];
    var nameCell = row.cells[2];
    var sprintCell = row.cells[3];
    var createdByCell = row.cells[4];
    var assigneeCell = row.cells[5];
    var descriptionCell = row.cells[6];
    var statusCell = row.cells[7];
    var tasksCell = row.cells[8];
    var buttonCell = row.cells[12];

    typeCell.innerHTML = '<select id="type-dropdown" name="type" value=""></select>';
    nameCell.innerHTML = '<input type="text" name="name" />';
    sprintCell.innerHTML = '<select id="sprint-dropdown" name="sprint"></select>';
    createdByCell.innerHTML = '<select id="created-by-dropdown" name="createdBy"></select>';
    assigneeCell.innerHTML = '<select id="assignee-dropdown" name="assignee"></select>';
    descriptionCell.innerHTML = '<input type="text" name="description" />';
    statusCell.innerHTML = '<select id="status-dropdown" disabled name="status"></select>';
    tasksCell.innerHTML = '<select id="subtasks-dropdown" multiple name="subtasks"></select>';
    buttonCell.innerHTML = '<button type="button" class="btn btn-primary btn-sm active" onclick="save()">Save</button>';
}

function save() {
    const row = event.target.parentNode.parentNode;
    const idCell = row.cells[0];
    const id = idCell.textContent;

    var searchedIndex = -1;

    for (var i = 0; i < issues.length; i++) {
        if (issues[i].id == id) {
            searchedIndex = i;
        }
    }

    if (searchedIndex === -1) {
        return;
    }

    var newIssue = {};

    // var newIssue = {
    //     id: id,
    //     assignee: "3",
    //     createdBy: "1",
    //     description: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    //     name: "Task 1 edited",
    //     sprint: "3",
    //     status: "1",
    //     subtasks: [],
    //     type: "TASK",
    //     updatedAt: new Date()
    // };

    issues.splice(searchedIndex, 1, newIssue);

    setArrayToLocalStorage('issues', issues);

    reloadTable();
}
