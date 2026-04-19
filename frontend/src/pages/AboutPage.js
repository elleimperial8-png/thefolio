import React, { useEffect } from "react";
import japanImg from "../assets/Japan.jpg";
import koreaImg from "../assets/Korea.jpg";
import phImg from "../assets/ph.jpg";
import switzerlandImg from "../assets/Switzerland.jpg";
import spainImg from "../assets/spain.jpg";
import italyImg from "../assets/italy.jpg";
import thailandImg from "../assets/thailand.jpg";
import londonImg from "../assets/london.jpg";
import australiaImg from "../assets/Australia.jpg";
import dubaiImg from "../assets/dubai.jpg";
import maldivesImg from "../assets/maldives.jpg";
import '../App.css';

function AboutPage() {
  useEffect(() => {
    // Memory game logic
    const destinations = [
      "Eiffel Tower", "Eiffel Tower",
      "Great Wall", "Great Wall",
      "Machu Picchu", "Machu Picchu",
      "Pyramids", "Pyramids",
      "Statue of Liberty", "Statue of Liberty",
      "Colosseum", "Colosseum",
      "Taj Mahal", "Taj Mahal",
      "Sydney Opera", "Sydney Opera"
    ];

    let shuffled = [...destinations].sort(() => 0.5 - Math.random());
    const board = document.getElementById("game-board");
    if (!board) return;

    board.innerHTML = "";
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    shuffled.forEach((name) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${name}</div>
        </div>
      `;
      board.appendChild(card);

      card.addEventListener("click", () => {
        if (lockBoard || card === firstCard) return;
        card.classList.add("flipped");
        if (!firstCard) firstCard = card;
        else {
          secondCard = card;
          checkMatch();
        }
      });

      function checkMatch() {
        const isMatch =
          firstCard.querySelector(".card-back").textContent ===
          secondCard.querySelector(".card-back").textContent;

        if (isMatch) {
          firstCard = null;
          secondCard = null;
        } else {
          lockBoard = true;
          setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            secondCard = null;
            lockBoard = false;
          }, 1000);
        }
      }
    });
  }, []);

  return (
    <div className="about-page-container">
      {/* Favorite Countries Images */}
      <div className="favorite-countries-images">
        <img src={japanImg} alt="Japan" />
        <img src={koreaImg} alt="Korea" />
        <img src={phImg} alt="Philippines" />
        <img src={switzerlandImg} alt="Switzerland" />
        <img src={spainImg} alt="Spain" />
        <img src={italyImg} alt="Italy" />
        <img src={thailandImg} alt="Thailand" />
        <img src={londonImg} alt="London" />
        <img src={australiaImg} alt="Australia" />
        <img src={dubaiImg} alt="Dubai" />
        <img src={maldivesImg} alt="Maldives" />
      </div>

      {/* ABOUT SECTIONS */}
      <section className="about-hero">
        <h2>Chosen Topic & My Connection to It</h2>
        <p>
          I chose a topic about my <strong>dream destinations to travel in the future</strong>.
          As I grow older, I've realized that the world is so much bigger than the small, familiar places I've always known. 
          Growing up, my life revolved around our province—a simple and peaceful place that I've always loved. 
          But the first time I traveled outside our province, I truly felt how vast the world really is. 
          That experience opened my eyes and sparked a dream in me: to explore faraway lands, meet new people, and create unforgettable memories that I will treasure for a lifetime. 
          Traveling gives me a sense of freedom, excitement, and endless curiosity. It inspires me to dream bigger and motivates me to work hard for the life I envision after college.
        </p>

        <h2>What I Love About My Dream Destinations</h2>
        <p>
          The thought of traveling—both within our country and internationally—fills me with happiness and a sense of adventure. 
          Imagining myself walking through bustling cities, tasting delicious foods, and exploring new cultures makes me feel alive and inspired. 
          I've always been influenced by movies, travel blogs, and websites showcasing the beauty of different countries, as well as the amazing tourist spots in the Philippines. 
          Each destination I dream of visiting represents a story, an adventure, and a chance to grow as a person. Traveling is not just a hobby for me—it's a way to learn, to be free, and to embrace the world with open arms.
        </p>

        <h2>My Travel Preparations</h2>
        <ol>
          <li>Dreaming about destinations I want to visit</li>
          <li>Researching countries, cultures, and tourist spots</li>
          <li>Planning future trips and setting goals</li>
          <li>Saving money and preparing for my travels</li>
          <li>Learning languages and cultural etiquette</li>
        </ol>

        <blockquote>
          "The world is a book, and those who do not travel read only one page."
        </blockquote>

        <h2>My Favorite Countries to Visit</h2>
        <p>
          Some of the countries I dream of visiting include <strong>Japan, Korea, Switzerland, Spain, Italy, Thailand, London, Australia, Dubai, China, Maldives</strong>, and of course, exploring more of my beloved Philippines. Each of these places fascinates me for different reasons—the rich history of Europe, the vibrant cultures of Asia, the pristine beaches of tropical islands, and the bustling streets of iconic cities.
        </p>
        <p>
          Traveling is more than a dream—it's my inspiration. It keeps me motivated to succeed, save, and plan for the adventures I want to experience. I hope that one day, I can journey across continents, meet incredible people, and collect stories that will last a lifetime.
        </p>
        <hr />
      </section>

      {/* MEMORY GAME SECTION */}
      <section className="game-section">
        <h2>Travel Memory Game</h2>
        <p>Match the famous destinations!</p>
        <div id="game-board"></div>
      </section>
    </div>
  );
}

export default AboutPage;