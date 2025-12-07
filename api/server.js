const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express()
const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Check In Server',
        version: '1.0.0',
        description: '',
      },
      servers: [
        {
          url: 'https://checkin-server.vercel.app/', // Adjust as needed
          description: 'Development server',
        },
      ],
    };

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js", "./*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api-docs/swagger.json",
    },
  })
)

app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})
class Room {
    constructor(roomId, maxCapacity, participants = 0) {
        this.roomId = roomId
        this.maxCapacity = maxCapacity
        this.participants = participants
        this.lastUpdate = new Date()
    }

    addPersonToRoom() {
        if(this.participants == this.maxCapacity) return false
        this.participants += 1
        this.lastUpdate = new Date()
        return true
    }
    removePersonFromRoom() {
        if(this.participants == 0) return false
        this.participants -= 1
        this.lastUpdate = new Date()
        return true
    }

    getRoomResponse() {
        return {
            "roomId": this.roomId,
            "participants": this.participants,
            "maxCapacity": this.maxCapacity,
            "lastUpdate": this.lastUpdate
        }
    }
}

// 101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304
let rooms = [new Room(101, -1), new Room(102, 200), new Room(103, 40),
    new Room(201, 60), new Room(202, 5, 5), new Room(203, 20),
    new Room(301, 70), new Room(302, 25), new Room(303, -1),
]
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all available room IDs
 *     description: Returns a list of all room numbers currently available in the system.
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: Successful response with room IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomIds:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304]
 */
app.get("/rooms", (req, res) => {
  return res.send({ roomIds: rooms.map((room)=> room.getRoomResponse()) })
})

/**
 * @swagger
 * /addPersonToRoom/{roomId}:
 *   get:
 *     summary: Add a person to a room
 *     description: Attempts to add a person to the specified room. If the room is full, it will return a failure message.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to add a person to
 *         example: 101
 *     responses:
 *       200:
 *         description: Person added or room full response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ok
 *       404:
 *         description: No Room ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No Room Id Provided
 */
app.get("/addPersonToRoom/:roomId", (req, res)=> {
    let roomId = req.params.roomId
    if(!roomId) return res.status(404).send({message: "No Room Id Provided"})
    
    let room = rooms.find((room)=> {        
        return room.roomId === Number(roomId)
    })

        if (!room) {
            console.log("Room not found");
            
            return res.status(404).send({message: "Room not found"})
        }
        
        if(room.addPersonToRoom()) {
            return res.send({message: "Ok"})
        } else {
            return res.send({message: "Room Full."})
    }
})

/**
 * @swagger
 * /removePersonFromRoom/{roomId}:
 *   get:
 *     summary: Remove a person from a room
 *     description: Attempts to remove a person from the specified room. If the room is already empty, a failure message is returned.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to remove a person from
 *         example: 101
 *     responses:
 *       200:
 *         description: Person removed or room empty response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ok
 *       404:
 *         description: No Room ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No Room Id Provided
 */
app.get("/removePersonFromRoom/:roomId", (req, res)=> {
    let roomId = req.params.roomId
    if(!roomId) return res.status(404).send({message: "No Room Id Provided"})

    let room = rooms.find((room)=> {
        return room.roomId === Number(roomId)
    })

    if(room.removePersonFromRoom()) {
        return res.send({message: "Ok"})
    } else {
        return res.send({message: "Room Empty."})
    }
})


module.exports = app;

// app.listen(3000, () => {
//     console.log(`Server is Listening on 3000`)
// })