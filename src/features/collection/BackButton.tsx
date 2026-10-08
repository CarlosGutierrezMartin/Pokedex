import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from './Workspace';

export function BackButton({ fallback, label = '← Volver' }: { fallback: string; label?: string }) {
  const { base } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo: unknown = location.state?.returnTo;
  const returnPath = typeof returnTo === 'string' ? (returnTo.split(/[?#]/)[0] ?? '') : '';
  const hasLocalOrigin = returnPath === base || returnPath.startsWith(`${base}/`);
  return <button className="text-button" onClick={() => hasLocalOrigin ? navigate(-1) : navigate(fallback)}>{label}</button>;
}
