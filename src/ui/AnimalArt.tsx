import type { Group } from '../domain/collection';

export function AnimalArt({ group, discovered = false }: { group: Group; discovered?: boolean }) {
  const paths: Record<Group, string> = {
    birds: 'M24 77 Q20 42 48 40 Q54 16 72 32 L91 40 L74 47 Q74 79 48 83 L23 95 L29 75 M39 83 L37 96 M55 83 L57 96',
    mammals: 'M23 77 L17 54 L29 32 L40 47 Q59 36 74 51 L88 32 L85 66 Q91 94 64 95 L40 95 Q22 92 23 77 M27 84 Q7 84 12 63',
    reptiles: 'M22 76 Q25 43 54 54 L76 37 L91 43 L78 54 L62 61 Q53 84 32 83 L13 94 M40 58 L34 39 M52 67 L66 85 M37 72 L24 61',
    insects: 'M57 57 Q17 12 19 51 Q17 71 48 67 Q19 83 32 97 Q55 99 59 69 Q69 101 86 94 Q97 73 67 65 Q99 65 95 39 Q93 16 62 54 M59 49 L56 34 M62 49 L68 34 M60 55 L61 91',
  };
  return <svg className={`animal-art ${discovered ? 'revealed' : ''}`} viewBox="0 0 112 112" role="img" aria-label={discovered ? 'Ilustración de ejemplo, no fotografía' : 'Silueta pendiente'}><circle cx="56" cy="56" r="51" fill="currentColor" opacity=".08" /><path d={paths[group]} fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" /></svg>;
}
