export const ORDER_STEPS = [
  { id: 'category', label: 'Pilih Item', icon: 'shopping-bag' },
  { id: 'material', label: 'Bahan', icon: 'layers' },
  { id: 'washType', label: 'Tipe Cuci', icon: 'droplets' },
  { id: 'photos', label: 'Foto', icon: 'camera' },
  { id: 'cart', label: 'Keranjang', icon: 'shopping-cart' },
  { id: 'customer', label: 'Data Diri', icon: 'user' },
  { id: 'review', label: 'Konfirmasi', icon: 'check-circle' },
];

export class StepManager {
  constructor(options = {}) {
    this.steps = options.steps || ORDER_STEPS;
    this.currentStepIndex = 0;
    this.completedSteps = new Set();
    this.stepElements = new Map();
    this.onStepChange = options.onStepChange || (() => {});
    this.onStepComplete = options.onStepComplete || (() => {});
    
    this.container = options.container;
    if (this.container) {
      this.render();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="step-indicator" role="navigation" aria-label="Progress steps" style="--step-count: ${this.steps.length}">
        <ol class="step-indicator__steps" id="stepList">
          <div class="step-indicator__track" aria-hidden="true">
            <div class="step-indicator__progress" id="stepProgress"></div>
          </div>
          ${this.steps.map((step, index) => this.renderStep(step, index)).join('')}
        </ol>
      </div>
    `;

    this.progressBar = this.container.querySelector('#stepProgress');
    this.stepList = this.container.querySelector('#stepList');
    this.updateDisplay();
  }

  renderStep(step, index) {
    const isActive = index === this.currentStepIndex;
    const isCompleted = this.completedSteps.has(step.id);
    const isFuture = index > this.currentStepIndex;

    let statusClass = 'step-indicator__step--future';
    if (isActive) statusClass = 'step-indicator__step--active';
    else if (isCompleted) statusClass = 'step-indicator__step--completed';

    return `
      <li class="step-indicator__step ${statusClass}" data-step="${step.id}" role="button" tabindex="0" aria-current="${isActive ? 'step' : 'false'}" aria-label="Step ${index + 1}: ${step.label}${isCompleted ? ' (selesai)' : ''}">
        <div class="step-indicator__icon" aria-hidden="true">
          ${this.getStepIcon(step.icon)}
        </div>
        <span class="step-indicator__label">${step.label}</span>
      </li>
    `;
  }

  getStepIcon(iconName) {
    const icons = {
      'shopping-bag': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>',
      'layers': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>',
      'droplets': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69a5.5 5.5 0 0 1 0 10.62" /><path d="M19 12a7 7 0 0 1-7 7" /><path d="M5 12a7 7 0 0 0 7-7" /></svg>',
      'camera': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="12" r="4" /></svg>',
      'shopping-cart': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>',
      'user': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>',
      'check-circle': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>',
    };
    return icons[iconName] || icons['shopping-bag'];
  }

  updateDisplay() {
    if (!this.progressBar || !this.stepList) return;

    // The progress fill lives inside the track, which already spans from the
    // first icon's center to the last icon's center. So its width percentage is
    // relative to the track, reaching exactly the active step's icon center.
    const progress = (this.currentStepIndex / (this.steps.length - 1)) * 100;
    this.progressBar.style.width = `${progress}%`;

    this.stepList.querySelectorAll('.step-indicator__step').forEach((el, index) => {
      const stepId = el.dataset.step;
      const isActive = index === this.currentStepIndex;
      const isCompleted = this.completedSteps.has(stepId);

      el.classList.remove('step-indicator__step--active', 'step-indicator__step--completed', 'step-indicator__step--future');
      
      if (isActive) {
        el.classList.add('step-indicator__step--active');
        el.setAttribute('aria-current', 'step');
      } else if (isCompleted) {
        el.classList.add('step-indicator__step--completed');
        el.setAttribute('aria-current', 'false');
      } else {
        el.classList.add('step-indicator__step--future');
        el.setAttribute('aria-current', 'false');
      }
    });
  }

  goToStep(index) {
    if (index < 0 || index >= this.steps.length) return false;
    
    if (index > this.currentStepIndex && !this.canProceed()) {
      return false;
    }

    this.currentStepIndex = index;
    this.updateDisplay();
    this.onStepChange(this.getCurrentStep(), this.currentStepIndex);
    return true;
  }

  next() {
    return this.goToStep(this.currentStepIndex + 1);
  }

  previous() {
    return this.goToStep(this.currentStepIndex - 1);
  }

  completeCurrentStep() {
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      this.completedSteps.add(currentStep.id);
      this.onStepComplete(currentStep, this.currentStepIndex);
    }
    return this.next();
  }

  canProceed() {
    return true;
  }

  getCurrentStep() {
    return this.steps[this.currentStepIndex];
  }

  getCurrentStepIndex() {
    return this.currentStepIndex;
  }

  getCompletedSteps() {
    return Array.from(this.completedSteps);
  }

  reset() {
    this.currentStepIndex = 0;
    this.completedSteps.clear();
    this.updateDisplay();
  }

  setStepValidation(stepId, isValid) {
    const stepEl = this.stepList.querySelector(`[data-step="${stepId}"]`);
    if (stepEl) {
      if (isValid) {
        stepEl.classList.add('step-indicator__step--valid');
      } else {
        stepEl.classList.remove('step-indicator__step--valid');
      }
    }
  }

  destroy() {
    this.stepElements.clear();
  }
}

export function initStepManager(container, options) {
  return new StepManager({ container, ...options });
}