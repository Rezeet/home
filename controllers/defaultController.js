const mysql = require('mysql');
const {connection, pool} = require('../config/config');
const {sMail} = require('../config/customFunction')
const path = require('path');
const multiparty = require('multiparty');
const { json } = require('body-parser');
const util = require('util');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { spawn } = require('child_process');

module.exports  = {

    
    signup: (req, res) => {
            res.render('default/sign-up');
    },
    
    index: (req, res) => {
            res.render('default/home');
    },
    
    about: (req, res) => {
            res.render('default/about');
    },


    register: async (req, res) => {
        try {
          const { business_name, city, address, bus_email, bus_phone, country, firstName, lastName, email, password, postal_code } = req.body;
      
          if (!firstName || !lastName || !email || !password || !business_name || !city || !address || !bus_email || !bus_phone || !country) {
            return res.status(400).json({ error: 'All fields are required' });
          }

          
          const scanCran =  spawn('python', ['/jobs/sanity.py', JSON.stringify(req.body)]);

          scanCran.stdout.on('data', (data) => {
            console.log(data.toString());
          });

          scanCran.stderr.on('data', (data) => {
            console.error(data.toString());
          });

          scanCran.on('close', async (code) => {
            if (code === 0) {          
              const new_password = await new Promise((resolve, reject) => {
              bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err);
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) return reject(err);
                  resolve(hash);
                });
              });
            });
          
        
            const response = await axios.post('http://api.rezeet.com/register', {
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
            } else {
              const error= ('Security checks failed with error code ' + code);
              res.render('default/sign-up', {error})
            }
          });



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

     checkMail : (req, res) => {
      try {
          const email  = req.query;
  
          
          axios.post('https://api.rezeet.io/check-mail', email )
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


}