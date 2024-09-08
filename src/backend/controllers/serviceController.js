import Service from '../models/service';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, image, startingPrice } = req.body;

    if (!name || !image || startingPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, image, startingPrice',
      });
    }

    const newService = await Service.create({ name, image, startingPrice });

    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
};
