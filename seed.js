import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, default: 'General' },
    linkUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  });

  const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);

  await Announcement.create({
    title: 'Welcome to JuriLingo! We are excited to announce our new platform.',
    type: 'General',
    linkUrl: ''
  });

  await Announcement.create({
    title: 'New Moot Court Competition registrations are now open!',
    type: 'Competition',
    linkUrl: '/competitions'
  });

  console.log('Dummy announcements created!');
  process.exit(0);
}

seed();
