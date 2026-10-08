import { useEffect, useState } from 'react';
import { useWorkspace } from './Workspace';
import { deserializePhoto } from '../../adapters/storage/repository';

export function Photo({ id, large = false }: { id: string; large?: boolean }) {
  const { repository, profile } = useWorkspace();
  const [url, setUrl] = useState('');
  useEffect(() => {
    let active = true;
    let objectUrl = '';
    repository.database.photos.get([profile.id, id]).then((photo) => {
      if (!active || !photo) return;
      const decoded = deserializePhoto(photo);
      objectUrl = URL.createObjectURL(large ? decoded.blob : decoded.thumbnail);
      setUrl(objectUrl);
    }).catch(() => setUrl(''));
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [repository, profile.id, id, large]);
  return url ? <img className={large ? 'encounter-photo' : 'thumbnail'} src={url} alt="Foto de tu encuentro" /> : <span className="photo-placeholder">Foto no disponible</span>;
}
