import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
    try {
   const thread = new Thread({
            threadId: "abc",
            title: "Test Thread2"
        });
        const response = await thread.save();
        res.send(response);
    }catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

//get all threads
router.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ createdAt: -1 });
        //descenging orfer of updatedAt... most recent data on top
        res.send(threads);
    }catch(error){
        console.error("Error fetching threads:", error);
        res.status(500).send({ error: "Faled to fetch threads" });
    }
});

router.get("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            return res.status(404).send({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (error) {
        console.error("Error fetching thread:", error);
        res.status(500).send({ error: "Failed to fetch thread" });
    }
});

router.delete("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            return res.status(404).send({ error: "Thread not found" });
        }
        res.status(200).send({ message: "Thread deleted successfully" });
    } catch (error) {
        console.error("Error deleting thread:", error);
        res.status(500).send({ error: "Failed to delete thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).send({ error: "threadId and message are required" });
    }
    try {
   let thread = await Thread.findOne({threadId});
        if (!thread) {
            //create new thread in db
            thread = new Thread({
                 threadId,
                 title: message,
                 messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply =  await getGeminiAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: assistantReply });

    } catch (error) {
        console.error("Error processing chat message:", error);
        res.status(500).send({ error: "Failed to process chat message" });
    }
});


export default router;