import message from "../../models/message.model.js";

export default function messageHandler(io, socket) {
    socket.on("send_message", ({ message, receiver }) => {
        try {

            if (!message || !receiver) {
                console.log("Invalid payload");
                return;
            }

            // Save message to DB
            const newMessage = new message({
                sender: socket.user.id,
                receiver,
                message
            });


            const payload = {
                _id: newMessage._id,
                message: newMessage.message,
                sender: newMessage.sender,
                receiver: newMessage.receiver,
                createdAt: newMessage.createdAt,
                updatedAt: newMessage.updatedAt
            }
            // Emit message to receiver
            io.to(receiver).emit("receive_message", payload);

            // Emit message back to sender for confirmation
            socket.emit("message_sent", payload);
            
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("message_error", { error: "Failed to send message" });
        }
    });
}