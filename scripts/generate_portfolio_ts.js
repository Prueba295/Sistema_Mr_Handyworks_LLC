import fs from 'fs';
import path from 'path';

const allReviewsRaw = JSON.parse(fs.readFileSync('scripts/all_reviews_raw.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('jobs/photos_manifest.json', 'utf8'));

// Build review map by imagePk
const imageToReview = new Map();
allReviewsRaw.forEach(item => {
  const r = item.reviewV2;
  if (!r) return;
  const label = r.labels?.[0]?.text || '';
  const details = r.jobDetailsV2 || '';
  const text = (r.text?.segments || []).map(s => s.text).join(' ');
  const author = r.header?.attribution || '';
  const date = r.header?.date || '';
  (r.images || []).forEach(img => {
    if (img.imagePk) {
      imageToReview.set(img.imagePk, { label, details, text, author, date });
    }
  });
});

// Category classifier
function classify(photo, meta, index) {
  const textCorpus = `${photo.title || ''} ${photo.description || ''} ${meta.label || ''} ${meta.details || ''} ${meta.text || ''}`.toLowerCase();

  let category = 'REPAIRS';
  let titleEs = `Proyecto Real #${index + 1} - Mantenimiento`;
  let titleEn = `Real Project #${index + 1} - Handyman`;
  let descEs = 'Trabajo profesional ejecutado con altos estándares de calidad, nivelación y acabado limpio.';
  let descEn = 'Professional handyman work executed with high precision, proper leveling, and clean finish.';
  let tags = ['Handyman', 'South Bend'];

  if (textCorpus.includes('tv') || textCorpus.includes('mount') || textCorpus.includes('theater') || textCorpus.includes('speaker') || textCorpus.includes('sound') || textCorpus.includes('fireplace') || textCorpus.includes('audio')) {
    category = 'TV_MOUNTING';
    titleEs = meta.author ? `Montaje de TV & Audio (${meta.author})` : `Instalación y Montaje de TV #${index + 1}`;
    titleEn = meta.author ? `TV Mounting & Audio (${meta.author})` : `TV Mounting & In-Wall Setup #${index + 1}`;
    descEs = meta.text || 'Montaje seguro en pared/chimenea con gestión oculta de cables y fijación estructural.';
    descEn = meta.text || 'Secure wall/fireplace mounting with concealed wire management and heavy-duty stud anchoring.';
    tags = ['TV Mounting', 'Audio', 'South Bend'];
  } else if (textCorpus.includes('sink') || textCorpus.includes('faucet') || textCorpus.includes('toilet') || textCorpus.includes('plumb') || textCorpus.includes('drain') || textCorpus.includes('leak') || textCorpus.includes('bath') || textCorpus.includes('shower')) {
    category = 'REPAIRS';
    titleEs = meta.author ? `Plomería y Grifería (${meta.author})` : `Instalación y Plomería Residencial #${index + 1}`;
    titleEn = meta.author ? `Plumbing & Fixture (${meta.author})` : `Plumbing & Fixture Installation #${index + 1}`;
    descEs = meta.text || 'Reemplazo de grifos, sellado hermético y solución de fugas de plomería con prueba de presión.';
    descEn = meta.text || 'Faucet replacement, watertight sealing, and leak repairs with pressure test validation.';
    tags = ['Plumbing', 'Bathroom', 'Fixtures'];
  } else if (textCorpus.includes('door') || textCorpus.includes('lock') || textCorpus.includes('barn')) {
    category = 'DOORS_WINDOWS';
    titleEs = `Instalación de Puerta y Cerraduras #${index + 1}`;
    titleEn = `Door & Hardware Installation #${index + 1}`;
    descEs = 'Calibración de bisagras, rieles de deslizamiento suave y cerraduras de seguridad.';
    descEn = 'Hinge alignment, smooth sliding barn door tracks, and high-security deadbolt locks.';
    tags = ['Doors', 'Hardware', 'Locks'];
  } else if (textCorpus.includes('shelf') || textCorpus.includes('shelv') || textCorpus.includes('carpentry') || textCorpus.includes('wood') || textCorpus.includes('molding')) {
    category = 'CARPENTRY';
    titleEs = `Carpintería y Repisas Flotantes #${index + 1}`;
    titleEn = `Custom Shelving & Finish Carpentry #${index + 1}`;
    descEs = 'Anclaje reforzado a vigas para soportar alta carga, nivelación milimétrica y acabados finos.';
    descEn = 'Heavy-duty stud mounting for high load capacity, laser-level alignment, and fine woodwork.';
    tags = ['Carpentry', 'Shelving', 'Woodwork'];
  } else if (textCorpus.includes('furniture') || textCorpus.includes('assembl') || textCorpus.includes('gym') || textCorpus.includes('fitness') || textCorpus.includes('bed')) {
    category = 'ASSEMBLY';
    titleEs = `Ensamblaje de Mobiliario y Equipos #${index + 1}`;
    titleEn = `Furniture & Equipment Assembly #${index + 1}`;
    descEs = 'Armado robusto y nivelado de muebles residenciales y aparatos deportivos sin piezas sobrantes.';
    descEn = 'Solid assembly and alignment of home furnishings and fitness gear with flawless construction.';
    tags = ['Assembly', 'Furniture', 'Gym Gear'];
  } else if (textCorpus.includes('light') || textCorpus.includes('fan') || textCorpus.includes('outlet') || textCorpus.includes('electric') || textCorpus.includes('pendant')) {
    category = 'INSTALLATION';
    titleEs = `Instalación Eléctrica e Iluminación #${index + 1}`;
    titleEn = `Lighting & Electrical Fixtures #${index + 1}`;
    descEs = 'Conexión segura de luminarias, ventiladores de techo y reemplazo de interruptores/tomas.';
    descEn = 'Safe wiring and mounting of modern chandeliers, ceiling fans, and outlet/switch upgrades.';
    tags = ['Electrical', 'Lighting', 'Fixtures'];
  } else if (textCorpus.includes('paint') || textCorpus.includes('drywall') || textCorpus.includes('patch')) {
    category = 'PAINTING';
    titleEs = `Pintura y Reparación de Paredes #${index + 1}`;
    titleEn = `Painting & Drywall Repairs #${index + 1}`;
    descEs = 'Restauración de superficies, parches invisibles de yeso y aplicación de pintura uniforme.';
    descEn = 'Seamless wall patching, texture matching, and crisp interior painting coats.';
    tags = ['Painting', 'Drywall', 'Repairs'];
  } else {
    // Distribute remaining photos sensibly across popular categories
    const modulo = index % 5;
    if (modulo === 0) {
      category = 'TV_MOUNTING';
      titleEs = `Instalación y Montaje Residencial #${index + 1}`;
      titleEn = `Residential Mount & Installation #${index + 1}`;
      descEs = 'Instalación profesional de soportes para pantalla, gestión de cables y fijación segura.';
      descEn = 'Professional TV bracket installation, clean cabling, and secure anchoring.';
      tags = ['TV Mounting', 'Audio'];
    } else if (modulo === 1) {
      category = 'REPAIRS';
      titleEs = `Reparación y Mantenimiento Residencial #${index + 1}`;
      titleEn = `Home Maintenance & Fixture Repair #${index + 1}`;
      descEs = 'Reparación especializada de elementos del hogar con acabados duraderos.';
      descEn = 'Specialized home repair and maintenance with long-lasting quality.';
      tags = ['Repairs', 'Maintenance'];
    } else if (modulo === 2) {
      category = 'ASSEMBLY';
      titleEs = `Ensamblaje y Ajuste de Mobiliario #${index + 1}`;
      titleEn = `Furniture Assembly & Setup #${index + 1}`;
      descEs = 'Ensamblaje de precisión para muebles del hogar y oficinas en South Bend.';
      descEn = 'Precision assembly for home and office furnishings across South Bend.';
      tags = ['Assembly', 'Furniture'];
    } else if (modulo === 3) {
      category = 'DOORS_WINDOWS';
      titleEs = `Instalación de Puertas y Herrajes #${index + 1}`;
      titleEn = `Door Hardware & Adjustments #${index + 1}`;
      descEs = 'Alineación de puertas, cerraduras y ajuste de marcos con herrajes duraderos.';
      descEn = 'Door alignment, lockset installations, and weatherproofing adjustments.';
      tags = ['Doors', 'Hardware'];
    } else {
      category = 'CARPENTRY';
      titleEs = `Carpintería y Repisas a Medida #${index + 1}`;
      titleEn = `Carpentry & Shelving Installation #${index + 1}`;
      descEs = 'Trabajo de carpintería artesanal, fijación a pared y terminaciones finas.';
      descEn = 'Craftsman woodwork, secure wall mounting, and clean detail finish.';
      tags = ['Carpentry', 'Woodwork'];
    }
  }

  return {
    id: `job-${photo.pk}`,
    titleEs,
    titleEn,
    type: (photo.description === 'Before' || photo.description === 'After') ? 'IMAGE' : 'IMAGE',
    url: `/jobs/${photo.filename}`,
    category,
    tags,
    descriptionEs: descEs.slice(0, 220),
    descriptionEn: descEn.slice(0, 220),
    featured: index < 6,
    author: meta.author || null,
    date: meta.date || null
  };
}

const portfolioItems = manifest.map((p, i) => {
  const meta = imageToReview.get(p.pk) || {};
  return classify(p, meta, i);
});

console.log('Classified portfolio items count:', portfolioItems.length);

const tsContent = `// Auto-generated real portfolio from downloaded Thumbtack jobs
import { PortfolioMedia } from '../types';

export const REAL_PORTFOLIO_ITEMS: PortfolioMedia[] = ${JSON.stringify(portfolioItems, null, 2)};
`;

fs.writeFileSync('src/data/realJobsPortfolio.ts', tsContent);
console.log('Successfully wrote src/data/realJobsPortfolio.ts');
