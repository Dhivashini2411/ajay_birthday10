/* ==========================================================================
   MAIN APPLICATION SCRIPT (PHASE 5 COMPLETE)
   Connects Pages 1, 2, 4 & 5 UI Interactions, Audio, Confetti & Replay Loop
   ========================================================================== */

import confetti from 'canvas-confetti';
import { ParticleSystem } from './particles.js';
import { AudioManager } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Particle Canvas Background
  const particles = new ParticleSystem('particleCanvas');

  // 2. Initialize Audio Manager
  const audio = new AudioManager();
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicText = musicToggleBtn?.querySelector('.music-text');
  const musicEqualizer = musicToggleBtn?.querySelector('.music-equalizer');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      audio.toggleMusic((isPlaying) => {
        if (isPlaying) {
          musicText.textContent = 'Pause Music';
          musicEqualizer.classList.remove('hidden');
          musicToggleBtn.style.borderColor = '#C084FC';
          musicToggleBtn.style.background = '#FFFFFF';
        } else {
          musicText.textContent = 'Play Music';
          musicEqualizer.classList.add('hidden');
          musicEqualizer.classList.add('hidden');
          musicToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.9)';
          musicToggleBtn.style.background = 'rgba(255, 255, 255, 0.85)';
        }
      });
    });
  }

  // 3. Interactive Nickname Badges & Cards Sound & Bounce Effect
  const pillBadges = document.querySelectorAll('.pill-badge, .tag-chip, .highlight-pink, .highlight-nickname, .nickname-item-card, .scrapbook-frame');
  pillBadges.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      audio.playPop();
      
      const rect = pill.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 14,
        spread: 45,
        startVelocity: 16,
        origin: { x, y },
        colors: ['#FFC2D1', '#D8B4FE', '#BAE6FD', '#FFEDD5'],
        shapes: ['circle']
      });
    });
  });

  // 4. Page Elements & Multi-Page Navigation Manager
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const page3 = document.getElementById('page3');
  const page4 = document.getElementById('page4');
  const page5 = document.getElementById('page5');

  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const navBackToPage1Btn = document.getElementById('navBackToPage1Btn');
  const goToPage3Btn = document.getElementById('goToPage3Btn');
  const navBackToPage2From4Btn = document.getElementById('navBackToPage2From4Btn');
  const goToPage5Btn = document.getElementById('goToPage5Btn');
  const navBackToPage4From5Btn = document.getElementById('navBackToPage4From5Btn');
  const replayBtn = document.getElementById('replayBtn');

  // Trigger rich confetti burst helper
  function triggerConfetti() {
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#FFC2D1', '#D8B4FE', '#BAE6FD', '#FFEDD5']
    });
  }

  // Generic smooth page switcher
  function switchPage(fromPage, toPage, withChime = true) {
    if (!fromPage || !toPage) return;
    
    if (withChime) {
      audio.playChime();
      triggerConfetti();
    } else {
      audio.playPop();
    }

    fromPage.classList.add('exit-left');

    setTimeout(() => {
      fromPage.classList.remove('active-page', 'exit-left');
      fromPage.classList.add('hidden-page');

      toPage.classList.remove('hidden-page');
      toPage.classList.add('active-page');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  }

  // Navigate Page 1 -> Page 2
  if (openSurpriseBtn && page1 && page2) {
    openSurpriseBtn.addEventListener('click', () => switchPage(page1, page2));
  }

  // Navigate Page 2 -> Page 1
  if (navBackToPage1Btn && page1 && page2) {
    navBackToPage1Btn.addEventListener('click', () => switchPage(page2, page1, false));
  }

  // Navigate Page 2 -> Page 4 (Since Page 3 Video is paused!)
  if (goToPage3Btn && page2 && page4) {
    goToPage3Btn.addEventListener('click', () => switchPage(page2, page4));
  }

  // Navigate Page 4 -> Page 2
  if (navBackToPage2From4Btn && page2 && page4) {
    navBackToPage2From4Btn.addEventListener('click', () => switchPage(page4, page2, false));
  }

  // Navigate Page 4 -> Page 5
  if (goToPage5Btn && page4 && page5) {
    goToPage5Btn.addEventListener('click', () => switchPage(page4, page5));
  }

  // Navigate Page 5 -> Page 4
  if (navBackToPage4From5Btn && page4 && page5) {
    navBackToPage4From5Btn.addEventListener('click', () => switchPage(page5, page4, false));
  }

  // Replay Button: Page 5 -> Page 1
  if (replayBtn && page5 && page1) {
    replayBtn.addEventListener('click', () => switchPage(page5, page1));
  }

  // 5. Interactive Flip / Reveal Card on Page 2
  const reminderCard = document.getElementById('reminderCard');
  if (reminderCard) {
    reminderCard.addEventListener('click', () => {
      audio.playPop();
      const cardFront = reminderCard.querySelector('.card-front');
      const cardBack = reminderCard.querySelector('.card-back');

      if (cardFront && cardBack) {
        if (cardBack.classList.contains('hidden-content')) {
          cardFront.classList.add('hidden-content');
          cardBack.classList.remove('hidden-content');
          
          confetti({
            particleCount: 20,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#EC4899', '#A855F7']
          });
        } else {
          cardBack.classList.add('hidden-content');
          cardFront.classList.remove('hidden-content');
        }
      }
    });
  }
});
