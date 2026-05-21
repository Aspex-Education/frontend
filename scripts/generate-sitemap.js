const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : undefined;

    if (!projectId || !clientEmail || !privateKey) {
      console.error("❌ Firebase environment variables are missing.");
      console.error("Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment.");
      throw new Error("Missing required Firebase environment variables.");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    const db = admin.firestore();
    const querySnapshot = await db.collection('ofertas')
      .where('activa', '==', true)
      .get();

    const todayStr = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Add static home page
    xml += `  <url>\n`;
    xml += `    <loc>https://confex-dev.netlify.app/</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    let count = 0;
    querySnapshot.forEach((doc) => {
      xml += `  <url>\n`;
      xml += `    <loc>https://confex-dev.netlify.app/oferta/${doc.id}</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
      count++;
    });

    xml += `</urlset>\n`;

    const outputPath = path.join(__dirname, '..', 'src', 'sitemap.xml');
    
    // Ensure parent directory exists (just in case)
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, xml, 'utf8');

    console.log(`✅ Sitemap generated successfully with ${count} active offers!`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message || error);
    process.exit(1);
  }
}

run();
