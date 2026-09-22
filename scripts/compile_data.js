import fs from 'fs';
import path from 'path';

const servicePage = JSON.parse(fs.readFileSync('scripts/service_page_data.json', 'utf8'));
const allReviewsRaw = JSON.parse(fs.readFileSync('scripts/all_reviews_raw.json', 'utf8'));
const photosManifest = JSON.parse(fs.readFileSync('jobs/photos_manifest.json', 'utf8'));

// Format all 80 reviews
const reviewsFormatted = [];
const seenReviewKeys = new Set();

allReviewsRaw.forEach(item => {
  const rev = item.reviewV2;
  if (!rev) return;
  const author = rev.header?.attribution || 'Verified Customer';
  const text = (rev.text?.segments || []).map(s => s.text).join(' ').trim();
  const date = rev.header?.date || '';
  const rating = rev.header?.rating?.rating || 5;
  const key = `${author}_${date}_${text.slice(0, 30)}`;
  if (seenReviewKeys.has(key)) return;
  seenReviewKeys.add(key);

  reviewsFormatted.push({
    id: reviewsFormatted.length + 1,
    author,
    rating,
    date,
    verified: rev.header?.verifier?.text || 'Verified',
    jobLabel: rev.labels?.[0]?.text || 'Handyman',
    jobDetails: rev.jobDetailsV2 || '',
    text,
    images: (rev.images || []).map(img => img.imagePk),
    response: rev.response?.text || null
  });
});

// Extract Specialties
const specSec = servicePage.sections.find(s => s.__typename === 'ServicePageSpecialtiesSection');
const specialties = [];
if (specSec?.sections) {
  specSec.sections.forEach(group => {
    const heading = group.heading || group.title || 'General';
    const interested = (group.interestedItems || []).map(it => {
      return (it.specialty?.segments || []).map(s => s.text).join('').trim();
    }).filter(Boolean);
    const uninterested = (group.uninterestedItems || []).map(it => {
      return (it.specialty?.segments || []).map(s => s.text).join('').trim();
    }).filter(Boolean);

    specialties.push({
      category: heading,
      services: interested,
      notOffered: uninterested
    });
  });
}

// Extract Overview & FAQ items
const bizSec = servicePage.sections.find(s => s.__typename === 'ServicePageBusinessInfoSection');
const businessSubsections = [];
if (bizSec?.subsections) {
  bizSec.subsections.forEach(sub => {
    const title = sub.title || 'Info';
    const items = [];
    if (sub.items) {
      sub.items.forEach(it => {
        const t = (it.title?.segments || []).map(s => s.text).join('').trim();
        const d = (it.description?.segments || []).map(s => s.text).join('').trim();
        if (t || d) items.push({ title: t, description: d });
      });
    }
    businessSubsections.push({ title, items });
  });
}

const completeData = {
  business: {
    name: 'Mr Handyworks LLC',
    owner: 'Brian Cueva',
    location: 'South Bend, IN 46615',
    category: 'Handyman, Home Improvement, General Contractor',
    badge: 'Top Pro',
    thumbtackRating: 5.0,
    totalReviews: reviewsFormatted.length,
    responseTime: 'Responds in about 2 hours',
    status: 'Licensed, Bonded & Insured',
    backgroundCheck: 'Verified by Thumbtack',
    moneyBackGuarantee: 'Thumbtack Guarantee Eligible',
    introduction: `Hi, I’m Brian, owner of Mr. Handyworks LLC. I provide professional home repairs, installations, and remodeling services; done right the first time.
From TV mounting and fixture installations to carpentry, painting, and general repairs, I take pride in delivering clean, precise work with strong attention to detail. No shortcuts, no guesswork, just solid, dependable results.
Most of my work comes from repeat clients and referrals, which reflects the quality and consistency I bring to every job.
Mr. Handyworks LLC is fully insured and bonded, so you can have peace of mind knowing your home is in safe, professional hands. I believe in clear communication, fair pricing, and showing up when I say I will.
If you’re looking for someone reliable who treats your home with respect and takes pride in the work, I’m ready to help.`,
    phone: '(574) 279-9355',
    thumbtackUrl: 'https://www.thumbtack.com/in/south-bend/handyman/mr-handyworks-llc/service/557892581429960708'
  },
  photos: {
    total: photosManifest.length,
    folder: 'jobs',
    items: photosManifest.map(p => ({
      filename: p.filename,
      id: p.pk,
      type: p.type,
      localPath: `jobs/${p.filename}`
    }))
  },
  specialties,
  subsections: businessSubsections,
  reviews: reviewsFormatted
};

// Write JSON
fs.writeFileSync('thumbtack_scraped_data.json', JSON.stringify(completeData, null, 2));

// Generate clean Markdown Report
let md = `# Datos Reales de Mr Handyworks LLC (Extraídos de Thumbtack)

Este documento reúne toda la información comercial real, servicios, garantías, fotos de trabajos y reseñas de clientes extraídas del perfil oficial de **Mr Handyworks LLC** en Thumbtack para la construcción de su página web profesional.

---

## 1. Información General y Credenciales

- **Empresa:** ${completeData.business.name}
- **Propietario / Artesano:** ${completeData.business.owner}
- **Ubicación:** ${completeData.business.location}
- **Reconocimiento:** ⭐ **${completeData.business.badge}** (100% calificaciones de 5 estrellas)
- **Calificación promedio:** ${completeData.business.thumbtackRating} / 5.0 (${completeData.business.totalReviews} reseñas verificadas)
- **Tiempo promedio de respuesta:** ${completeData.business.responseTime}
- **Seguro y Garantía:** ${completeData.business.status}
- **Verificación de Antecedentes:** ${completeData.business.backgroundCheck}
- **Garantía comercial:** ${completeData.business.moneyBackGuarantee}
- **Teléfono de contacto:** ${completeData.business.phone}
- **Enlace de origen:** [Perfil oficial en Thumbtack](${completeData.business.thumbtackUrl})

### Presentación de Brian Cueva (Bio oficial)
> "${completeData.business.introduction.replace(/\n/g, '\n> ')}"

---

## 2. Galería de Trabajos Realizados (${completeData.photos.total} fotos)
Todas las fotos en alta resolución han sido descargadas y organizadas en la carpeta: \`jobs/\`
- Total descargadas: **${completeData.photos.total} imágenes** (20+ MB de trabajos reales)
- Las imágenes incluyen: Montaje de televisores de gran tamaño, instalación de home theaters y barras de sonido, reemplazo de grifos y plomería de baños/cocinas, ensamblaje de muebles complejos, carpintería fina, puertas exteriores e interiores, e instalaciones eléctricas.

---

## 3. Servicios y Especialidades Oficiales

`;

specialties.forEach(spec => {
  md += `### ${spec.category}\n`;
  if (spec.services.length > 0) {
    spec.services.forEach(s => {
      md += `- ✅ ${s}\n`;
    });
  }
  if (spec.notOffered.length > 0) {
    spec.notOffered.forEach(n => {
      md += `- ❌ ${n}\n`;
    });
  }
  md += '\n';
});

md += `---

## 4. Reseñas Verificadas de Clientes (${reviewsFormatted.length} Testimonios Reales)

| # | Cliente | Calificación | Fecha | Servicio | Resumen / Testimonio |
|---|---------|-------------|-------|----------|----------------------|
`;

reviewsFormatted.slice(0, 30).forEach(r => {
  const shortText = r.text.replace(/\|/g, '-').replace(/\n/g, ' ').slice(0, 140);
  md += `| ${r.id} | **${r.author}** | ⭐ ${r.rating}.0 | ${r.date} | ${r.jobLabel} | "${shortText}..." |\n`;
});

md += `\n*(Nota: Las ${reviewsFormatted.length} reseñas completas con sus detalles de trabajo se encuentran estructuradas en \`thumbtack_scraped_data.json\`)*\n`;

fs.writeFileSync('thumbtack_company_data.md', md);
console.log('Successfully written thumbtack_scraped_data.json and thumbtack_company_data.md');
