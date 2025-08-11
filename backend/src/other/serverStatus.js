export const serverStatus = () => {
  return `
         <!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>Server Running</title>
             <style>
                 body {
                     font-family: Arial, sans-serif;
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     height: 100vh;
                     background-color: #f0f0f0;
                 }
                 .popup {
                     background-color: #ffffff;
                     border-radius: 10px;
                     padding: 20px;
                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                 }
                 .popup h1 {
                     color: #333333;
                     margin-bottom: 20px;
                 }
             </style>
         </head>
         <body>
             <div class="popup">
                 <h1>Wow! Server Running</h1>
                 <p>Working!</p>
             </div>
         </body>
         </html>
      `;
};
