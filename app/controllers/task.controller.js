const db = require("../models");
const Tasks = db.tasks;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tasks } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tasks, totalPages, currentPage };
};

// Create and Save a new Task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can not be empty.",
    });
    return;
  }

  // Create a Task
  const task = {
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted ? req.body.isCompleted : false,
  };

  // Save Task in the database
  Tasks.create(task)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while creating the task.",
      });
    });
};

// Retrieve all Tasks from the database.
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  const { limit, offset } = getPagination(page, size);

  Tasks.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving the tasks.",
      });
    });
};

// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tasks.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving task with id:" + id + ".",
      });
    });
};

// Update a Task by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tasks.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Task was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update task with id:${id}. It may not exist.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating task id:" + id + ".",
      });
    });
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tasks.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Task was deleted successfully.",
        });
      } else {
        res.send({
          message: `Cannot delete task with id:${id}. It may not exist.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete task with id=" + id,
      });
    });
};

// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {
  Tasks.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Task(s) were deleted successfully.` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while removing all tasks.",
      });
    });
};

// find all completed Tasks
exports.findAllCompleted = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Tasks.findAndCountAll({ where: { isCompleted: true }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving tasks.",
      });
    });
};
