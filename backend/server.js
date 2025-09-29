const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/Practical-Fullstack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define Todo schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Model
const Todo = mongoose.model('todoapps', todoSchema);

// Routes

// GET all todos
app.get('/', async (req, res) => {
  try {
    console.log('📥 GET request received - fetching todos');
    const todos = await Todo.find().sort({ createdAt: -1 });
    console.log(`✅ Sending ${todos.length} todos`);
    res.json(todos);
  } catch (err) {
    console.error('❌ Error fetching todos:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create todo
app.post('/', async (req, res) => {
  try {
    console.log('📤 POST request received:', req.body);
    const { title, description, completed } = req.body;
    const newTodo = new Todo({ 
      title, 
      description, 
      completed: completed || false 
    });
    const savedTodo = await newTodo.save();
    console.log('✅ Todo created:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error('❌ Error creating todo:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update todo
app.put('/', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    console.log('🔄 PUT request received - ID:', id, 'Data:', updateData);
    
    if (!id) {
      return res.status(400).json({ error: 'Todo ID is required' });
    }
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    console.log('✅ Todo updated:', updatedTodo);
    res.json(updatedTodo);
  } catch (err) {
    console.error('❌ Error updating todo:', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    console.log('🗑️ DELETE request received - ID:', id);
    
    if (!id) {
      return res.status(400).json({ error: 'Todo ID is required' });
    }
    
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    console.log('✅ Todo deleted:', deletedTodo);
    res.json({ message: 'Todo deleted', deletedTodo });
  } catch (err) {
    console.error('❌ Error deleting todo:', err);
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Ready to accept todos!`);
});