import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createResidency = asyncHandler(async (req, res) => {
  const payload = req.body?.data ?? req.body ?? {};

  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = payload;

  const required = [
    'title',
    'price',
    'address',
    'city',
    'country',
    'userEmail',
  ];

  const missing = required.filter(
    (k) => payload[k] == null || payload[k] === ''
  );

  if (missing.length) {
    return res
      .status(400)
      .json({ message: `missing fields: ${missing.join(', ')}` });
  }

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });
    res.send({ message: 'Residency created successfully', residency });
  } catch (err) {
    if (err.code === 'P2002') {
      throw new Error('A residency with address already there');
    }
  }
});

// get all residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json(residencies);
});

// get a residency by id
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(`getResidency ${id}`);
  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    res.status(200).json(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});
