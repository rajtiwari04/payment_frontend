import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

// ─── IMAGE SYSTEM (identical to ProductsPage) ─────────────────────────────────

const KEYWORD_IMAGES = {
  // ── Phones ──────────────────────────────────────────────────────────────────
  iphone:      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80',
  samsung:     'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
  oneplus:     'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80',
  redmi:       'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
  realme:      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
  pixel:       'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
  smartphone:  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  mobile:      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  phone:       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',

  // ── Laptops ─────────────────────────────────────────────────────────────────
  laptop:      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  macbook:     'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  notebook:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  chromebook:  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  pavilion:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  inspiron:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  thinkpad:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  vivobook:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',

  // ── Tablets ─────────────────────────────────────────────────────────────────
  ipad:        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  tablet:      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',

  // ── Headphones / Audio ───────────────────────────────────────────────────────
  headphone:   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  headset:     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  earphone:    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  earbuds:     'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  airpods:     'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  speaker:     'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  wh1000:      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  wh:          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',

  // ── Smartwatch ───────────────────────────────────────────────────────────────
  smartwatch:  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  watch:       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  fitbit:      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80',
  band:        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80',
  tracker:     'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80',

  // ── Cameras ──────────────────────────────────────────────────────────────────
  camera:      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  dslr:        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  canon:       'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  nikon:       'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  gopro:       'https://images.unsplash.com/photo-1551703599-a5541e0a9a8e?w=400&q=80',
  webcam:      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',

  // ── TV / Monitor ─────────────────────────────────────────────────────────────
  television:  'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
  'smart tv':  'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
  monitor:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  display:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',

  // ── Keyboards / Mouse / Accessories ─────────────────────────────────────────
  keyboard:    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  mouse:       'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  charger:     'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
  cable:       'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
  powerbank:   'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',

  // ── Shirts / Tops ────────────────────────────────────────────────────────────
  shirt:       'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
  tshirt:      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  top:         'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80',
  blouse:      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80',
  polo:        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80',
  hoodie:      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80',
  sweatshirt:  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80',

  // ── Bottoms ──────────────────────────────────────────────────────────────────
  jeans:       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
  pants:       'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
  trouser:     'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
  shorts:      'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80',
  skirt:       'https://images.unsplash.com/photo-1583496661160-fb5218f5055e?w=400&q=80',
  leggings:    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80',

  // ── Outerwear ────────────────────────────────────────────────────────────────
  jacket:      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  coat:        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80',
  blazer:      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',

  // ── Footwear ─────────────────────────────────────────────────────────────────
  shoes:       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  sneakers:    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  nike:        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  adidas:      'https://images.unsplash.com/photo-1584735175315-9d5df23be1fd?w=400&q=80',
  sandals:     'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80',
  heels:       'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
  boots:       'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80',
  slippers:    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80',
  loafers:     'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80',

  // ── Innerwear / Ethnic ───────────────────────────────────────────────────────
  saree:       'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
  kurta:       'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80',
  dress:       'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
  suit:        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',

  // ── Beauty / Makeup ──────────────────────────────────────────────────────────
  lipstick:    'https://images.unsplash.com/photo-1586495777744-4e6232bf4b63?w=400&q=80',
  lip:         'https://images.unsplash.com/photo-1586495777744-4e6232bf4b63?w=400&q=80',
  foundation:  'https://images.unsplash.com/photo-1631214503851-25e69d55607b?w=400&q=80',
  concealer:   'https://images.unsplash.com/photo-1631214503851-25e69d55607b?w=400&q=80',
  mascara:     'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
  eyeliner:    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
  eyeshadow:   'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
  blush:       'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  highlighter: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  powder:      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  perfume:     'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80',
  fragrance:   'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80',
  serum:       'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  moisturizer: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  sunscreen:   'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  lotion:      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  shampoo:     'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80',
  conditioner: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80',
  haircare:    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80',
  facewash:    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  toner:       'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
  lakme:       'https://images.unsplash.com/photo-1586495777744-4e6232bf4b63?w=400&q=80',
  maybelline:  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
  loreal:      'https://images.unsplash.com/photo-1631214503851-25e69d55607b?w=400&q=80',
  nykaa:       'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',

  // ── Books ────────────────────────────────────────────────────────────────────
  novel:       'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  book:        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  fiction:     'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
  textbook:    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
  guide:       'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  comic:       'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
  biography:   'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',

  // ── Home ─────────────────────────────────────────────────────────────────────
  sofa:        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  chair:       'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80',
  table:       'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80',
  bed:         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
  pillow:      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80',
  curtain:     'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
  lamp:        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  light:       'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=400&q=80',
  fan:         'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  mixer:       'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80',
  blender:     'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80',
  cooker:      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
  microwave:   'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
  refrigerator:'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',
  fridge:      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',
  washing:     'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
  vacuum:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  clock:       'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80',
  frame:       'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
  candle:      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
  vase:        'https://images.unsplash.com/photo-1562113530-57ba467cea38?w=400&q=80',
  carpet:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  rug:         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',

  // ── Sports ───────────────────────────────────────────────────────────────────
  cricket:     'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80',
  football:    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
  basketball:  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
  badminton:   'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
  tennis:      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80',
  yoga:        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  mat:         'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  dumbbell:    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  gym:         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  treadmill:   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  cycle:       'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
  bicycle:     'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
  helmet:      'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=400&q=80',
  gloves:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  protein:     'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',
  supplement:  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',

  // ── Toys ─────────────────────────────────────────────────────────────────────
  lego:        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
  puzzle:      'https://images.unsplash.com/photo-1606503153255-59d5ea2b2a5c?w=400&q=80',
  doll:        'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
  teddy:       'https://images.unsplash.com/photo-1599751449318-8e97f4e29d32?w=400&q=80',
  bear:        'https://images.unsplash.com/photo-1599751449318-8e97f4e29d32?w=400&q=80',
  car:         'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80',
  remote:      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80',
  game:        'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=400&q=80',
  board:       'https://images.unsplash.com/photo-1606503153255-59d5ea2b2a5c?w=400&q=80',
};

const CATEGORY_IMAGES = {
  Electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  ],
  Books: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  ],
  Home: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aaa4fce1?w=400&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
    'https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?w=400&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  ],
  Beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
  ],
  Toys: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
  ],
  Other: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
  ],
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';

// Exact same algorithm as ProductsPage.getProductImage()
function getProductImage(item) {
  if (item.images && item.images.length > 0 && item.images[0]) {
    return item.images[0];
  }

  const searchText = (
    (item.name || '') + ' ' +
    (item.brand || '') + ' ' +
    (item.description || '')
  ).toLowerCase().replace(/[\s\-_]+/g, '');

  const sortedKeywords = Object.keys(KEYWORD_IMAGES).sort((a, b) => b.length - a.length);
  for (let i = 0; i < sortedKeywords.length; i++) {
    const keyword = sortedKeywords[i].replace(/[\s\-_]+/g, '');
    if (searchText.includes(keyword)) {
      return KEYWORD_IMAGES[sortedKeywords[i]];
    }
  }

  const pool = CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES['Other'];
  const seed = (item.productId || item._id || item.name || '')
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pool[seed % pool.length];
}

// ─── CART ITEM IMAGE ──────────────────────────────────────────────────────────
// Isolated component so each item manages its own onError state independently.

const CartItemImage = ({ item }) => {
  const [src, setSrc] = React.useState(() => getProductImage(item));

  return (
    <img
      src={src}
      alt={item.name}
      className="cart-item-image"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  );
};

// ─── CART PAGE ────────────────────────────────────────────────────────────────

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const taxAmount = cartTotal * 0.08;
  const shippingAmount = cartTotal > 100 ? 0 : 9.99;
  const totalAmount = cartTotal + taxAmount + shippingAmount;

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container-md">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <CartItemImage item={item} />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">{formatPrice(item.price * item.quantity)}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>✕</button>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
          </div>

          <div className="cart-summary">
            <div className="card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingAmount === 0 ? 'FREE' : formatPrice(shippingAmount)}</span>
              </div>
              {shippingAmount === 0 && (
                <div className="free-shipping-badge">🎉 Free shipping on orders over ₹100!</div>
              )}
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
                🔒 Secure Checkout
              </button>
              <div className="checkout-badges">
                <span className="security-badge">🔒 SSL</span>
                <span className="security-badge">🛡 2FA</span>
                <span className="security-badge">🔐 Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
