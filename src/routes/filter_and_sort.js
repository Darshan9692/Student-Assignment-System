const express = require('express');
const router = express.Router();
const { filterData, sortData } = require('../controllers/filter_and_sort');
const { isAuthenticatedUser } = require('../services/auth');


//Here apply_to means to which table you want to filter and sort data (assignments,submissions)
router.route("/filter/:apply_to/:key/:value").get(isAuthenticatedUser, filterData);
router.route("/sort/:apply_to/:key/:order").get(isAuthenticatedUser, sortData);


module.exports = router;