const catchAsyncErrors = require('../services/catchAsyncErrors');
const db = require('../config/connection');


exports.filterData = catchAsyncErrors(async (req, res, next) => {
    const { apply_to,key, value } = req.params; //You can filter data by any key such as assignment_id,due_date,etc
    try {
        //Here apply_to means to which table you want to filter and sort data (assignments,submissions)
        const filterData = `SELECT * FROM ${apply_to} WHERE ${key} = ?`; //Give value to filter data
        db.query(filterData, [value], function (err, results) {
            if (err) {
                console.log(err);
                return res.status(404).send({ error: "Data not found" });
            }
            return res.status(200).send({
                success: "Data found!!",
                data: results
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

exports.sortData = catchAsyncErrors(async (req, res, next) => {
    //Order means sort the data in specific manner (ASC,DESC)
    const { apply_to,key, order } = req.params; //You can filter data by any key such as assignment_id,due_date,etc
    try {
        //Here apply_to means to which table you want to filter and sort data (assignments,submissions)
        const sortData = `SELECT * FROM ${apply_to} ORDER BY ${key} ${order}`;
        db.query(sortData, function (err, results) {
            if (err) {
                console.log(err);
                return res.status(401).send({ error: "Unable to sort data" });
            }
            return res.status(200).send({
                success: "Successfully Sorted",
                data: results
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})