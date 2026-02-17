import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/src/models/User";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User
  if(!session || !session.user){
    return Response.json({
        success : false,
        message : "Not authenticated"
    },{status : 401})
  }
  const userId = user._id
 const {acceptMessages} =  await request.json()
 try {
  const updatedUser =   await UserModel.findByIdAndUpdate(
        userId,{isAcceptingMessage : acceptMessages},
        {new : true}
    )
    if(!updatedUser){
         return Response.json({
        success : false,
        message : "failed to update user"
    },{status : 404})
  }
     return Response.json(
       {
         success: true,
         message: "Message acceptance status updated succesfully",
         updatedUser
       },
       { status: 200 },
     );
    
 } catch (error) {
    console.log("failed to update user status to update messages",error);
    
     return Response.json(
       {
         success: false,
         message: "server error to failed to update user status to update messages",
       },
       { status: 500 },
     );
 }
}

export async function GET (request:Request) {
    await dbConnect()
 const session =   await getServerSession(authOptions)
const user :User =  session?.user as User
if(!session || !session.user){
    return Response.json({
        success : false,
        message : "Not authenticated"
    },{status : 401})
}
const userId =  user._id
try {
    const foundUser = await UserModel.findById(userId)
    if(!foundUser){
        return Response.json({
            success : false,
            message : "User not found"
        },{status:404})
    }
    return Response.json({
        success : true,
        isAcceptingMessages : foundUser.isAcceptingMessage
    },{status : 200})
} catch (error) {
     console.log("error is getting messaage acceptance status", error);

     return Response.json(
       {
         success: false,
         message:
           "server error,error is getting messaage acceptance status",
       },
       { status: 500 },
     );
}
}
