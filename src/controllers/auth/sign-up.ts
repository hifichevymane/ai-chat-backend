import { Request, Response } from 'express';
import { DatabaseSource } from '../../database/index.ts';
import { User } from '../../database/entities/User.ts';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Check if the user already exists
    const userRepository = DatabaseSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email, name } });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Create a new user
    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = password;
    await newUser.hashPassword();
    await userRepository.save(newUser);

    const { password: _userPassword, ...userData } = newUser;
    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
