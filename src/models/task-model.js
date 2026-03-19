export class TaskModel {
    id;
    title;
    description;
    status;
    priority;
    dueDate;
    createdAt;
    assignedTo;
    constructor(id, title, description, status, assignedTo, priority, dueDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdAt = new Date();
        this.assignedTo = assignedTo;
    }
}