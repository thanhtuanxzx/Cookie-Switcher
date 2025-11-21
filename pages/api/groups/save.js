import connectDB from '../../../lib/db.js';
import SharedCookie from '../../../lib/cookieModel.js';

/**
 * Next.js API Route: Save/Update Profile in Group
 * POST /api/groups/save
 * Body: { groupId: string, profileName: string, cookies: Array }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { groupId, profileName, cookies } = req.body;

    // Validate input
    if (!groupId || !profileName) {
      return res.status(400).json({
        success: false,
        message: 'groupId and profileName are required'
      });
    }

    if (!Array.isArray(cookies)) {
      return res.status(400).json({
        success: false,
        message: 'cookies must be an array'
      });
    }

    // Connect to database
    await connectDB();

    // Find existing group
    let group = await SharedCookie.findOne({ groupId });

    if (!group) {
      // Create new group
      group = new SharedCookie({
        groupId,
        profiles: [{
          profileName,
          cookies,
          updatedAt: new Date()
        }]
      });
    } else {
      // Check if profile exists
      const profileIndex = group.profiles.findIndex(
        p => p.profileName === profileName
      );

      if (profileIndex !== -1) {
        // Update existing profile
        group.profiles[profileIndex].cookies = cookies;
        group.profiles[profileIndex].updatedAt = new Date();
      } else {
        // Add new profile
        group.profiles.push({
          profileName,
          cookies,
          updatedAt: new Date()
        });
      }
      
      group.updatedAt = new Date();
    }

    // Save to database
    await group.save();

    return res.status(200).json({
      success: true,
      message: 'Saved',
      data: {
        groupId: group.groupId,
        profileName,
        profilesCount: group.profiles.length
      }
    });

  } catch (error) {
    console.error('Error saving cookie:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

