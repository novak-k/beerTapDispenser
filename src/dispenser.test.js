import { Dispenser } from "./dispenser";

test('create new empty dispenser', () => {
  const dispenser = new Dispenser(0.05);
  expect(dispenser.flow_volume).toBe(0.05);
  expect(dispenser.usages).toStrictEqual([]);
  expect(dispenser.status).toBe('close');
});

test('dispenser should change status', () => {
  const dispenser = new Dispenser();
  expect(dispenser.status).toBe('close');
  dispenser.setStatus('open', '2022-01-01T00:00:00Z');
  expect(dispenser.status).toBe('open');
});

test('dispenser should not change status', () => {
  const dispenser = new Dispenser();
  expect(dispenser.status).toBe('close');
  expect.assertions(3);
  try {
    dispenser.setStatus('close', '2022-01-01T00:00:00Z');
  } catch (e) {
    expect(e).toEqual(new Error("wrong status"))
  }
  expect(dispenser.status).toBe('close');
});

test('dispenser should opened and closed', () => {
  const dispenser = new Dispenser();
  expect(dispenser.status).toBe('close');
  dispenser.setStatus('open', '2022-01-01T00:00:00Z');
  expect(dispenser.status).toBe('open');
  dispenser.setStatus('close', '2022-01-01T10:00:00Z');
  expect(dispenser.status).toBe('close');
});

test('dispenser should generate info', () => {
  const dispenser = new Dispenser(0.05);
  expect(dispenser.status).toBe('close');
  dispenser.setStatus('open', '2022-01-01T00:00:00Z');
  expect(dispenser.status).toBe('open');
  dispenser.setStatus('close', '2022-01-01T10:00:00Z');
  expect(dispenser.status).toBe('close');
  const info = dispenser.info(12.56);
  expect(info).not.toBeUndefined();
  expect(info.amount).not.toBeUndefined();
  expect(info.amount).toBe(143.31);
  expect(info.usages).not.toBeUndefined();
  expect(info.usages[0].opened_at).toBe('2022-01-01T00:00:00Z');
  expect(info.usages[0].closed_at).toBe('2022-01-01T10:00:00Z');
  expect(info.usages[0].flow_volume).toBe(0.05);
  expect(info.usages[0].total_spent).toBe(143.312);
});
