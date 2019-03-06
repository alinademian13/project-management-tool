'use strict';

const TYPE_FEATURE = 'FEATURE';
const TYPE_BUG = 'BUG';
const TYPE_TASK = 'TASK';

const types = [
    { id: TYPE_FEATURE, name: 'Feature' },
    { id: TYPE_BUG, name: 'Bug' },
    { id: TYPE_TASK, name: 'Task' }
];

const statuses = [
    { id: 1, name: 'New'},
    { id: 2, name: 'In progress' },
    { id: 3, name: 'Feedback' },
    { id: 4, name: 'Rework' },
    { id: 5, name: 'Resolved' },
    { id: 6, name: 'Ready for testing' }
];
