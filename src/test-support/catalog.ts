import type { Collection, Species } from '../domain/collection.ts';

export const demoSpecies: Species[] = [
  { id: 'demo-gorrion', commonName: 'Gorrión común', scientificName: 'Passer domesticus', group: 'birds', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-mirlo', commonName: 'Mirlo común', scientificName: 'Turdus merula', group: 'birds', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-urraca', commonName: 'Urraca', scientificName: 'Pica pica', group: 'birds', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-paloma', commonName: 'Paloma bravía', scientificName: 'Columba livia', group: 'birds', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-conejo', commonName: 'Conejo europeo', scientificName: 'Oryctolagus cuniculus', group: 'mammals', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-gato', commonName: 'Gato doméstico', scientificName: 'Felis catus', group: 'mammals', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-lagartija', commonName: 'Lagartija roquera', scientificName: 'Podarcis muralis', group: 'reptiles', source: 'demo', verifiedLocalPresence: false },
  { id: 'demo-mariposa', commonName: 'Mariposa atalanta', scientificName: 'Vanessa atalanta', group: 'insects', source: 'demo', verifiedLocalPresence: false },
];

const wildMembers = demoSpecies.filter((species) => species.id !== 'demo-gato').map((species) => species.id);
export const demoCollections: Collection[] = [
  { id: 'primeros', version: 'demo-1', title: 'Primeros encuentros', memberSpeciesIds: demoSpecies.map((species) => species.id), rule: 'Un encuentro confirmado por especie. Cualquier contexto; lista de ejemplo fija.' },
  { id: 'algete', version: 'demo-1', title: 'Vecinos de Algete', memberSpeciesIds: wildMembers, municipality: 'algete', context: 'wild', rule: 'Encuentro silvestre y municipio Algete declarado. Lugar desconocido y domésticos no cuentan.' },
  { id: 'san-agustin', version: 'demo-1', title: 'Vecinos de San Agustín', memberSpeciesIds: wildMembers, municipality: 'san-agustin', context: 'wild', rule: 'Encuentro silvestre y municipio San Agustín declarado. Lugar desconocido y domésticos no cuentan.' },
  { id: 'jardines', version: 'demo-1', title: 'Entre calles y jardines', memberSpeciesIds: wildMembers, context: 'wild', habitats: ['urban', 'garden'], rule: 'Encuentro silvestre en calle o jardín declarado; no se deduce del municipio.' },
  { id: 'companeros', version: 'demo-1', title: 'Animales que nos acompañan', memberSpeciesIds: ['demo-gato'], context: 'domestic', rule: 'Encuentro de gato en contexto doméstico declarado. No avanza objetivos silvestres.' },
];

export const groupNames = { birds: 'Aves', mammals: 'Mamíferos', reptiles: 'Reptiles', insects: 'Insectos' };
export const municipalityNames = { algete: 'Algete', 'san-agustin': 'San Agustín de Guadalix' };
export const contextNames = { wild: 'Silvestre', domestic: 'Doméstico', captive: 'Cautividad', unknown: 'Desconocido' };
export const habitatNames = { urban: 'Calle', garden: 'Jardín', other: 'Otro', unknown: 'Desconocido' };
