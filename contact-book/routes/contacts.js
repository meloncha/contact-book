// routes/contacts.js

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Index
router.get('/', (req, res) => {
    Contact.find({}, (err, contacts) => {
        if (err) return res.json(err);
        res.render('contacts/index', { contacts });
    });
});

// New
router.get('/new', (req, res) => {
    res.render('contacts/new');
});

// create
router.post('/', (req, res) => {
    Contact.create(req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect('/contacts');
    });
});

// show
router.get('/:id', (req, res) => {
    Contact.findOne({_id: req.params.id}, (err, contact) => {
        if (err) return res.json(err);
        res.render('contacts/show', { contact });
    });
});

// edit
router.get('/:id/edit', (req,res) => {
    Contact.findOne({_id: req.params.id}, (err, contact) => {
        if (err) return res.json(err);
        res.render('contacts/edit', {contact});
    });
});

// update
router.put('/:id', (req, res) => {
    Contact.findOneAndUpdate({_id: req.params.id}, req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect(`/contacts/${req.params.id}`);
    });
});

// destroy
router.delete('/:id', (req, res) => {
    Contact.deleteOne({_id: req.params.id}, (err) => {
        if (err) return res.json(err);
        res.redirect('/contacts');
    });
});

module.exports = router;

// contact.js에는 Contact module을 require로 호출합니다
