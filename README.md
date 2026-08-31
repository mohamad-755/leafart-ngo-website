# I Leaf Art — NGO Website

Website for [I Leaf Art](https://www.instagram.com/i.leaf.art/), a Lebanese non-profit based in Mtayleb, Beirut, founded in 2012. The organization creates community murals across Lebanon, partnering with artists, volunteers, children, schools, and families to transform public spaces into symbols of hope, identity, and connection.

Live site: https://leafart-ngo-website.vercel.app

## About the project

A multi-page marketing and outreach site covering the organization's mission, past mural projects, ways to get involved, donations, and contact information. Built as a static site — plain HTML, CSS, and vanilla JavaScript, no framework or build step — and deployed on Vercel.

## Pages

- `index.html` — home / hero
- `mission.html` — the organization's mission and story
- `our-work.html` — past mural and community projects
- `get-involved.html` — volunteering and partnership info
- `donate.html` — donation info
- `contact.html` — contact details and form
- `faq.html` — frequently asked questions
- `shop.html` — merchandise (currently unlinked from navigation, kept for future use)

## Structure

```
public/
  *.html        page templates
  style.css     shared styles
  main.js       shared interactivity (nav, forms, analytics events)
  images/       site imagery
  sitemap.xml, robots.txt
```

## Running locally

```bash
npm run dev
```

Serves the `public/` directory at [http://localhost:3000](http://localhost:3000).
