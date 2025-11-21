import connectDB from '../../lib/db.js';
import SharedCookie from '../../lib/cookieModel.js';

/**
 * API endpoint để xóa (unshare) một profile khỏi group
 * Method: POST
 * Body: { groupId: string, profileName: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { groupId, profileName } = req.body;

    // Validate input
    if (!groupId || !profileName) {
      return res.status(400).json({
        success: false,
        message: 'groupId and profileName are required'
      });
    }

    // Connect to database
    await connectDB();

    // Find group
    const group = await SharedCookie.findOne({ groupId });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if profile exists
    const profileIndex = group.profiles.findIndex(
      p => p.profileName === profileName
    );

    if (profileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found in group'
      });
    }

    // Remove profile from array
    group.profiles.splice(profileIndex, 1);
    group.updatedAt = new Date();

    // Save to database
    await group.save();

    return res.status(200).json({
      success: true,
      message: 'Profile removed from group',
      data: {
        groupId: group.groupId,
        profileName,
        remainingProfiles: group.profiles.length
      }
    });

  } catch (error) {
    console.error('Error removing profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

