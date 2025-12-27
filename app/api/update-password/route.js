import { User } from '../../../models/User'; // Adjust path as needed
import bcrypt from 'bcrypt';

export async function PATCH(req) {
  try {
    const { currentPassword, newPassword } = await req.json();
    // Placeholder: get userId from header (replace with real auth/session logic)
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      console.log("enter user id error  block ");
      
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    if (!currentPassword || !newPassword) {
      console.log("enter password empty error  block ");

      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      console.log("enter user error  block ");

      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log("enter compare error  block ");

      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.log("enter catch error  block ");
    
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 