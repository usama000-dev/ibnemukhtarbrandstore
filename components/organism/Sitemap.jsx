import React from 'react';

const Sitemap = () => {
  return (
    <div>
      <style>
        {`
          body {
            background-color: #fff;
            font-family: "Arial Narrow", "Helvetica", "Arial", sans-serif;
            margin: 0;
          }

          .hide {
            display: none;
          }

          .collapse {
            text-decoration-style: dashed;
            text-decoration-line: underline;
          }

          #top {
            background-color: #b1d1e8;
            font-size: 16px;
            padding-bottom: 40px;
          }

          nav {
            font-size: 24px;
            margin: 0px 30px 0px;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            background-color: #f3f3f3;
            color: #666;
            box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
            padding: 10px 0;
            text-align: center;
            z-index: 1;
          }

          h3 {
            margin: auto;
            padding: 10px;
            max-width: 600px;
            color: #666;
          }

          h3 span {
            float: right;
          }

          h3 a {
            font-weight: normal;
            display: block;
          }

          #cont {
            font-size: 18px;
            position: relative;
            border-radius: 6px;
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
            background: #f3f3f3;
            margin: -20px 30px 0px 30px;
            padding: 20px;
          }

          small {
            color: #666;
          }

          a:link,
          a:visited {
            color: #0180AF;
            text-decoration: underline;
          }

          a:hover {
            color: #666;
          }

          #footer {
            padding: 10px;
            text-align: center;
          }

          ul {
            margin: 0px;
            padding: 0px;
            list-style: none;
          }

          ul.ultree {
            border: #ccc 1px solid;
            border-radius: 4px;
            border-bottom: none;
          }

          li {
            margin: 0px;
          }

          li ul {
            margin-left: 20px;
          }

          li.lhead {
            background: #ddd;
            color: #666;
            padding: 5px;
            margin: 0px;
            cursor: pointer;
          }

          li.lhead:hover,
          .pager a:hover {
            background: #ccc;
          }

          .lcount {
            padding: 0px 10px;
          }

          .lpage {
            padding: 5px;
          }

          .last-page {
            border: none;
          }

          .pager {
            text-align: center;
          }

          .pager a,
          .pager span {
            padding: 10px;
            margin: 2px;
            background: #fff;
            border-radius: 10px;
            display: inline-block;
          }

          .pager span {
            border: #ccc 1px solid;
          }
        `}
      </style>

      <div id="top">
        <nav>champion-choice-pearl.vercel.app HTML Site Map</nav>
        <h3>
          <span>Last updated: 2025, July 23 04:57:05<br />
            Total pages: 37</span>
          <a href="https://www.champzones.com/">champion-choice-pearl.vercel.app Homepage</a>
        </h3>
      </div>
      <div id="cont">
        <ul className="ultree level-1 has-pages">
          <li className="lhead" title="Click to toggle">https://www.champzones.com/<span className="lcount">28 pages <small>[+9 in 2 subfolders]</small></span></li>

          <li className="lpagelist">
            <ul className="ulpages">
              <li className="lpage">
                <a href="https://www.champzones.com/"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms"
                  title="Martial Arts Uniforms - CHAMPION-CHOICE | Karate, Taekwondo & MMA">Martial Arts
                  Uniforms - CHAMPION-CHOICE | Karate, Taekwondo & MMA</a>
                <br /><small>Discover premium martial arts uniforms at CHAMPION-CHOICE. Shop high-quality karate
                  gis, taekwondo doboks, MMA fight gear, and poomse uniforms designed for comfort, durability,
                  and performance. Perfect for training, competitions, and casual wear with a wide range of
                  sizes and styles.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/hoodies"
                  title="Hoodies - CHAMPION-CHOICE">Hoodies - CHAMPION-CHOICE</a>
                <br /><small>Discover our premium martial arts hoodies designed for comfort, performance, and
                  fashion. Perfect for sports training, casual wear, and martial arts enthusiasts.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/tshirts"
                  title="Shirts - CHAMPION-CHOICE | Martial Arts & Sports Fashion">Shirts -
                  CHAMPION-CHOICE | Martial Arts & Sports Fashion</a>
                <br /><small>Browse premium martial arts shirts at CHAMPION-CHOICE. Stylish and
                  performance-ready shirts for taekwondo, karate, MMA, and sports lovers. Perfect fit for
                  training and casual wear.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/mugs" title="Mugs - CHAMPIONCHOICE">Mugs -
                  CHAMPIONCHOICE</a>
                <br /><small>Explore our premium collection of martial arts fashion mugs. Perfect for sports
                  lovers and martial artists. Stylish, durable, and designed to inspire.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/stickers"
                  title="Stickers & Logos - CHAMPION-CHOICE | Martial Arts Style Accessories">Stickers
                  & Logos - CHAMPION-CHOICE | Martial Arts Style Accessories</a>
                <br /><small>Explore martial arts-themed stickers and logos at CHAMPION-CHOICE. Perfect for
                  customizing gear, laptops, and accessories with taekwondo, karate, and MMA styles.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/login" title="Login | CHAMPION-CHOICE">Login |
                  CHAMPION-CHOICE</a>
                <br /><small>Login to your CHAMPION-CHOICE account to manage your martial arts gear orders, edit
                  your personal details, and access exclusive member features.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/checkout"
                  title="Checkout - CHAMPION-CHOICE | Premium Martial Arts Gear">Checkout - CHAMPION-CHOICE |
                  Premium Martial Arts Gear</a>
                <br /><small>Secure checkout for top-quality martial arts uniforms, protective gear, and
                  training equipment. Shop karate, taekwondo, jiu-jitsu & MMA gear with the best prices
                  and free shipping.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/products"
                  title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE. Find
                  uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                  products.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/contact-us"
                  title="Contact Us | CHAMPION-CHOICE Martial Arts Gear Support">Contact Us | CHAMPION-CHOICE
                  Martial Arts Gear Support</a>
                <br /><small>Have questions about martial arts gear, orders, or services? Contact
                  CHAMPION-CHOICE for customer support, order tracking, and product inquiries.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms-company?company=dae%20do"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms-company?company=fila"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms-company?company=gr%20tkd"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms-company?company=moto"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms-company?company=pine%20tree"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/uniforms-company?company=pro%20specs"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/about"
                  title="About Us | CHAMPION-CHOICE Martial Arts Gear & Equipment">About Us |
                  CHAMPION-CHOICE Martial Arts Gear & Equipment</a>
                <br /><small>Learn about CHAMPION-CHOICE, your trusted store for premium martial arts uniforms,
                  protective gear, and training equipment. Discover our mission, values, and commitment to
                  supporting martial artists worldwide.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/privacy-policy"
                  title="Privacy Policy | CHAMPION-CHOICE Martial Arts Gear & Equipment">Privacy Policy |
                  CHAMPION-CHOICE Martial Arts Gear & Equipment</a>
                <br /><small>Learn how CHAMPION-CHOICE safeguards your personal information when shopping
                  for martial arts gear, uniforms, and accessories. Read our privacy policy to understand
                  how we collect, store, and use your data.</small>
              </li>
              <li className="lpage">
                <a href="https://www.champzones.com/blog" title="Blog | Hunting Blog">Blog |
                  CHAMPIONS-CHOICE Blog</a>
                <br /><small>Read our latest hunting stories, tips, and adventures.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/search"
                  title="Search Products - CHAMPION-CHOICE">Search Products - CHAMPION-CHOICE</a>
                <br /><small>Search for martial arts products, uniforms, and accessories at CHAMPION-CHOICE.
                  Find exactly what you&apos;re looking for with our advanced search.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/myaccount"
                  title="My Account - CHAMPIONCHOICE">My Account - CHAMPIONCHOICE</a>
                <br /><small>Access your CHAMPION-CHOICE account to view personal information, order history,
                  and update your martial arts gear preferences.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/orders"
                  title="Orders - CHAMPION-CHOICE">Orders - CHAMPION-CHOICE</a>
                <br /><small>View all your past, pending, paid, or delivered martial arts gear orders at
                  CHAMPION-CHOICE. Track your purchases and stay updated on shipping status.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/privacy-policy"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/return-policy"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/refund-policy"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/shiping-policy"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/terms-conditions"
                  title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                  TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                <br /><small>Discover premium quality sports uniforms and martial arts equipment designed for
                  performance, durability, and style. Whether you&apos;re a beginner or a professional
                  athlete, we bring you a wide range of gear that empowers your training and boosts your
                  confidence.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/signup"
                  title="Create Account - CHAMPION-CHOICE | Martial Arts Gear Store">Create Account -
                  CHAMPION-CHOICE | Martial Arts Gear Store</a>
                <br /><small>Create your CHAMPION-CHOICE account to access your order history, track deliveries,
                  and receive the best martial arts gear offers. Secure sign-up for karate, taekwondo, and MMA
                  enthusiasts.</small>
              </li>

              <li className="lpage">
                <a href="https://www.champzones.com/forgot"
                  title="Forgot Password - CHAMPION-CHOICE | Martial Arts Gears & Fashion">Forgot Password
                  - CHAMPION-CHOICE | Martial Arts Gears & Fashion</a>
                <br /><small>Reset your password easily at CHAMPION-CHOICE. Fashionable martial arts uniforms,
                  Taekwondo, Karate, Hapkido, Kung Fu, and sportswear are all available here.</small>
              </li>
            </ul>
          </li>

          <li className="lsub">
            <ul className="ultree level-2 has-pages">
              <li className="lhead" title="Click to toggle">all-products/<span className="lcount">3 pages</span></li>

              <li className="lpagelist">
                <ul className="ulpages">
                  <li className="lpage">
                    <a href="https://www.champzones.com/all-products/recommended"
                      title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                      TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                    <br /><small>Discover premium quality sports uniforms and martial arts equipment
                      designed for performance, durability, and style. Whether you&apos;re a beginner or a
                      professional athlete, we bring you a wide range of gear that empowers your training
                      and boosts your confidence.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/all-products/flash-sale"
                      title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                      TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                    <br /><small>Discover premium quality sports uniforms and martial arts equipment
                      designed for performance, durability, and style. Whether you&apos;re a beginner or a
                      professional athlete, we bring you a wide range of gear that empowers your training
                      and boosts your confidence.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/all-products/limited"
                      title="BUY TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE">BUY
                      TAEKWONDO & ALL MARTIAL ARTS UNIFOMRS AND GEARS | CHAMPIONCHOICE</a>
                    <br /><small>Discover premium quality sports uniforms and martial arts equipment
                      designed for performance, durability, and style. Whether you&apos;re a beginner or a
                      professional athlete, we bring you a wide range of gear that empowers your training
                      and boosts your confidence.</small>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="ultree level-2 has-pages">
              <li className="lhead" title="Click to toggle">product/<span className="lcount">6 pages</span></li>

              <li className="lpagelist">
                <ul className="ulpages">
                  <li className="lpage">
                    <a href="https://www.champzones.com/product/taekwondo-tkd-hoodie-black"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/taekwondo-training-tshirt-mens-sports-fit-black"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/traditional-korean-art-taekwondo-tshirt"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/taekwondo-tkd-hoodie-yellow"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/traditional-korean-art-taekwondo-tshirt-l"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>

                  <li className="lpage">
                    <a href="https://www.champzones.com/product/traditional-korean-art-taekwondo-tshirt-s"
                      title="All Products - CHAMPION-CHOICE">All Products - CHAMPION-CHOICE</a>
                    <br /><small>Explore all available martial arts gear and sportswear at CHAMPION-CHOICE.
                      Find uniforms, hoodies, belts, gloves, mugs, and more. Easily search your favorite
                      products.</small>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Sitemap;