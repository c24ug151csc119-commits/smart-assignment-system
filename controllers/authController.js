const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, rollOrStaffId, collegeName, course_id, semester_id } = req.body;

    if (!name || !email || !password || !role || !rollOrStaffId || !collegeName) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if this roll/staff ID exists in the valid_ids table with matching role
    const checkSql = 'SELECT * FROM valid_ids WHERE roll_or_staff_id = ? AND role = ?';
    db.query(checkSql, [rollOrStaffId, role], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }

      if (results.length === 0) {
        return res.status(403).json({ message: 'You are not authorized to register. Contact your college admin.' });
      }

      // ID is valid — proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = 'INSERT INTO users (name, email, password, role, department, roll_or_staff_id, college_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [name, email, hashedPassword, role, department, rollOrStaffId, collegeName], (err2, result) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: 'Error registering user', error: err2.message });
        }

        const newUserId = result.insertId;

        // If registering as student, also create their student profile
        if (role === 'student') {
          const studentSql = 'INSERT INTO students (user_id, course_id, semester_id, roll_number) VALUES (?, ?, ?, ?)';
          db.query(studentSql, [newUserId, course_id || null, semester_id || null, rollOrStaffId], (err3) => {
            if (err3) {
              console.error(err3);
              return res.status(500).json({ message: 'User created but student profile failed', error: err3.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: newUserId });
          });
        } else {
          res.status(201).json({ message: 'User registered successfully', userId: newUserId });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};