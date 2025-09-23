import express from 'express';
import { EPharmaAPI } from '../infra/http/EpharmaApi';


const app = express();
const api = new EPharmaAPI();


app.listen(3000, () => console.log('Gateway rodando na porta 3000'));
