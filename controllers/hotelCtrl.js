
const HotelModel = require('../models/hotelModel')
const mongoose = require('mongoose');

var id = '6685995b4e637077b0460307'

const hotelsData = [
    {
      name: 'Grand Plaza Hotel',
      price: 200,
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA',
        latitude: 39.7817,
        longitude: -89.6501,
      },
      rating: 4.5,
      images: [
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      ],
     createdBy:id,
      featured: true,
      amenities: ['pool', 'gym', 'spa'],
      description: 'A luxurious hotel in the heart of the city.',
    },
    {
      name: 'Oceanview Resort',
      price: 350,
      address: {
        street: '456 Beachside Ave',
        city: 'Malibu',
        state: 'CA',
        zipCode: '90265',
        country: 'USA',
        latitude: 34.0259,
        longitude: -118.7798,
      },
      rating: 5,
      images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcWWu9_WUImovRROEaM_VZsAQn8Cpnm9kovg&s"
      ],
     createdBy:id,
      featured: true,
      amenities: ['beach access', 'bar', 'restaurant'],
      description: 'Enjoy stunning ocean views and luxurious amenities at our beachside resort.',
    },
    {
      name: 'Mountain Escape Lodge',
      price: 150,
      address: {
        street: '789 Mountain Rd',
        city: 'Aspen',
        state: 'CO',
        zipCode: '81611',
        country: 'USA',
        latitude: 39.1911,
        longitude: -106.8175,
      },
      rating: 4.2,
      images: [
      "https://www.pexels.com/photo/palm-trees-at-night-258154",
            "https://www.pexels.com/photo/view-of-tourist-resort-338504"
      ],
     createdBy:id,
      featured: true,
      amenities: ['ski-in/ski-out', 'fireplace', 'hot tub'],
      description: 'Experience the tranquility of the mountains at our cozy lodge.',
    },
    {
      name: 'Lakeside Retreat',
      price: 250,
      address: {
        street: '101 Lakeview Dr',
        city: 'Lake Tahoe',
        state: 'CA',
        zipCode: '96150',
        country: 'USA',
        latitude: 38.9395,
        longitude: -119.9772,
      },
      rating: 4.7,
      images: [
         "https://www.pexels.com/photo/palm-trees-at-night-258154",
            "https://www.pexels.com/photo/view-of-tourist-resort-338504"
      ],
     createdBy:id,
      featured: false,
      amenities: ['lake view', 'spa', 'hiking trails'],
      description: 'Relax by the lake and enjoy breathtaking views at our lakeside retreat.',
    },
    {
      name: 'City Lights Inn',
      price: 180,
      address: {
        street: '555 Downtown Blvd',
        city: 'New York City',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.006,
      },
      rating: 4.0,
      images: [
            "https://www.pexels.com/photo/palm-trees-at-night-258154",
            "https://www.pexels.com/photo/view-of-tourist-resort-338504"
      ],
     createdBy:id,
      featured: true,
      amenities: ['city view', 'restaurant', 'bar'],
      description: 'Experience the vibrant city life from our centrally located inn.',
    },
    {
      name: 'Serenity Springs Resort',
      price: 300,
      address: {
        street: '222 Forest Lane',
        city: 'Big Sur',
        state: 'CA',
        zipCode: '93920',
        country: 'USA',
        latitude: 36.2704,
        longitude: -121.8083,
      },
      rating: 4.9,
      images: [
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      ],
     createdBy:id,
      featured: true,
      amenities: ['forest view', 'hot springs', 'spa'],
      description: 'Escape to nature and indulge in luxury at our serene resort in the woods.',
    },
    {
      name: 'Historic Mansion Hotel',
      price: 400,
      address: {
        street: '777 Heritage Ave',
        city: 'Charleston',
        state: 'SC',
        zipCode: '29401',
        country: 'USA',
        latitude: 32.7765,
        longitude: -79.9311,
      },
      rating: 4.8,
      images: [
       "https://www.pexels.com/photo/palm-trees-at-night-258154",
            "https://www.pexels.com/photo/view-of-tourist-resort-338504"
      ],
     createdBy:id,
      featured: false,
      amenities: ['historic charm', 'garden', 'fine dining'],
      description: 'Step back in time and experience luxury in a historic mansion hotel.',
    },
    {
      name: 'Tropical Paradise Resort',
      price: 280,
      address: {
        street: '123 Palm Beach Rd',
        city: 'Maui',
        state: 'HI',
        zipCode: '96761',
        country: 'USA',
        latitude: 20.7984,
        longitude: -156.3319,
      },
      rating: 4.6,
      images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcWWu9_WUImovRROEaM_VZsAQn8Cpnm9kovg&s"
      ],
     createdBy:id,
      featured: false,
      amenities: ['beachfront', 'pool', 'spa'],
      description: 'Relax on pristine beaches and enjoy island life at our tropical resort.',
    },
    {
      name: 'Alpine Lodge',
      price: 180,
      address: {
        street: '321 Mountain View Ave',
        city: 'Lake Placid',
        state: 'NY',
        zipCode: '12946',
        country: 'USA',
        latitude: 44.2795,
        longitude: -73.9791,
      },
      rating: 4.3,
      images: [
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      ],
     createdBy:id,
      featured: false,
      amenities: ['mountain view', 'skiing', 'hot tub'],
      description: 'Experience the beauty of the Adirondacks at our cozy alpine lodge.',
    },
    {
      name: 'Seaside Villa',
      price: 320,
      address: {
        street: '888 Oceanfront Blvd',
        city: 'Santa Barbara',
        state: 'CA',
        zipCode: '93101',
        country: 'USA',
        latitude: 34.4208,
        longitude: -119.6982,
      },
      rating: 4.7,
      images: [
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcWWu9_WUImovRROEaM_VZsAQn8Cpnm9kovg&s"
      ],
     createdBy:id,
      featured: true,
      amenities: ['oceanfront view', 'private beach', 'pool'],
      description: 'Experience luxury by the sea at our exquisite seaside villa.',
    }
  ];
//   HotelModel.insertMany(hotelsData)
//   .then(() => console.log('Featured hotels set successfully'))
//   .catch(error => console.error('Error setting featured hotels:', error))

const hotelCtrl = {
    create: async (req, res) => {
        try {
            const newHotel = new HotelModel(req?.body);
            const savedHotel = await newHotel.save();
            res.json(savedHotel);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const hotels = await HotelModel.find().populate('rooms');
            res.json(hotels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getDetail: async (req, res) => {
        try {
            const { hotel_id } = req.body; // Use params instead of body
            if (!hotel_id) {
                return res.status(400).json({ message: 'Hotel ID is required' });
            }
            const hotel = await HotelModel.findById(hotel_id).populate('rooms');
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
            res.json(hotel);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    getFeaturedHotels: async (req, res) => {
        try {
            const featuredHotels = await HotelModel.find({ featured: true }).populate('rooms');;
            res.json(featuredHotels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    upload: async (req, res) => {
        try {
            if (!req.imageUrls || req.imageUrls.length === 0) {
                return res.status(400).send('No files uploaded.');
            }
              // const imageUrls = req.imageUrls
              const imageUrls = req.imageUrls.map(imageUrl => `${req.protocol}://${req.get('host')}/${imageUrl}`);
            res.status(200).json({ imageUrls });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getHotelsByCreatedBy: async (req, res) => {
        try {
            const { user_id } = req.params;
            if (!user_id) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ message: 'Invalid user id value' });
            }

            const hotels = await HotelModel.find({ createdBy: user_id });
            res.json(hotels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getHotelsByAddress: async (req, res) => {
        try {
            const { city, country ,name ,search} = req.query;

            const query = {};
            // if (city) {
            //     query['address.city'] = { $regex: new RegExp(city, 'i') };
            // }
            // if (country) {
            //     query['address.country'] = { $regex: new RegExp(country, 'i') };
            // }
            // if (name) {
            //     query['name'] = { $regex: new RegExp(name, 'i') };
            // }

                query['address.city'] = { $regex: new RegExp(search, 'i') };
                query['address.country'] = { $regex: new RegExp(search, 'i') };
                query['name'] = { $regex: new RegExp(search, 'i') };

            const hotels = await HotelModel.find({
                $or: [
                    { 'address.city': query['address.city'] },
                    { 'address.country': query['address.country'] },
                    { 'name': query['name'] }
                ]
            });
            res.json(hotels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
}

module.exports = hotelCtrl