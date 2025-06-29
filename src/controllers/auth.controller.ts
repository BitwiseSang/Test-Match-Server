import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export async function registerTester(req: Request, res: Response) {
  try {
    const avatar = req.file ? req.file.buffer : undefined;
    const token = await AuthService.registerTester({ ...req.body, avatar });
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginTester(req: Request, res: Response) {
  try {
    const token = await AuthService.loginTester(
      req.body.email,
      req.body.password
    );
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function registerClient(req: Request, res: Response) {
  try {
    const avatar = req.file ? req.file.buffer : undefined;
    const token = await AuthService.registerClient({ ...req.body, avatar });
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginClient(req: Request, res: Response) {
  try {
    const token = await AuthService.loginClient(
      req.body.email,
      req.body.password
    );
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
