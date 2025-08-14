import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function NewNoteRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const newId = uuidv4();
    navigate(`/notes/${newId}`, { replace: true });
  }, []);

  return null;
}
