require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Speaker = require('./models/Speaker');
const ScheduleDay = require('./models/ScheduleDay');
const FestivalInfo = require('./models/FestivalInfo');
const Sponsor = require('./models/Sponsor');
const { events, speakers, scheduleDays, festivalInfo, sponsors } = require('./seedData');

async function seedDatabase() {
  await Promise.all([Event.init(), Speaker.init(), ScheduleDay.init(), FestivalInfo.init(), Sponsor.init()]);
  for (const event of events) {
    const seedKey = `eventspark:${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    await Event.updateOne(
      { title: event.title, seedKey: { $exists: false } },
      { $set: { seedKey } }
    );
    event.seedKey = seedKey;
  }

  const [eventResult, speakerResult, scheduleResult, sponsorResult] = await Promise.all([
    Event.bulkWrite(events.map((event) => ({
      updateOne: {
        filter: { seedKey: event.seedKey },
        update: { $setOnInsert: event },
        upsert: true,
      },
    }))),
    Speaker.bulkWrite(speakers.map((speaker) => ({
      updateOne: {
        filter: { name: speaker.name },
        update: { $setOnInsert: speaker },
        upsert: true,
      },
    }))),
    ScheduleDay.bulkWrite(scheduleDays.map((day) => ({
      updateOne: {
        filter: { dayNumber: day.dayNumber },
        update: { $setOnInsert: day },
        upsert: true,
      },
    }))),
    Sponsor.bulkWrite(sponsors.map((sponsor) => ({
      updateOne: {
        filter: { name: sponsor.name },
        update: { $setOnInsert: sponsor },
        upsert: true,
      },
    }))),
  ]);
  await FestivalInfo.updateOne(
    { key: festivalInfo.key },
    { $set: festivalInfo },
    { upsert: true, runValidators: true }
  );

  const result = {
    events: eventResult.upsertedCount,
    speakers: speakerResult.upsertedCount,
    scheduleDays: scheduleResult.upsertedCount,
    sponsors: sponsorResult.upsertedCount,
  };
  console.log(
    `Seed complete: ${result.events} events, ${result.scheduleDays} schedule days, `
    + `${result.speakers} speakers, ${result.sponsors} sponsors added; existing records were preserved.`
  );
  return result;
}

if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventspark';
  mongoose.connect(uri)
    .then(seedDatabase)
    .catch((error) => {
      console.error('EventSpark database seeding failed:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    });
}

module.exports = { seedDatabase };
