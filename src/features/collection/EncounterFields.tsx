import type { Observation } from '../../domain/collection';
import { contextNames, habitatNames, municipalityNames } from '../../test-support/catalog';

export type EncounterValues = Pick<Observation, 'context' | 'habitat' | 'municipality' | 'placeSource' | 'observedDate' | 'datePrecision' | 'notes'>;
export const emptyEncounter: EncounterValues = { context: 'unknown', habitat: 'unknown', municipality: null, placeSource: 'unknown', observedDate: null, datePrecision: 'unknown', notes: '' };

export function EncounterFields({ value, onChange, disabled = false }: { value: EncounterValues; onChange: (value: EncounterValues) => void; disabled?: boolean }) {
  return <fieldset className="encounter-fields" disabled={disabled}><legend>Datos del encuentro</legend>
    <label htmlFor="encounter-date">Fecha del encuentro (opcional)</label><input id="encounter-date" type="date" value={value.observedDate ?? ''} onChange={(event) => onChange({ ...value, observedDate: event.target.value || null, datePrecision: event.target.value ? 'day' : 'unknown' })} />
    <p className="hint">Si no la sabes, queda desconocida. No usamos la fecha de subida.</p>
    <label htmlFor="encounter-town">Municipio del encuentro</label><select id="encounter-town" value={value.municipality ?? ''} onChange={(event) => onChange({ ...value, municipality: (event.target.value || null) as EncounterValues['municipality'], placeSource: event.target.value ? 'manual' : 'unknown' })}><option value="">Desconocido</option>{Object.entries(municipalityNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
    <label htmlFor="encounter-context">Contexto</label><select id="encounter-context" value={value.context} onChange={(event) => onChange({ ...value, context: event.target.value as EncounterValues['context'] })}>{Object.entries(contextNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
    <label htmlFor="encounter-habitat">Entorno declarado</label><select id="encounter-habitat" value={value.habitat} onChange={(event) => onChange({ ...value, habitat: event.target.value as EncounterValues['habitat'] })}>{Object.entries(habitatNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
    <label htmlFor="encounter-notes">Notas (opcional)</label><textarea id="encounter-notes" value={value.notes} maxLength={2000} rows={3} onChange={(event) => onChange({ ...value, notes: event.target.value })} />
  </fieldset>;
}
