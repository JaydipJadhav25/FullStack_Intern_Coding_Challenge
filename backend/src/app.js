const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');



const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

//config 
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

//setup middlewaer
app.use(express.json());
app.use(express.urlencoded({extended : true}));


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes); 
app.use('/api/owner', ownerRoutes);


app.get("/" , (req , res)=>{
  return res.send("<h1>Online Store</h1>")
})



//error middlewaer
app.use((err , req , res , next) =>{
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';
  res.status(statusCode).json({ message });

});

module.exports = app;
