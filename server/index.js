const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const db = monk(process.env.MONGO_URI || "localhost/meower");
const mews = db.get("mews");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hey, Meower!"
    });
});

app.get("/mews", (req, res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== "" && mew.content && mew.content.toString().trim() !== ""
}

app.post("/mews", (req, res) => {
    console.log(req.body);
    if(isValidMew(req.body)) {
        // ADD TO DATABASE
        const mew = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        }

        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });

    } else {
        res.status(422);
        res.json({
            "Message": "Hey, Name and Content are required!"
        });
    }
});

app.listen(5000, () => {
    console.log("Listening to http://localhost:5000");
});
