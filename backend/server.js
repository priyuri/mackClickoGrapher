const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.send("Photography Backend is Running!");
});


// =========================
// BOOKING API
// =========================

app.post("/api/bookings", (req, res) => {

    const {
        name,
        email,
        phone,
        service,
        shoot_date,
        message
    } = req.body;


    if (!name || !email || !phone || !service || !shoot_date) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });

    }


    const sql = `
        INSERT INTO bookings
        (name, email, phone, service, shoot_date, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    const values = [
        name,
        email,
        phone,
        service,
        shoot_date,
        message
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Booking failed."
            });

        }


        res.status(201).json({
            success: true,
            message: "Booking submitted successfully!",
            bookingId: result.insertId
        });

    });

});


// =========================
// CONTACT API
// =========================

app.post("/api/contact", (req, res) => {

    const {
        name,
        email,
        phone,
        message
    } = req.body;


    if (!name || !email || !message) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });

    }


    const sql = `
        INSERT INTO contacts
        (name, email, phone, message)
        VALUES (?, ?, ?, ?)
    `;


    const values = [
        name,
        email,
        phone,
        message
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Message could not be sent."
            });

        }


        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    });

});

// GET ALL BOOKINGS
app.get("/api/bookings", (req, res) => {

    const sql = "SELECT * FROM bookings ORDER BY created_at DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch bookings."
            });
        }

        res.json({
            success: true,
            bookings: results
        });
    });
});


// GET ALL CONTACT QUERIES
app.get("/api/contacts", (req, res) => {

    const sql = "SELECT * FROM contacts ORDER BY created_at DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch contact queries."
            });
        }

        res.json({
            success: true,
            contacts: results
        });
    });
});


// UPDATE BOOKING STATUS
app.put("/api/bookings/:id/status", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid booking status."
        });
    }

    const sql = `
        UPDATE bookings
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Could not update booking status."
            });
        }

        res.json({
            success: true,
            message: "Booking status updated successfully!"
        });
    });
});


// UPDATE CONTACT STATUS
app.put("/api/contacts/:id/status", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid contact status."
        });
    }

    const sql = `
        UPDATE contacts
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Could not update contact status."
            });
        }

        res.json({
            success: true,
            message: "Query status updated successfully!"
        });
    });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});

// app.post("/contact", (req, res) => {

//     const { name, email, phone, message } = req.body;

//     const sql = `
//         INSERT INTO contacts (name, email, phone, message)
//         VALUES (?, ?, ?, ?)
//     `;

//     db.query(sql, [name, email, phone, message], (err, result) => {

//         if (err) {
//             console.log(err);
//             return res.status(500).json({
//                 message: "Contact message save nahi hua"
//             });
//         }

//         res.json({
//             message: "Message successfully sent!"
//         });
//     });
// })