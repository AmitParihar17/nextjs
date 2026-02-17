import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";
import { Message } from "@/src/models/User";

export async function POST (request : Request){
    await dbConnect()
  const {username,content} =   await request.json()
  try {
  const user = await  UserModel.findOne({username})
  if(!user){
    return Response.json({
        success : false,
        message : "User not Found",
    },{status : 404})
  }
  // is user accepting messages
  if(!user.isAcceptingMessage){
        return Response.json(
          {
            success: false,
            message: "User is not accepting the messages ",
          },
          { status: 403 },
        );
  }
  const newMessages = {content,createdAt : new Date()}
  user.messages.push(newMessages as Message)
  await user.save()
  return Response.json(
    {
      success: true,
      message: "Message sent successfully",
    },
    { status: 200 },
  );
  } catch (error) {
       console.log("An unexpected error while sending message",error);
         
         return Response.json(
           {
             success: false,
             message: "server error while sending message ",
           },
           { status: 500 },
         );
    
  }
}