import { expect, it } from 'vitest';
import { percentile95 } from './benchmark';

it('calcula p95 por rango más próximo sin alterar el orden de captura', () => {
  const samples = [500, ...Array.from({ length: 19 }, (_, index) => index + 1)];
  expect(percentile95(samples)).toBe(19);
  expect(samples[0]).toBe(500);
});

it.each([[], [NaN], [Infinity], [-1]].map((samples) => ({ samples })))('rechaza mediciones inválidas $samples', ({ samples }) => {
  expect(() => percentile95(samples)).toThrow();
});
