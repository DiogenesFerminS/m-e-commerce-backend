import { ProductCategory } from 'src/common/interfaces/product-category.enum';

export const SEED_PRODUCTS = [
  // --- GUITARS (8) ---
  {
    name: 'Fender Player Stratocaster',
    brand: 'fender',
    description:
      'The inspiring sound of a Stratocaster is one of the foundations of Fender. Featuring classic high-end, punchy mids, and robust low-end.',
    stock: 12,
    price: 849.99,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'electric' },
      { name: 'frets', value: '22' },
      { name: 'body wood', value: 'alder' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/T3IAAeSw95tpvx2x/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Gibson Les Paul Standard 60s',
    brand: 'gibson',
    description:
      'The Les Paul Standard 60s has a solid mahogany body with a AA figured maple top and a slim taper 60s-style mahogany neck.',
    stock: 5,
    price: 2699.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'electric' },
      { name: 'body wood', value: 'mahogany/maple' },
      { name: 'color', value: 'iced tea' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/0zAAAeSwTvNpPd~r/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Ibanez RG550 Genesis Collection',
    brand: 'ibanez',
    description:
      'A masterpiece made in Japan. The RG is the most recognizable and distinctive guitar in the Ibanez line.',
    stock: 8,
    price: 999.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'electric' },
      { name: 'bridge', value: 'edge Tremolo' },
      { name: 'neck', value: 'super Wizard' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/VmgAAeSwdUVpuYsS/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'PRS SE Custom 24',
    brand: 'prs',
    description:
      'The SE Custom 24 brings the original PRS design platform to the high-quality, more affordable SE lineup of instruments.',
    stock: 7,
    price: 829.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'electric' },
      { name: 'scale Length', value: '25"' },
      { name: 'body material', value: 'mahogany' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/ba4AAeSwYs9psXUC/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Taylor 214ce Deluxe',
    brand: 'taylor',
    description:
      'A versatile Grand Auditorium acoustic-electric guitar that performs equally well in the studio and on stage.',
    stock: 4,
    price: 1499.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'acoustic-electric' },
      { name: 'strings', value: 'elixir phosphor bronze' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/zvQAAeSwXJZpwE-l/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Martin D-28 Standard',
    brand: 'martin',
    description:
      'The dreadnought by which all others are judged. Constructed of solid Sitka spruce and East Indian rosewood.',
    stock: 3,
    price: 3199.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'acoustic' },
      { name: 'wood', value: 'spruce/rosewood' },
      { name: 'bracing', value: 'forward shifted x' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/YNsAAeSwPKtpwL2X/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Jackson Soloist SL2',
    brand: 'jackson',
    description:
      'The Pro Series Soloist SL2 is a metal-ready machine with a neck-through-body construction and Seymour Duncan pickups.',
    stock: 10,
    price: 1099.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'electric' },
      { name: 'pickups', value: 'seymour duncan distortion' },
      { name: 'bridge', value: 'floyd rose 1000' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/4IQAAeSwpyZpvb4e/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Yamaha Pacifica 112V',
    brand: 'yamaha',
    description:
      'Class-leading hardware, pickups, and solid tonewoods make this the ultimate versatile beginner guitar.',
    stock: 20,
    price: 320.0,
    category: ProductCategory.GUITAR,
    attributes: [
      { name: 'type', value: 'electric' },
      { name: 'pickup config', value: 'h-s-s' },
      { name: 'body wood', value: 'alder' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/NfYAAeSwTf1pkaWW/s-l1600.webp',
        isMain: true,
      },
    ],
  },

  // --- BASS GUITARS (8) ---
  {
    name: 'Fender Player Precision Bass',
    brand: 'fender',
    description:
      'There is nothing more classic than a Fender electric bass, and the Player Precision Bass is as authentic as it gets.',
    stock: 6,
    price: 849.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'pickups', value: 'split single-coil' },
      { name: 'strings', value: '4' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/FbkAAeSw47Fpn-mF/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Music Man StingRay Special',
    brand: 'music man',
    description:
      'First introduced in 1976, the StingRay has been revered as one of the most iconic bass guitars in history.',
    stock: 3,
    price: 2499.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'electronics', value: 'active 18V preamp' },
      { name: 'humbucker', value: 'neodymium' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/BvAAAeSwZUtpvXgp/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Ibanez SR300E',
    brand: 'ibanez',
    description:
      'For 30 years the SR has given bass players a modern alternative. With its continued popularity, Ibanez is constantly endeavoring to answer the wider needs.',
    stock: 15,
    price: 349.99,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'eq', value: '3-band power tap' },
      { name: 'body wood', value: 'nyangoh' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/~G0AAeSwhCRpvaoI/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Squier Classic Vibe 60s Jazz Bass',
    brand: 'squier',
    description:
      'A tribute to the decade of its birth, the Classic Vibe 60s Jazz Bass combines the luxurious playability that made it famous.',
    stock: 10,
    price: 479.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'pickups', value: 'fender-designed alnico' },
      { name: 'strings', value: '4' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/nxgAAeSwR0tpvrhv/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Warwick Corvette $$',
    brand: 'warwick',
    description:
      'The Warwick Corvette $$ features select Swamp Ash and a Bolt-on Ovangkol neck for incredible punch.',
    stock: 2,
    price: 2150.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'Wood', value: 'Swamp Ash/Ovangkol' },
      { name: 'Strings', value: '5' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/RekAAeSwn35pwSVV/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Yamaha TRBX304',
    brand: 'yamaha',
    description:
      'TRBX300 is built around a simple principle - your performance. Perfectly balanced, ultra-comfortable solid mahogany body.',
    stock: 12,
    price: 399.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'controls', value: 'performance eq' },
      { name: 'pickups', value: 'ceramic dual-coil' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/zecAAeSwnrxpu8N3/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Hofner Ignition Violin Bass',
    brand: 'hofner',
    description:
      'The iconic "Beatle Bass" that changed the world. Lightweight and easy to play with a hollow body construction.',
    stock: 5,
    price: 420.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'body', value: 'hollow body' },
      { name: 'weight', value: 'ultra light' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/RbwAAeSwBiFpu64W/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Rickenbacker 4003',
    brand: 'rickenbacker',
    description:
      'The classic Rickenbacker bass - famous for its ringing sustain, treble punch and underlying bass growl.',
    stock: 2,
    price: 2450.0,
    category: ProductCategory.BASS,
    attributes: [
      { name: 'type', vale: 'electric' },
      { name: 'output', value: 'stereo rick-o-sound' },
      { name: 'wood', value: 'maple' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/FnwAAeSwFOBpurnS/s-l1600.webp',
        isMain: true,
      },
    ],
  },

  // --- DRUMS (8) ---
  {
    name: 'Pearl Export EXX',
    brand: 'pearl',
    description:
      'Export Series is the name every drummer knows. Having fueled thousands of drum careers by bringing quality and value into one package.',
    stock: 4,
    price: 899.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'type', vale: 'acoustic' },
      { name: 'pieces', value: '5' },
      { name: 'hardware', value: '830 Series' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/2nkAAeSwleFpvb2p/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Tama Imperialstar',
    brand: 'tama',
    description:
      'Imperialstar drum kits provide everything a drummer needs at an affordable price.',
    stock: 6,
    price: 749.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'type', vale: 'acoustic' },
      { name: 'heads', value: 'tama original' },
      { name: 'hoops', value: 'accu-tune' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/oCQAAeSwy85ptKWE/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'DW Design Series',
    brand: 'dw',
    description:
      'DW has taken their custom-drum-making experience and infused it into a professional drum set that sets a new standard for quality and value.',
    stock: 2,
    price: 1850.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'type', vale: 'acoustic' },
      { name: 'shell material', value: 'north american maple' },
      { name: 'pieces', value: '4 (shell pack)' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/L-MAAOSwKG9nx1CE/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Roland TD-17KVX V-Drums',
    brand: 'roland',
    description:
      'Electronic drums that mirror your physical drumming technique, providing an authentic acoustic feel.',
    stock: 5,
    price: 1599.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'type', value: 'electronic' },
      { name: 'module', value: 'td-17' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/yMsAAeSwyOpoeAkz/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Ludwig NeuSonic',
    brand: 'ludwig',
    description:
      'The latest era of Ludwigs award-winning drums, featuring a 6-ply Cherry and Maple shell.',
    stock: 3,
    price: 1299.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'wood', value: 'maple/cherry' },
      { name: 'style', value: 'vintage/modern' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/fLwAAeSw6QBpwT3Z/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Yamaha Stage Custom Birch',
    brand: 'yamaha',
    description:
      'The standard in birch drums. Perfect for the working pro or the serious student.',
    stock: 8,
    price: 720.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'wood', value: 'birch' },
      { name: 'mount', value: 'yess' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/15AAAeSwYOVpvG~-/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Gretsch Catalina Maple',
    brand: 'gretsch',
    description:
      'The sleek, innovative hardware designs and great Gretsch-formula maple shells.',
    stock: 4,
    price: 1050.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'wood', value: 'maple' },
      { name: 'hoops', value: 'triple flanged' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/hWAAAeSwv6JpsEoz/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Alesis Nitro Max',
    brand: 'alesis',
    description:
      'A complete electronic drum kit with mesh heads that delivers a realistic playing experience.',
    stock: 15,
    price: 399.0,
    category: ProductCategory.DRUM,
    attributes: [
      { name: 'type', value: 'electronic' },
      { name: 'sounds', value: '440' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/Nq8AAeSw6zhpwT6O/s-l1600.webp',
        isMain: true,
      },
    ],
  },

  // --- ACCESSORIES (8) ---
  {
    name: 'Ernie Ball Super Slinky 9-42',
    brand: 'ernie ball',
    description:
      'The worlds best-selling electric guitar strings. Played by legends like Jimmy Page and Slash.',
    stock: 100,
    price: 7.5,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'gauge', value: '9-42' },
      { name: 'material', value: 'nickel wound' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/etQAAOSwgUJgSVpB/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Boss TU-3 Tuner Pedal',
    brand: 'boss',
    description:
      'The world’s top-selling stage tuner, the BOSS TU-3 is made for the long haul.',
    stock: 25,
    price: 110.0,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'type', value: 'pedal tuner' },
      { name: 'bypass', value: 'buffered' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/BJUAAOSwke9kePqS/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'DAddario Planet Waves Instrument Cable 10ft',
    brand: 'daddario',
    description:
      'Oxygen-free copper conductors for the ultimate in signal clarity.',
    stock: 40,
    price: 19.99,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'length', value: '10 feet' },
      { name: 'shielding', value: 'double' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/ozwAAeSw6PRpvyqg/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Dunlop Tortex 0.73mm Picks 12-Pack',
    brand: 'dunlop',
    description:
      'Highly durable with great memory and just the right amount of flexibility.',
    stock: 200,
    price: 6.0,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'thickness', value: '0.73mm' },
      { name: 'quantity', value: '12-Pack' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/FOAAAeSwX-xoydom/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Vic Firth American Classic 5A Sticks',
    brand: 'vic firth',
    description: 'The #1 stick in the world—great for every style of music!',
    stock: 80,
    price: 15.5,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'material', value: 'hickory' },
      { name: 'tip', value: 'wood' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/B~wAAOSwdv5lgdnx/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Focusrite Scarlett 2i2 4th Gen',
    brand: 'focusrite',
    description:
      'The most popular audio interface for artists across all genres.',
    stock: 15,
    price: 199.0,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'channels', value: '2' },
      { name: 'resolution', value: '24-bit/192kHz' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/qJMAAeSwfgRpH~Iu/s-l1600.webp',
        isMain: true,
      },
    ],
  },
  {
    name: 'Fender Monogrammed Strap',
    brand: 'fender',
    description:
      'Fender’s most recognizable strap is now available with a comfortable polyester backing.',
    stock: 30,
    price: 24.0,
    category: ProductCategory.ACCESSORIES,
    attributes: [
      { name: 'material', value: 'polyester' },
      { name: 'width', value: '2"' },
    ],
    images: [
      {
        path: 'https://i.ebayimg.com/images/g/jOQAAOSwqtRjTuyO/s-l960.webp',
        isMain: true,
      },
    ],
  },
];
