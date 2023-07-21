import express from 'express';
import { Dispenser } from './dispenser.js';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(express.json());
const port = 3000;
const dispensers = new Map();
const price = 12.25;

app.get('/dispenser/:id/spending', (req, res) => {
  const id = req.params.id;
  console.log("Requesting dispenser with id: ", id);
  if (!dispensers.has(id)) {
    res.sendStatus(404);
    return;
  }
  const disp = dispensers.get(id);
  const usages = disp.info(price);
  res.send(usages);
});

app.post('/dispenser', (req, res) => {
  const flow_volume = req.body.flow_volume;
  const dispenser = new Dispenser(flow_volume);
  const _uuid = uuid();
  dispensers.set(_uuid, dispenser);
  console.log(`Creating new dispenser with id ${_uuid} and flow volume ${flow_volume}`);
  res.send({ id: _uuid, flow_volume });
});

app.put('/dispenser/:id/status', (req, res) => {
  const updated_at = req.body.updated_at;
  const status = req.body.status;
  const id = req.params.id;

  if (!dispensers.has(id)) {
    res.sendStatus(404);
    return;
  }
  console.log(`Updating dispenser with id: ${id}. Set status: ${status}`);

  const dispenser = dispensers.get(id);
  try {
    dispenser.setStatus(status, updated_at);
  } catch (e) {
    console.log("Wrong status for dispenser:", id)
    res.sendStatus(409);
    return;
  }
  res.sendStatus(202);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
