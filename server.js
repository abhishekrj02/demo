//const express = require("express");
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Todo = mongoose.model("Todo", todoSchema);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// let todos = [
//     { id: 1, task: "Learn Node.js", completed: false },
//     { id: 2, task: "Build an API", completed: false },

// ];

// GET all todos
app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/todos", async (req, res) => {
    // const newTodo = {
    //     id: todos.length + 1,
    //     task: newTask,
    //     completed: newCompleted
    // };
    const newTodo = new Todo({
        task: req.body.task,
    });
    await newTodo.save();

    // todos.push(newTodo);
    res.status(201).json({ message: "Todo added successfully", todo: newTodo });
});

// PUT (Update) a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(202).json({
            message: "Updated successfully",
            todo: updatedTodo,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put("/todos", (req, res) => {
    const id = req.body.id;
    const task = req.body.task;
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    todo.task = task;
    todo.completed = req.body.completed; // Update logic

    res.status(201).json({ status: "sb bhadhiya ho gya", todo: todo });
});

// DELETE a todo
app.delete("/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
