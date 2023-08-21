const mysql = require('mysql');
const {connection, pool} = require('../config/config');
const {sMail} = require('../config/customFunction')
const path = require('path');
const multiparty = require('multiparty');
const { json } = require('body-parser');
const util = require('util');
const bcrypt = require('bcryptjs');
const axios = require('axios');

module.exports  = {

    
    signup: (req, res) => {
            res.render('default/sign-up');
    },
    
    index: (req, res) => {
            res.render('default/home');
    },


    register: async (req, res) => {
        try {
          const { business_name, city, address, bus_email, bus_phone, country, firstName, lastName, email, password, postal_code } = req.body;
      
          if (!firstName || !lastName || !email || !password || !business_name || !city || !address || !bus_email || !bus_phone || !country) {
            return res.status(400).json({ error: 'All fields are required' });
          }

          const new_password = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
              if (err) return reject(err);
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) return reject(err);
                resolve(hash);
              });
            });
          });
        
      
          const response = await axios.post('http://localhost:9090/register', {
            firstName,
            lastName,
            email,
            password: new_password,
            business_name, city, address, bus_email, bus_phone, country, postal_code
          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
      
          if (response.status === 200) {
            req.session.tmail = bus_email;
            return res.redirect('/confirm');
          } else {
            const error= 'Registration failed';
            res.render('default/sign-up', {error})
          }
        } catch (error) {
          if (error.response.data.message){
              const msg = error.response.data.message;
              console.log(error.response.data.message)
              res.render('default/sign-up', {msg});

          }
          else{
              const msg = error.response.data ? error.response.data : 'Error please try again';
              console.log(msg)
              res.render('default/sign-up', {msg});
          }
            
        }
      },
      
    confirm: (req, res) =>{
        const sender = req.session.tmail;
        res.render('default/registration/confirm', {sender})
    },
    
    complete: (req, res) =>{
        res.render('default/registration/complete')
    },
    
    invalid: (req, res) =>{
        res.render('default/registration/invalid')
    },

    
    four: (req, res) => {
        res.render('default/404')
    },

    // checkMail: (req, res) => {

    //     try{
    //         const { email } = req.query;

    //         console.log('went')
    //         const resp = axios.post('http://localhost:9090/check-mail', {email})
    //         console.log(resp)
    //         console.log('came back')
    //         const resps = JSON.stringify(resp);
    //           if (resps.status == 200) {
    //             res.status(200).json({message: 'ok'})
    //           }
    //           if (resps.status == 401){
    //             console.log('401')
    //             res.status(401).json({message: '1 y This email is already registered'})
    //           };
    //     }catch{
    //         res.status(500).json({message: 'error checking email'})

    //     }
    // },

     checkMail : (req, res) => {
      try {
          const email  = req.query;
  
          
          axios.post('http://localhost:9090/check-mail', email )
              .then(resp => {
                  if (resp.status == 200) {
                      res.status(200).json({ message: 'ok' });
                  } else if (resp.status == 401) {
                      console.log('401');
                      res.status(401).json({ message: 'This email is already registered' });
                  } else {
                      res.status(resp.status).json({ message: 'Unexpected response from server' });
                  }
              })
              .catch(error => {
                  res.status(401).json({ message: error.response.data.error});
              });
      } catch (error) {
          res.status(500).json({ message: 'Error checking email' });
      }
  },

    

 


    activate: async (req, res) => {

        try{
            
            const { token } = req.query;
              
            const response = await axios.post('https://api.rezeet.io/activate', {
                token
              }, 
              {
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              if (response.status === 200) {
                res.redirect('complete');
              };
              if (response.status === 400) {
                res.redirect('invalid');
              };
              if (response.status === 401) {
                res.redirect('invalid');
              };


        }catch{
            res.redirect('invalid');

        }
        
        
        
        
         
},


// Activation 
activateJwt: (req, res) => {
    const { code } = req.query;

  // Verify and decode the activation code using JWT
  jwt.verify(code, activationCodeSecret, (error, decoded) => {
    if (error) {
      console.error('Error decoding activation code:', error);
      return res.status(400).json({ message: 'Invalid activation code.' });
    }

    const { email } = decoded;

    // Find user with the provided email in the database
    pool.query('SELECT * FROM all_users WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Failed to find user.' });
      }

      if (results.length === 0) {
        // Handle user not found
        return res.status(400).json({ message: 'User not found.' });
      }

      const user = results[0];

      // Update user status to "activated" in the database
      // For example: pool.query('UPDATE all_users SET status = "activated" WHERE id = ?', [user.id], (error) => { ... });

      // Return response to the client
      res.json({ message: 'Account activated successfully.' });
    });
  });


},








//Initiated qr option for receipt

    qrInitiated: (req, res) => {
        const form = {
            merchant: "Walmart",
            merchant_id: 12,
            address: "45 lacre, 1st shoindede",
            date: Date.now(),
            total: 240,
            base: 2360,
            tax: 4,
            receipt_id: "#2112240",
            items: {
                1: {
                    prod: "bag",
                    unit: 2,
                    unit_price: "$22",
                    total_price: "$44",
                },
                2: {
                    prod: "shoe",
                    unit: 1,
                    unit_price: "$12",
                    total_price: "$24",
                },

            },
            scanned: "No"
        }

        const query = 'INSERT INTO orders (merchant, merchant_id, address, items, scanned) VALUES (?, ?, ?, ?, ?)';
        const values = [form.merchant, form.merchant_id, form.address, JSON.stringify(form.items), form.scanned, form.total, form.base, form.tax, form.date, form.receipt_id];

        connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving form input:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const recordId = result.insertId;
        const recordUrl = `http://localhost:7000/qr/${recordId}`;
        const updateQuery = 'UPDATE orders SET url = ? WHERE id = ?';
        connection.query(updateQuery, [recordUrl, recordId], (updateErr) => {
        if (updateErr) {
            console.error('Error updating record URL:', updateErr);
            return res.status(500).json({ error: 'Internal server error' });
        }
        })    


        // Generate QR code
        const qrCode = qr.imageSync(recordUrl, { type: 'svg' });

        return res.send({qrCode});
        });

    },


}