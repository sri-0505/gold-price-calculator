
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'Sri@2006',
  database: 'gold_pricing'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL!');
});


 // ✅ Route 1: Get types (P_Name) for a selected category (C_Name)
app.get('/api/types/:category', (req, res) => {
  const category = req.params.category;

  const query = `
    SELECT ct.P_Name
    FROM category_types ct
    JOIN gold_category gc ON ct.C_Id = gc.C_Id
    WHERE gc.C_Name = ?
  `;

  connection.query(query, [category], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results); // [{P_Name: 'Simple Ring'}, {P_Name: 'Engraved Ring'}, ...]
  });
});

// ✅ Route 2: Get detailed data for selected type (P_Name)
app.get('/api/item/:typeName', (req, res) => {
  const typeName = req.params.typeName;

  const query = `
    SELECT gold_weight AS weight, making_charge_percent, waste_percent, tax_percent
    FROM category_types
    WHERE P_Name = ?
  `;

  connection.query(query, [typeName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json(results[0]); // return the item details
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
