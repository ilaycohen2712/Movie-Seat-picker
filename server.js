const express = require('express');
const path = require('path');
const app = express();
const PORT = 9000;
// open the direction 
app.use(express.static(path.join(__dirname, 'public')));
//gets the index.html from the direcrion
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// listen to the poer = 9000 and running the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
