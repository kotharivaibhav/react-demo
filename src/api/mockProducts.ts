import type { Product } from '@/types';

const withStock = (p: Omit<Product, 'stock'>, stock: number): Product => ({ ...p, stock });

export const mockProducts: Product[] = [
  withStock(
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 129.99,
      description: 'Noise-cancelling over-ear headphones with 30h battery life.',
      image: 'https://picsum.photos/seed/headphones/400/300',
      category: 'audio',
    },
    42,
  ),
  withStock(
    {
      id: '2',
      name: 'Smart Watch',
      price: 249.99,
      description: 'Fitness tracking, heart rate monitor, and GPS.',
      image: 'https://picsum.photos/seed/watch/400/300',
      category: 'electronics',
    },
    28,
  ),
  withStock(
    {
      id: '3',
      name: 'Mechanical Keyboard',
      price: 89.99,
      description: 'RGB backlit keyboard with tactile switches.',
      image: 'https://picsum.photos/seed/keyboard/400/300',
      category: 'electronics',
    },
    55,
  ),
  withStock(
    {
      id: '4',
      name: 'USB-C Hub',
      price: 49.99,
      description: '7-in-1 adapter with HDMI, USB 3.0, and SD card reader.',
      image: 'https://picsum.photos/seed/hub/400/300',
      category: 'accessories',
    },
    70,
  ),
  withStock(
    {
      id: '5',
      name: 'Portable Speaker',
      price: 79.99,
      description: 'Water-resistant Bluetooth speaker with deep bass.',
      image: 'https://picsum.photos/seed/speaker/400/300',
      category: 'audio',
    },
    33,
  ),
  withStock(
    {
      id: '6',
      name: 'Webcam HD',
      price: 59.99,
      description: '1080p webcam with built-in microphone for video calls.',
      image: 'https://picsum.photos/seed/webcam/400/300',
      category: 'electronics',
    },
    61,
  ),
  withStock(
    {
      id: '7',
      name: 'Laptop Stand',
      price: 39.99,
      description: 'Aluminum adjustable stand for better ergonomics.',
      image: 'https://picsum.photos/seed/stand/400/300',
      category: 'office',
    },
    88,
  ),
  withStock(
    {
      id: '8',
      name: 'Wireless Mouse',
      price: 34.99,
      description: 'Ergonomic mouse with silent clicks and long battery.',
      image: 'https://picsum.photos/seed/mouse/400/300',
      category: 'accessories',
    },
    45,
  ),
  withStock(
    {
      id: '9',
      name: 'Desk Lamp LED',
      price: 44.99,
      description: 'Adjustable brightness with USB charging port.',
      image: 'https://picsum.photos/seed/lamp/400/300',
      category: 'office',
    },
    52,
  ),
  withStock(
    {
      id: '10',
      name: 'Noise Cancelling Earbuds',
      price: 99.99,
      description: 'Compact earbuds with ANC and wireless charging case.',
      image: 'https://picsum.photos/seed/earbuds/400/300',
      category: 'audio',
    },
    19,
  ),
  withStock(
    {
      id: '11',
      name: 'Monitor Arm',
      price: 69.99,
      description: 'Gas spring monitor mount for desks up to 32 inches.',
      image: 'https://picsum.photos/seed/monitor/400/300',
      category: 'office',
    },
    37,
  ),
  withStock(
    {
      id: '12',
      name: 'Phone Tripod',
      price: 24.99,
      description: 'Flexible tripod for mobile photography and video.',
      image: 'https://picsum.photos/seed/tripod/400/300',
      category: 'accessories',
    },
    64,
  ),
];

export const getProductById = (id: string): Product | undefined =>
  mockProducts.find((p) => p.id === id);
