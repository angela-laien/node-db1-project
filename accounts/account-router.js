const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db('accounts')
    .then(accounts => {
        res.status(200).json({data: accounts})
    })
    .catch(error => {
        res.status(500).json({error: error.message});
    });
});

router.get('/:id', (req, res) => {
    db('accounts')
        .where('id', req.params.id)
        .first()
        .then(accounts => {
            res.status(200).json({data: accounts});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

router.post('/', (req, res) => {
    const accountData = req.body;
    db('accounts')
        .insert(accountData)
        .then(ids => {
            const id = ids[0];
            db('accounts')
                .where({ id })
                .first()
                .then(account => {
                    res.status(201).json({ data:account })
                })
        })
        .catch(error => {
            res.status(500).json({error: error.messasge})
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;
    db('accounts').where({id}).update(changes).then(count => {
        if (count > 0) {
            res.status(200).json({message: 'update successful'});
        } else {
            res.status(404).json({message: 'no account found by that id'})
        }
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db('accounts').where({id: id}).delete().then(count => {
        count > 0
            ? res.status(200).json({message: 'account deleted'})
            : res.status(500).json({error: error.messagse})
    });
});

module.exports = router;