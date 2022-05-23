const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')

router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getSingleSauces);
router.post('/', auth, multer, saucesCtrl.postNewSauces);
router.put('/:id', auth, multer, saucesCtrl.putModifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.postLikeSauces);

module.exports = router;