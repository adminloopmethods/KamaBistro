import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create styles for contents (sections) with more appealing styles
  const styleHeader = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: {
        backgroundColor: '#f8f9fa',
        padding: '40px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderBottom: '2px solid #dee2e6',
      },
      lg: {
        backgroundColor: '#f8f9fa',
        padding: '30px',
        boxShadow: '0 3px 7px rgba(0,0,0,0.1)',
        borderBottom: '2px solid #dee2e6',
      },
      md: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #dee2e6',
      },
      sm: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        boxShadow: 'none',
        borderBottom: '1px solid #dee2e6',
      },
    },
  });

  const styleMain = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: {
        padding: '50px',
        fontSize: '20px',
        lineHeight: '1.6',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#343a40',
        maxWidth: '900px',
        margin: 'auto',
      },
      lg: {
        padding: '40px',
        fontSize: '18px',
        lineHeight: '1.5',
        color: '#343a40',
        margin: 'auto',
      },
      md: {
        padding: '30px',
        fontSize: '16px',
        lineHeight: '1.4',
        margin: 'auto',
      },
      sm: {
        padding: '20px',
        fontSize: '14px',
        lineHeight: '1.3',
        margin: 'auto',
      },
    },
  });

  const styleFooter = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: {
        backgroundColor: '#212529',
        color: '#f8f9fa',
        padding: '30px',
        textAlign: 'center',
        fontSize: '16px',
        fontFamily: "'Courier New', Courier, monospace",
        borderTop: '3px solid #495057',
      },
      lg: {
        backgroundColor: '#212529',
        color: '#f8f9fa',
        padding: '25px',
        textAlign: 'center',
        fontSize: '14px',
      },
      md: {
        backgroundColor: '#212529',
        color: '#f8f9fa',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
      },
      sm: {
        backgroundColor: '#212529',
        color: '#f8f9fa',
        padding: '15px',
        textAlign: 'center',
        fontSize: '10px',
      },
    },
  });

  // Create webpage
  const homePageId = 'home-page';
  const homePage = await prisma.webpage.upsert({
    where: { id: homePageId },
    update: {
      name: 'Home',
      route: '/',
      currentVersion: 'v1',
    },
    create: {
      id: homePageId,
      name: 'Home',
      route: '/',
      currentVersion: 'v1',
    },
  });

  // Create contents for webpage, each with unique style
  const homeHeroContentId = uuidv4();
  const homeAboutContentId = uuidv4();
  const homeFooterContentId = uuidv4();

  const homeHero = await prisma.content.create({
    data: {
      id: homeHeroContentId,
      name: 'Hero Section',
      order: 0,
      webpageId: homePage.id,
      styleId: styleHeader.id,
    },
  });

  const homeAbout = await prisma.content.create({
    data: {
      id: homeAboutContentId,
      name: 'About Section',
      order: 1,
      webpageId: homePage.id,
      styleId: styleMain.id,
    },
  });

  const homeFooter = await prisma.content.create({
    data: {
      id: homeFooterContentId,
      name: 'Footer',
      order: 2,
      webpageId: homePage.id,
      styleId: styleFooter.id,
    },
  });

  // Create unique styles for each element (due to @unique constraint on styleId in Element)
  // Hero Section elements styles:
  const styleHeroImg = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: { width: '100%', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' },
      lg: { width: '100%', borderRadius: '10px', boxShadow: '0 5px 10px rgba(0,0,0,0.14)' },
      md: { width: '100%', borderRadius: '8px' },
      sm: { width: '100%', borderRadius: '6px' },
    },
  });
  const styleHeroH1 = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: { color: '#0d6efd', fontSize: '48px', fontWeight: '700', margin: '20px 0' },
      lg: { color: '#0d6efd', fontSize: '40px', fontWeight: '700', margin: '18px 0' },
      md: { color: '#0d6efd', fontSize: '32px', fontWeight: '600', margin: '16px 0' },
      sm: { color: '#0d6efd', fontSize: '24px', fontWeight: '600', margin: '14px 0' },
    },
  });
  const styleHeroP = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: { color: '#212529', fontSize: '20px', marginBottom: '30px' },
      lg: { color: '#212529', fontSize: '18px', marginBottom: '25px' },
      md: { color: '#212529', fontSize: '16px', marginBottom: '20px' },
      sm: { color: '#212529', fontSize: '14px', marginBottom: '18px' },
    },
  });

  // About Section elements styles:
  const styleAboutH1 = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: { color: '#198754', fontSize: '36px', fontWeight: '700', marginBottom: '20px' },
      lg: { color: '#198754', fontSize: '32px', fontWeight: '700', marginBottom: '18px' },
      md: { color: '#198754', fontSize: '28px', fontWeight: '600', marginBottom: '16px' },
      sm: { color: '#198754', fontSize: '24px', fontWeight: '600', marginBottom: '14px' },
    },
  });
  const styleAboutP = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: { color: '#495057', fontSize: '18px', lineHeight: '1.6' },
      lg: { color: '#495057', fontSize: '16px', lineHeight: '1.5' },
      md: { color: '#495057', fontSize: '14px', lineHeight: '1.4' },
      sm: { color: '#495057', fontSize: '13px', lineHeight: '1.3' },
    },
  });

  // Footer Section element style:
  const styleFooterP = await prisma.style.create({
    data: {
      id: uuidv4(),
      xl: { color: '#adb5bd', fontSize: '14px', fontStyle: 'italic' },
      lg: { color: '#adb5bd', fontSize: '13px', fontStyle: 'italic' },
      md: { color: '#adb5bd', fontSize: '12px', fontStyle: 'italic' },
      sm: { color: '#adb5bd', fontSize: '11px', fontStyle: 'italic' },
    },
  });

  // Create elements for Hero Section
  await prisma.element.create({
    data: {
      id: uuidv4(),
      name: 'img',
      content: '@/assets/hero-background.jpg',
      order: 0,
      contentId: homeHero.id,
      styleId: styleHeroImg.id,
    },
  });

  await prisma.element.create({
    data: {
      id: uuidv4(),
      name: 'h1',
      content: 'Welcome to Our Website',
      order: 1,
      contentId: homeHero.id,
      styleId: styleHeroH1.id,
    },
  });

  await prisma.element.create({
    data: {
      id: uuidv4(),
      name: 'p',
      content: 'Discover our amazing services and solutions.',
      order: 2,
      contentId: homeHero.id,
      styleId: styleHeroP.id,
    },
  });

  // Create elements for About Section
  await prisma.element.create({
    data: {
      id: uuidv4(),
      name: 'h1',
      content: 'About Us',
      order: 0,
      contentId: homeAbout.id,
      styleId: styleAboutH1.id,
    },
  });

  await prisma.element.create({
    data: {
      id: uuidv4(),
      name: 'p',
      content: 'We provide quality services and solutions.',
      order: 1,
      contentId: homeAbout.id,
      styleId: styleAboutP.id,
    },
  });

  // Create element for Footer Section
  await prisma.element.create({
    data: {
      id: uuidv4(),
      name: 'p',
      content: '© 2025 Your Company. All rights reserved.',
      order: 0,
      contentId: homeFooter.id,
      styleId: styleFooterP.id,
    },
  });

  console.log('Seed data saved successfully with enhanced, visually appealing styles.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
