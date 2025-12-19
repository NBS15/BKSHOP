import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
// Mock database
let messages = [];
// GET all messages
router.get('/', (req, res) => {
    res.json(messages);
});
// GET unread messages
router.get('/unread', (req, res) => {
    const unreadMessages = messages.filter((m) => m.status === 'unread');
    res.json(unreadMessages);
});
// GET single message
router.get('/:id', (req, res) => {
    const message = messages.find((m) => m.id === req.params.id);
    if (!message) {
        return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
});
// POST new message
router.post('/', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newMessage = {
        id: uuidv4(),
        name,
        email,
        phone: phone || '',
        subject,
        message,
        date: new Date(),
        status: 'unread',
    };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});
// PUT mark as read
router.put('/:id/read', (req, res) => {
    const { id } = req.params;
    const messageIndex = messages.findIndex((m) => m.id === id);
    if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
    }
    messages[messageIndex].status = 'read';
    res.json(messages[messageIndex]);
});
// DELETE message
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const messageIndex = messages.findIndex((m) => m.id === id);
    if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
    }
    const deletedMessage = messages.splice(messageIndex, 1);
    res.json(deletedMessage[0]);
});
export default router;
//# sourceMappingURL=messages.js.map