const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const setupSwagger = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Auth API",
        version: "1.0.0",
        description: "Kullanıcı kimlik doğrulama ve OTP işlemleri için API"
      },
      servers: [
        { url: "https://ecommerce-app-1-bpok.onrender.com" } // render URL’in
      ]
    },
    apis: ["./routes/auth.js", "./routes/cart.js", "./routes/category.js", "./routes/order.js", "./routes/payment.js", "./routes/productRoutes.js", "./routes/protectedRoute.js", "./routes/userRoutes.js"], // swagger açıklamalarını auth.js içinde de kullanabiliriz // Swagger yorumlarının olduğu route dosyaları
  };

  const swaggerSpec = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;




  
