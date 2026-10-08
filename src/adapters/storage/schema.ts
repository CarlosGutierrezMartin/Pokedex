import { z } from 'zod';

const id = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
const source = z.enum(['demo', 'real']);
const timestamp = z.iso.datetime({ offset: true });
export const profileSchema = z.strictObject({ id, source, name: z.string().max(60), createdAt: timestamp, sound: z.boolean(), reducedMotion: z.boolean() });
export const observationSchema = z.strictObject({
  id, operationId: id, profileId: id, source, speciesId: id.nullable(), status: z.enum(['pending', 'confirmed']),
  identificationMethod: z.enum(['manual', 'model', 'guided']), context: z.enum(['wild', 'domestic', 'captive', 'unknown']),
  habitat: z.enum(['urban', 'garden', 'other', 'unknown']), municipality: z.enum(['algete', 'san-agustin']).nullable(),
  placeSource: z.enum(['manual', 'unknown']), observedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  datePrecision: z.enum(['day', 'unknown']), createdAt: timestamp, confirmedAt: timestamp.nullable(), notes: z.string().max(2000), photoIds: z.array(id).max(4),
});
export const identificationSchema = z.strictObject({ observationId: id, profileId: id, source, modelId: z.string().max(100).nullable(), candidates: z.array(z.strictObject({ speciesId: id, rank: z.enum(['species', 'genus', 'family']) })).max(3), chosenSpeciesId: id.nullable() });
const encodedPhoto = z.strictObject({ id, mime: z.literal('image/jpeg'), data: z.string().max(2800000), thumbnail: z.string().max(100000), sha256: z.string().regex(/^[0-9a-f]{64}$/), thumbnailSha256: z.string().regex(/^[0-9a-f]{64}$/) });
export const backupSchema = z.strictObject({ format: z.literal('fauna-local'), schemaVersion: z.literal(1), profile: profileSchema, observations: z.array(observationSchema).max(10000), identifications: z.array(identificationSchema).max(10000), photos: z.array(encodedPhoto).max(1000) });
