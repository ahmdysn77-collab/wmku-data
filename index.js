const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = '2c0b368c555794e762339edb3c3c9042e76da0e1c0700220e61f1afdbfc6386d';
const HEADERS = { 'Authorization': 'Bearer ' + ACCESS_TOKEN, 'Content-Type': 'application/json' };
const BID = '842344';
const OID = '897877';
const SHEET_ID = '11qR1L5XKXQELfthzFcFACrQLbw3xfhLPV29Aloca2S4';

app.get('/api/businesses', async (req, res) => {
  const r = await fetch('https://api.mokapos.com/v1/businesses', { headers: HEADERS });
  res.send(await r.text());
});

app.get('/api/customers', async (req, res) => {
  const r = await fetch(`https://api.mokapos.com/v1/businesses/${BID}/customers?include_loyalty=true`, { headers: HEADERS });
  res.send(await r.text());
});

app.get('/api/menu', async (req, res) => {
  const r = await fetch(`https://api.mokapos.com/v1/outlets/${OID}/items?per_page=100`, { headers: HEADERS });
  res.send(await r.text());
});

app.get('/api/loyalty', async (req, res) => {
  const r = await fetch(`https://api.mokapos.com/v1/businesses/${BID}/loyalties/programs`, { headers: HEADERS });
  res.send(await r.text());
});

app.get('/api/transactions', async (req, res) => {
  const r = await fetch(`https://api.mokapos.com/v4/outlets/${OID}/reports/get_latest_transactions?per_page=20`, { headers: HEADERS });
  res.send(await r.text());
});

// Promo & Event dari Google Sheets (public CSV)
app.get('/api/promo', async (req, res) => {
  try {
    const r = await fetch('https://raw.githubusercontent.com/ahmdysn77-collab/wmku-data/refs/heads/main/promo.json');
    const data = await r.json();
    const aktif = data.filter(item => item.aktif === true);
    res.json({ data: aktif });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('WMku Proxy berjalan di http://localhost:3001'));
