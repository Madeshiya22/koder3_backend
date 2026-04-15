import message from "../../models/message.model.js";
import followModel from "../../models/follow.model.js";

export default function messageHandler(io, socket) {
    socket.on("send_message", async ({ message, receiver, chatId }) => {
        try {
            const targetUserId = receiver || chatId;

            if (!message || !targetUserId) {
                console.log("Invalid payload");
                return;
            }

            const senderId = socket.user.id;

            const [senderToReceiver, receiverToSender] = await Promise.all([
                followModel.findOne({
                    follower: senderId,
                    followee: targetUserId,
                    status: "accepted",
                }),
                followModel.findOne({
                    follower: targetUserId,
                    followee: senderId,
                    status: "accepted",
                }),
            ]);

            if (!senderToReceiver || !receiverToSender) {
                socket.emit("message_error", {
                    error: "Only mutually accepted followers can chat",
                });
                return;
            }

            const newMessage = new message({
                sender: senderId,
                receiver: targetUserId,
                message
            });

            await newMessage.save();

            const payload = {
                _id: newMessage._id,
                message: newMessage.message,
                sender: newMessage.sender,
                receiver: newMessage.receiver,
                createdAt: newMessage.createdAt,
                updatedAt: newMessage.updatedAt
            }

            io.to(targetUserId).emit("receive_message", payload);
            socket.emit("message_sent", payload);
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("message_error", { error: "Failed to send message" });
        }
    });
}