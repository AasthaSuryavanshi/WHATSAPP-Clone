const io = require( "socket.io" )();
const userModel = require( "./routes/users");
const messageModel = require( "./routes/message");

const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on('join-server', async username => {
        await userModel.findOneAndUpdate({
            username
        }, {
            socketid: socket.id
        })

    })


    socket.on("sendprivatemsg",async messageobj =>
    {
        await messageModel.create({
            receiver: messageobj.receiver,
            data: messageobj.msg,
            sender: messageobj.sender,
        })

        const receiver = await userModel.findOne({username: messageobj.receiver})

        socket.to(receiver.socketid).emit('receiveprivatemsg', messageobj)
    })

});


// end of socket.io logic

module.exports = socketapi;