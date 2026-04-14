import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getStoriesByUser } from '../services/story.api';
import StoryViewer from '../components/StoryViewer';

const StoryViewerPage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getStoriesByUser(userId);
        if (mounted) {
          setStories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (mounted) {
          setStories([]);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <StoryViewer
      stories={stories}
      user={location.state?.user || stories?.[0]?.user}
      onClose={handleClose}
    />
  );
};

export default StoryViewerPage;
