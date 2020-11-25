const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// get gigs list
router.get('/', (req, res) => 
    Gig.findAll()
        .then(gigs => {
            console.log(gigs);
            res.render('gigs', { gigs });
        })
        .catch(err => console.log(err)));

// display add gig form
router.get('/add', (req, res) => res.render('add'));


// add a gig
router.post('/add', (req, res) => {
    let { title, technologies, budget, description, email } = req.body;
    let errors = [];

    // validate fields
    if(!title) errors.push({ text: 'Please add a title' });
    if(!technologies) errors.push({ text: 'Please add technologies' });
    if(!email) errors.push({ text: 'Please add a email' });
    if(!description) errors.push({ text: 'Please add a description' });

    // check for errors
    if(errors.length > 0) {
        res.render('add', {
            errors,
            title,
            technologies,
            description,
            budget,
            email
        })
    } else {
        if(!budget) budget = 'Unknown';
        else budget = `$${budget}`;

        // make lowercase and remove space after a comma
        technologies = technologies.toLowerCase().replace(/, /g, ',');

        // insert to table
        Gig.create({
            title,
            technologies,
            budget,
            description,
            email
        })
        .then(gig => res.redirect('/gigs'))
        .catch(err => console.log(err));
    }   
});

// search for gigs
router.get('/search', (req, res) => {
    let { term } = req.query;

    term = term.toLowerCase();

    Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
        .then(gigs => res.render('gigs', { gigs }))
        .catch(err => console.log(err))
});

module.exports = router;