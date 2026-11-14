/**
 * Copy for Our Story, The BELYN Promise and The People Behind BELYN.
 * Photos and the founders' video are optional: leave the path empty and the page shows a clean
 * monogram / hides the video until the real file is added to /public/images (or /public/videos).
 */
export const story = {
  lead: 'Two ordinary people. Two different worlds. One shared dream.',
  intro: 'What started as a quiet hope across miles is now BELYN — a piece of our home, built with pure faith and love, and shared straight from us to the world.',
  chapters: [
    { id: 'beginning', title: 'The Beginning', text: 'A simple dream, a shared belief and a desire to create something meaningful.' },
    { id: 'roots', title: 'Our Roots & Inspiration', text: 'Inspired by Kashmir’s natural beauty, timeless traditions and the place we call home.' },
    { id: 'beliefs', title: 'Our Beliefs', text: 'Honesty, thoughtful selection and a deep appreciation for nature.' },
    { id: 'vision', title: 'Our Vision', text: 'To bring the natural richness and flavours of Kashmir to the world.' },
  ],
  home: {
    title: 'From Our Home to the World',
    lines: [
      'What began as a dream close to home is slowly finding its way beyond it.',
      'BELYN is our way of sharing a little of where we come from — the flavours, warmth and natural richness that have always been part of our world.',
    ],
  },
  continues: { title: 'Our Story Continues', text: 'Every step is another chapter. Thank you for being a part of our journey.' },
  closing: 'BELYN — Born in the Quiet Winters of Kashmir.',
  banner: '' as string, // e.g. '/images/story-banner.jpg'
};

export const promise = {
  title: 'The BELYN Promise',
  tagline: 'Thoughtfully chosen. Honestly presented. Shared with care.',
  intro: 'A commitment to thoughtful selection, honest ingredients and care in every detail.',
  items: [
    { id: 'selection', title: 'Thoughtful Selection', text: 'Every product is chosen with attention to its natural character, quality and origin.' },
    { id: 'ingredients', title: 'Honest Ingredients', text: 'We believe in clear ingredient information and transparency about what goes into our products.' },
    { id: 'presentation', title: 'Careful Presentation', text: 'From product packaging to the final presentation, every detail deserves care.' },
    { id: 'information', title: 'Clear Product Information', text: 'We believe customers deserve clear information about ingredients, nutritional values, sourcing and storage.' },
    // No laboratory names, certificate numbers or results are shown unless BELYN officially provides them.
    { id: 'lab', title: 'Lab Tested for Purity', text: 'Where applicable, our products are supported by appropriate testing to help ensure quality and purity.' },
    { id: 'experience', title: 'A Thoughtful Experience', text: 'We want every interaction with BELYN to feel simple, considered and personal.' },
  ],
  grows: { title: 'A Promise That Grows With Us', text: 'As BELYN grows, our commitment remains the same: to make thoughtful choices, communicate honestly and treat every detail with care.' },
  forward: { title: 'A Promise We Carry Forward', text: 'A promise to choose thoughtfully, present honestly and share with care.' },
  banner: '' as string,
};

export const people = {
  title: 'The People Behind BELYN',
  video: '' as string, // founders' introduction video, e.g. '/videos/founders.mp4'
  poster: '' as string,
  founders: [
    { name: 'Tasaduq Ali', role: 'Founder', photo: '' },
    { name: 'Bengia Ashik', role: 'Co-Founder', photo: '' },
  ],
  vision: { title: 'One Vision, One Journey', text: 'Two perspectives, one shared dream. Built with patience, shaped by purpose, and brought to life together.' },
  values: {
    eyebrow: 'What we believe in',
    title: 'Our Values',
    items: ['Thoughtful in every choice', 'Honest in every detail', 'Respect for what nature offers', 'Always growing, always learning'],
  },
  beyond: { title: 'Beyond the Brand', text: 'The little moments behind the bigger dream.' },
  note: {
    title: 'A Note from Our Founders',
    paras: ['Every dream carries a story, and BELYN carries a little piece of ours.', 'We are still learning, building and growing. Thank you for taking the time to know the people and the thought behind this journey.'],
    signoff: 'With love,',
    signed: 'The Founders of BELYN',
  },
  closing: 'BELYN — A shared dream, made to be shared with the world.',
};
