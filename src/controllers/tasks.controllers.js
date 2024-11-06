import Task from "../models/task.model.js";
import generateOccurrences from "../libs/generateOcurrences.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      taskDate,
      startTime,
      isRecurring,
      recurringDays,
      endTime,
      recurringEndDate,
    } = req.body;

    const generatedOcurrences = generateOccurrences(req.body);
    console.log(generatedOcurrences);

    const newTask = new Task({
      title,
      description,
      taskDate,
      startTime,
      endTime,
      isRecurring,
      recurringDays,
      recurringEndDate,
      recurrences: generatedOcurrences,
      user: req.user.id,
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const {
      _id,
      title,
      description,
      taskDate,
      startTime,
      status,
      isRecurring,
      recurringDays,
      endTime,
      recurringEndDate,
      recurrences,
      createdAt,
      updatedAt,
      user
    } = req.body;

    
    const generatedOcurrences = generateOccurrences(req.body)

    const newTask = {
      _id,
      title,
      description,
      taskDate,
      startTime,
      endTime,
      status,
      isRecurring,
      recurringDays,
      recurringEndDate,
      recurrences: recurrences? recurrences : generatedOcurrences,
      createdAt,
      updatedAt,
      user
    };
    console.log("body",req.body)
    console.log("new",newTask)

    const taskUpdated = await Task.findByIdAndUpdate(req.params.id, newTask, {
      new: true,
    });
    if (!taskUpdated)
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    return res.json(taskUpdated);
  } catch (error) {
    return res.json(500).json([error.message]);
  }
};
