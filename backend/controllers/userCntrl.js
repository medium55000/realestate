import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createUser = asyncHandler(async (req, res) => {
  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: 'user registered successfully',
      user: user,
    });
  } else res.status(201).send({ message: 'User already registerd' });
});

export const bookVisit = asyncHandler(async (req, res) => {
  // const { email, date } = req.body;
  // const { id } = req.params;

  // if (!email || !id) {
  //   return res.status(400).json({ message: 'email and id are required' });
  // }

  // try {
  //   const alreadyBooked = await prisma.user.findUnique({
  //     where: { email },
  //     select: { bookedVisits: true },
  //   });

  //   if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
  //     res.status(400).json({ message: 'This residency already booked by you' });
  //   } else {
  //     await prisma.user.update({
  //       where: { email: email },
  //       data: {
  //         bookedVisits: { push: { id: id } },
  //       },
  //     });
  //   }
  //   res.send('Your visit is booked successfull');
  const { email, date } = req.body;
  const { id } = req.params;

  if (!email || !id) {
    return res.status(400).json({ message: 'email and id are required' });
  }

  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        createdAt: { set: new Date() },
      },
      create: {
        email,
        name: null,
        image: null,
        bookedVisits: [],
        favResidenciesID: [],
        createdAt: new Date(),
      },
    });

    const current = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    const already = current?.bookedVisits?.some((v) => v?.id === id);
    if (already) {
      return res
        .status(400)
        .json({ message: 'This residency already booked by you' });
    }

    await prisma.user.update({
      where: { email },
      data: {
        bookedVisits: { push: { id, date } },
        createdAt: { set: new Date() },
      },
    });

    return res
      .status(200)
      .json({ message: 'Your visit is booked successfully' });
  } catch (err) {
    throw new Error(err.message);
  }
});

// function for allBookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

// function for cancel a booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'No Booking found' });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.send('Booking cancelled successfully');
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function for addtofavourite list
export const toFav = asyncHandler(async (req, res) => {
  console.log('Adding to favourites'); // Log to ensure function is called
  console.log('Request body:', req.body); // Log to debug request body

  const { email } = req.body;
  const { rid } = req.params;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });
      res.send({ message: 'Removed from favourite', user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: 'Updated favorites', user: updateUser });
    }
  } catch (err) {
    // Log error
    console.error('Error in toFav function:', err.message);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// function to getallfav
export const getAllFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favResd);
  } catch (err) {
    throw new Error(err.message);
  }
});
