import express from "express";
const router = express.Router();

let lastQueue = 0;

// antrian statis
router.post("/next", (req, res) => {
    try {
        lastQueue++;
        const formattedQueue = String(lastQueue).padStart(3, '0');
        res.json({ success: true, nextQueue: formattedQueue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to get next queue", error: String(error) });
    }
});

router.get("/current", (req, res) => {
    try {
        const formattedQueue = String(lastQueue).padStart(3, '0');
        res.json({ success: true, currentQueue: formattedQueue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to get current queue", error: String(error) });
    }
});

export default router;