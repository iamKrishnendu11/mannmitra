// controllers/classes.controller.js
import YogaClass from '../models/class.model.js';


export const listClasses = async (req, res) => {
  try {
    const { type, limit = 50, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { instructor: regex }];
    }

    const items = await YogaClass.find(filter).sort({ created_date: -1 }).limit(Number(limit));
    return res.json(items);
  } catch (err) {
    console.error('listClasses error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getClassById = async (req, res) => {
  try {
    const item = await YogaClass.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Class not found' });
    return res.json(item);
  } catch (err) {
    console.error('getClassById error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const createClass = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title || !payload.type || !payload.duration_minutes) {
      return res.status(400).json({ message: 'title, type and duration_minutes required' });
    }
    const created = await YogaClass.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createClass error', err);
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
};


export const updateClass = async (req, res) => {
  try {
    const updated = await YogaClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Class not found' });
    return res.json(updated);
  } catch (err) {
    console.error('updateClass error', err);
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
};


export const deleteClass = async (req, res) => {
  try {
    const removed = await YogaClass.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Class not found' });
    return res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    console.error('deleteClass error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
