/* eslint-disable no-undef */
const mongoose = require('mongoose');
const supertest = require('supertest');
const ShortUrl = require('./models/shortUrl');

beforeEach((done) => {
  mongoose.connect(
    'mongodb://localhost/shortster',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done(),
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test('GET /', async () => {
  const shorturl = await ShortUrl.create({
    full:
      'https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js',
    short: '3YD7hn5vr',
    clicks: 2,
    createdAt: '2020-12-14T21:40:12.648+00:00',
    visitedAt: '2020-12-14T21:40:12.648+00:00',
  });

  await supertest(app)
    .get('/:shortUrl')
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check the response data
      expect(response.body[0].id).toBe(shorturl.id);
      expect(response.body[0].full).toBe(shorturl.full);
      expect(response.body[0].short).toBe(shorturl.short);
      expect(response.body[0].clicks).toBe(shorturl.clicks);
      expect(response.body[0].createdAt).toBe(shorturl.createdAt);
      expect(response.body[0].visitedAt).toBe(shorturl.visitedAt);
    });
});

test('POST /shortUrls', async () => {
  const data = {
    full:
      'https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js',
    short: '3YD7hn5vr',
    clicks: 2,
    createdAt: '2020-12-14T21:40:12.648+00:00',
    visitedAt: '2020-12-14T21:40:12.648+00:00',
  };

  await supertest(app)
    .post('/shortUrls')
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.id).toBeTruthy();
      expect(response.body.full).toBe(data.full);
      expect(response.body.short).toBe(data.short);
      expect(response.body.clicks).toBe(data.clicks);
      expect(response.body.createdAt).toBe(data.createdAt);
      expect(response.body.visitedAt).toBe(data.visitedAt);

      // Check the data in the database
      const Shorturl = await ShortUrl.findOne({ _id: response.body.id });
      expect(Shorturl).toBeTruthy();
      expect(Shorturl.full).toBe(data.full);
      expect(Shorturl.short).toBe(data.short);
      expect(Shorturl.clicks).toBe(data.clicks);
      expect(Shorturl.createdAt).toBe(data.createdAt);
      expect(Shorturl.visitedAt).toBe(data.visitedAt);
    });
});
