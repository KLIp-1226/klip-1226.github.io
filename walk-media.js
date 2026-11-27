(() => {
  // The original paths also identify cards in the saved collage layout.
  const albumPaths = {
  "everyday": [
    {
      "type": "video",
      "src": "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/5.1.mp4"
    },
    {
      "type": "video",
      "src": "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_0018.mp4"
    },
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_0033.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_0044.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_0601.jpg",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_0692.jpg",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_0924.jpg",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_5937.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_6225.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_6329.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_6371.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_6383.JPG",
    "%E7%85%A7%E7%89%87/everyday%20%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC/IMG_6390.JPG"
  ],
  "2026-09-25": [
    "%E7%85%A7%E7%89%87/2026-09-25%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E6%83%85%E4%BE%A3%E5%90%88%E7%85%A7%E5%92%8C%E6%89%8B%E7%85%A7/3.2.JPG",
    "%E7%85%A7%E7%89%87/2026-09-25%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E6%83%85%E4%BE%A3%E5%90%88%E7%85%A7%E5%92%8C%E6%89%8B%E7%85%A7/3.3.JPG",
    "%E7%85%A7%E7%89%87/2026-09-25%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E6%83%85%E4%BE%A3%E5%90%88%E7%85%A7%E5%92%8C%E6%89%8B%E7%85%A7/3.4.JPG"
  ],
  "2025-12-08": [
    "%E7%85%A7%E7%89%87/2025-12-08%20%E5%AD%A6%E6%9C%9F%E5%81%87%E5%90%88%E7%85%A7/1.JPG"
  ],
  "2026-10": [
    "%E7%85%A7%E7%89%87/2026-10%20%E6%BC%AB%E5%B1%95%E4%B8%8E%E5%AE%98%E5%AE%A3/3.1.JPG",
    "%E7%85%A7%E7%89%87/2026-10%20%E6%BC%AB%E5%B1%95%E4%B8%8E%E5%AE%98%E5%AE%A3/4.JPG",
    "%E7%85%A7%E7%89%87/2026-10%20%E6%BC%AB%E5%B1%95%E4%B8%8E%E5%AE%98%E5%AE%A3/4.4.JPG"
  ],
  "2026-07-10": [
    "%E7%85%A7%E7%89%87/2026-07-10%20%E6%AF%95%E4%B8%9A%E5%85%B8%E7%A4%BC/2.JPG",
    "%E7%85%A7%E7%89%87/2026-07-10%20%E6%AF%95%E4%B8%9A%E5%85%B8%E7%A4%BC/2.1.JPG",
    "%E7%85%A7%E7%89%87/2026-07-10%20%E6%AF%95%E4%B8%9A%E5%85%B8%E7%A4%BC/2.2.JPG"
  ]
};

  function readArchive(bytes) {
    const records = new Map();
    const header = new DataView(bytes);
    const decoder = new TextDecoder();
    let offset = 0;

    while (offset + 30 <= bytes.byteLength && header.getUint32(offset, true) === 0x04034b50) {
      const flags = header.getUint16(offset + 6, true);
      const method = header.getUint16(offset + 8, true);
      const size = header.getUint32(offset + 18, true);
      const nameStart = offset + 30;
      const nameLength = header.getUint16(offset + 26, true);
      const extraLength = header.getUint16(offset + 28, true);
      const start = nameStart + nameLength + extraLength;
      const end = start + size;
      if ((flags & 9) || method !== 0 || end > bytes.byteLength) {
        throw new Error('Unsupported media archive');
      }
      const name = decoder.decode(new Uint8Array(bytes, nameStart, nameLength));
      records.set(name, new Uint8Array(bytes, start, size));
      offset = end;
    }

    const letterBytes = records.get('letter.json');
    const letter = letterBytes ? JSON.parse(decoder.decode(letterBytes)) : null;
    if (letterBytes && (!letter || typeof letter.greeting !== 'string' || !letter.greeting.trim() ||
      !Array.isArray(letter.paragraphs) || !letter.paragraphs.length ||
      letter.paragraphs.some(paragraph => typeof paragraph !== 'string' || !paragraph.trim()))) {
      throw new Error('Invalid letter content');
    }

    const byPath = new Map();
    const used = Object.values(albumPaths).flat().map(item => typeof item === 'string' ? item : item.src);
    if (used.some(path => !records.get(path)?.length)) throw new Error('Incomplete media archive');
    for (const path of used) {
      const type = path.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'image/jpeg';
      byPath.set(path, URL.createObjectURL(new Blob([records.get(path)], { type })));
    }
    return { sources: byPath, letter };
  }

  window.loadWalkMedia = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load story content (' + response.status + ')');
      const { sources, letter } = readArchive(await response.arrayBuffer());
      window.walkAlbums = albumPaths;
      window.walkMediaSources = sources;
      return letter;
    } finally {
      clearTimeout(timeout);
    }
  };
})();
