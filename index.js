const express = require('express');
const pool = require('./db');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());  // enable JSON parsing

app.post("/create-event", async (req, res) => {
    const { title, location, date_time, capacity } = req.body

    if (capacity <= 0 || capacity > 1000) {
        return res.status(400).json({ error: 'Capacity must be between 1 and 1000' });
    }

    if (!title || !location || !date_time || capacity == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const eventDate = new Date(date_time);
    if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date_time format' });
    }

    if (eventDate < new Date()) {
        return res.status(400).json({ error: 'Event date must be in the future' });
    }

    try {
        const result = await pool.query(`insert into events (title,date_time,capacity,location) values($1,$2,$3,$4) returning *`, [title, date_time, capacity, location])
        res.status(201).json({ id: result.rows[0].id, message: "Event Created Successfully" })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create event', details: err.message });
    }

})

app.post("/register-event", async (req, res) => {
    const { user_id, event_id } = req.body

    try {
        const existingUser = await pool.query(`select * from users where id=$1`, [user_id])
        if (!existingUser.rows[0]) {
            return res.status(404).json({ error: "User Not Found" })
        }

        const existingEvent = await pool.query(`select * from events where id=$1`, [event_id])

        if (!existingEvent.rows[0]) {
            return res.status(404).json({ error: "Event Not Found" })
        }

        let capacity = existingEvent.rows[0].capacity

        let cur_date = new Date()
        let event_date = new Date(existingEvent.rows[0].date_time)
        if (event_date < cur_date) {
            return res.status(400).json({ error: "Cannot register for a past event" })
        }


        const registrations = await pool.query(`select count(*) from registrations where event_id=$1`, [event_id])
        if (registrations.rows[0].count >= capacity) {
            return res.status(400).json({ error: "Event is already full" })
        }

        const alreadyRegistered = await pool.query(`SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`, [user_id, event_id])
        if (alreadyRegistered.rows[0]) {
            return res.status(400).json({ error: "User already registered for this event" })
        }


        await pool.query(`insert into registrations (user_id,event_id) values($1,$2)`, [user_id, event_id])
        res.status(201).json({ message: "User successfully registered for event" })

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to Register An event', details: err.message });
    }


})

app.delete("/cancel-registration", async (req, res) => {
    const { user_id, event_id } = req.body
    try {
        const existing = await pool.query(`select * from registrations where user_id=$1 and event_id=$2`, [user_id, event_id])
        if (!existing.rows[0]) {
            return res.status(404).json({ error: "User was not registered for this event" })
        }

        await pool.query(`delete from registrations where user_id=$1 and event_id=$2`, [user_id, event_id])
        res.status(200).json({ message: "Registration cancelled successfully" })
    }
    catch (err) {
        res.status(404).json({ error: 'Failed to Cancel Registration', details: err.message });
    }
})

app.get("/upcoming-events", async (req, res) => {
    try {
        const events = await pool.query(`select * from events where date_time> now() order by date_time asc,location asc`)
        if ((events.rows).length === 0) {
            return res.status(200).json([])
        }
        res.status(200).json(events.rows)
    }
    catch (err) {
        res.status(500).json({ error: "error while getting upcoming events", details: err.message })
    }


})

app.get("/event-stats/:eventId", async (req, res) => {
    const { eventId } = req.params
    try {
        const eventsCapacity = await pool.query(`select capacity from events where id=$1`, [eventId])

        if (eventsCapacity.rows.length === 0) {
            return res.status(404).json({ error: "Event Not Found" })
        }
        let capacity = eventsCapacity.rows[0].capacity
        let total_registrations = await pool.query(`select count(*) from registrations where event_id=$1`, [eventId])
        total_registrations = parseInt(total_registrations.rows[0].count)
        let remaining_capacity = capacity - total_registrations
        let capacity_used_percent = Math.round((total_registrations / capacity) * 100);
        res.status(200).json({ event_id: eventId, total_registrations, remaining_capacity, capacity_used_percent })
    }
    catch (err) {
        res.status(500).json({error:"error While fetching stats",details:err.message})
    }
})

app.get("/event-details/:eventId",async(req,res)=>{
    try{
        const {eventId}=req.params
    const eventDetails=await pool.query(`select * from events where id=$1`,[eventId])
    if (eventDeails.rows.length===0){
        return res.status(404).json({error:"Event Not Found"})
    }
    let registeredUserDetails=await pool.query(`select users.id,users.email,users.name from registrations join users on users.id=registrations.user_id where registrations.event_id=$1`,[eventId])
    
    res.status(200).json({"event":eventDetails.rows[0],"registered_users":registeredUserDetails.rows})
    }
    catch(err){
        res.status(500).json({error:"Error While Fetching Event Details",details:err.message})
    }
})

app.get('/', (req, res) => res.send('Hello, Sanni!'));









process.on('SIGINT', async () => {
    console.log('Closing DB pool...');
    await pool.end();  // close Postgres connections
    process.exit();    // exit the app
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
