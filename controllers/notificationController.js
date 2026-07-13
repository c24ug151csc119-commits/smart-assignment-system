const db = require('../config/db');

// Get notifications for logged-in user
exports.getMyNotifications = (req, res) => {
  const user_id = req.user.user_id;
  db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching notifications', error: err.message });
    res.json(results);
  });
};

// Mark a notification as read
exports.markAsRead = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE notifications SET is_read = TRUE WHERE notification_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating notification', error: err.message });
    res.json({ message: 'Notification marked as read' });
  });
};