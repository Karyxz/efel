const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const apiUrl = 'https://efel.site'; // or your Heroku app URL if different

document.querySelector('button').addEventListener('click', async () => {
  try {
    const response = await fetch(`${apiUrl}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
});