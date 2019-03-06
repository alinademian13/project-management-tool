'use strict';

const sprints = getArrayFromLocalStorage('sprints');
const issues = getArrayFromLocalStorage('issues');

function reloadTable() {
    var tbody = document.getElementById("overview-table").getElementsByTagName('tbody')[0];

    for (var i = 0; i < sprints.length; i++) {
        var sprint = sprints[i];

        var sprintIssues = issues.filter(issue => {
            return issue.sprint == sprint.id;
        });

        var row = tbody.insertRow(i);

        var sprintCell = row.insertCell(0);

        var cellIndex = 1;

        for (var j = 0; j < types.length; j++) {
            var type = types[j];

            for (var k = 0; k < statuses.length; k++) {
                var status = statuses[k];

                var col = row.insertCell(cellIndex);

                var filteredIssues = sprintIssues.filter(issue => {
                    return issue.type == type.id && issue.status == status.id;
                });

                col.innerHTML = filteredIssues.length;

                cellIndex++;
            }
        }

        sprintCell.innerHTML = sprint.sprintName;
    }
}
