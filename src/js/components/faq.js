export class FAQ {
  constructor(container, options = {}) {
    this.container = container;
    this.faqs = options.faqs || [];
    this.allowMultiple = options.allowMultiple || false;
    
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="faq" id="faq">
        <div class="faq__list">
          ${this.faqs.map((faq, index) => this.renderItem(faq, index)).join('')}
        </div>
      </div>
    `;
  }

  renderItem(faq, index) {
    return `
      <article class="faq__item" data-faq-index="${index}">
        <button type="button" class="faq__question" aria-expanded="false" aria-controls="faq-answer-${index}">
          <span class="faq__question-text">${faq.question}</span>
          <span class="faq__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
        <div class="faq__answer" id="faq-answer-${index}" role="region" hidden>
          <p class="faq__answer-text">${faq.answer}</p>
        </div>
      </article>
    `;
  }

  bindEvents() {
    this.container.querySelectorAll('.faq__question').forEach(button => {
      button.addEventListener('click', () => this.toggle(button));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(button);
        }
      });
    });
  }

  toggle(button) {
    const item = button.closest('.faq__item');
    const answer = item.querySelector('.faq__answer');
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    if (!this.allowMultiple) {
      this.container.querySelectorAll('.faq__question[aria-expanded="true"]').forEach(otherBtn => {
        if (otherBtn !== button) {
          const otherItem = otherBtn.closest('.faq__item');
          const otherAnswer = otherItem.querySelector('.faq__answer');
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.hidden = true;
          otherItem.classList.remove('faq__item--open');
        }
      });
    }

    button.setAttribute('aria-expanded', !isOpen);
    answer.hidden = isOpen;
    item.classList.toggle('faq__item--open', !isOpen);
  }
}

export function initFAQ(container, options) {
  return new FAQ(container, options);
}