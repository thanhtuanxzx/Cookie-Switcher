import connectDB from '../../../lib/db.js';
import SharedCookie from '../../../lib/cookieModel.js';

/**
 * Next.js API Route: Get Group Profiles (Dynamic Route)
 * GET /api/groups/[groupId]
 * Next.js automatically provides groupId in req.query
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Next.js automatically parses dynamic route params into req.query
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'groupId is required'
      });
    }

    // Connect to database
    await connectDB();

    // Find group
    const group = await SharedCookie.findOne({ groupId });

    if (!group) {
      return res.status(200).json({
        groupId,
        profiles: []
      });
    }

    // Return profiles
    return res.status(200).json({
      groupId: group.groupId,
      profiles: group.profiles.map(p => ({
        profileName: p.profileName,
        cookies: p.cookies,
        updatedAt: p.updatedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching group:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

