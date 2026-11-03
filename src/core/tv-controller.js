import { CHANNELS } from './navigation.js';
import { padChannel } from './dom.js';
import { prefersReducedMotion } from './preferences.js';

export function createTvController({ sound, onSelectChannel }) {
  const tv = document.getElementById('tv');
  const dial = document.getElementById('channel-dial');
  const dialMarksContainer = document.getElementById('dial-marks');
  const channelButtonsContainer = document.getElementById('channel-buttons');
  const knob = document.getElementById('sound-knob');
  const volumeInput = document.getElementById('volume');
  const volumeLabel = document.getElementById('volume-label');
  const volumeValue = document.getElementById('volume-value');
  const volumeOsd = document.getElementById('volume-osd');
  const volumeBarsContainer = document.getElementById('volume-bars');
  const powerBtn = document.getElementById('power');
  const blankToggleBtn = document.getElementById('blank-toggle');
  const phosphor = document.getElementById('phosphor');
  const tuning = document.getElementById('tuning');
  const channelTag = document.getElementById('channel-tag');
  const statusRegion = document.getElementById('status');

  let powered = true;
  let activeChannelIndex = 0;
  let activeSubTitle = null;
  let tuneTimer = null;
  let volumeTimer = null;

  function buildHardwareControls() {
    channelButtonsContainer.innerHTML = '';
    dialMarksContainer.innerHTML = '';

    CHANNELS.forEach((ch, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'channel-button';
      button.dataset.channel = String(idx);
      button.setAttribute('aria-label', `Channel ${idx + 1}: ${ch.label}`);
      button.innerHTML = `<span class="button-led" aria-hidden="true"></span><span class="number">${padChannel(idx + 1)}</span><span>${ch.label.toUpperCase()}</span>`;
      button.addEventListener('click', () => onSelectChannel(idx));
      channelButtonsContainer.append(button);

      const mark = document.createElement('span');
      mark.className = 'dial-mark';
      mark.style.setProperty('--angle', `${-135 + idx * 45}deg`);
      mark.textContent = String(idx + 1);
      dialMarksContainer.append(mark);
    });

    volumeBarsContainer.innerHTML = '';
    for (let i = 0; i < 15; i += 1) {
      volumeBarsContainer.append(document.createElement('i'));
    }
  }

  function syncShellState(channelIndex = activeChannelIndex, subTitle = activeSubTitle) {
    activeChannelIndex = channelIndex;
    activeSubTitle = subTitle;
    const ch = CHANNELS[activeChannelIndex] || CHANNELS[0];

    dial.style.transform = `rotate(${-135 + activeChannelIndex * 45}deg)`;
    dial.setAttribute('aria-valuenow', String(activeChannelIndex + 1));
    dial.setAttribute('aria-valuetext', ch.label);

    dialMarksContainer.querySelectorAll('.dial-mark').forEach((mark, idx) => {
      mark.classList.toggle('active', idx === activeChannelIndex);
    });

    channelButtonsContainer.querySelectorAll('.channel-button').forEach((btn, idx) => {
      const isSelected = idx === activeChannelIndex;
      btn.setAttribute('aria-pressed', String(isSelected));
      if (isSelected) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    channelTag.textContent = `CH ${padChannel(activeChannelIndex + 1)}`;
    tv.classList.toggle('is-off', !powered);
    powerBtn.setAttribute('aria-checked', String(powered));
    phosphor.inert = !powered;

    const statusLabel = subTitle
      ? `Channel ${activeChannelIndex + 1}: ${ch.label} — ${subTitle}`
      : `Channel ${activeChannelIndex + 1}: ${ch.label}`;

    statusRegion.textContent = powered ? statusLabel : 'Television off';

    if (activeChannelIndex === 0) {
      document.title = 'Khalil Asad Mustafa — Personal Channel';
    } else if (subTitle) {
      document.title = `${subTitle} · ${ch.label} — Khalil Asad Mustafa`;
    } else {
      document.title = `${ch.label} — Khalil Asad Mustafa`;
    }
  }

  function triggerTuningEffect() {
    if (!powered) return;
    sound.clickSound(false);
    if (!prefersReducedMotion() && tuning) {
      tuning.classList.remove('active');
      void tuning.offsetWidth;
      tuning.classList.add('active');
      clearTimeout(tuneTimer);
      tuneTimer = setTimeout(() => tuning.classList.remove('active'), 250);
    }
  }

  function setVolume(rawValue, { showOsd = true } = {}) {
    const vol = sound.setVolume(rawValue);
    volumeInput.value = String(vol);
    volumeLabel.textContent = vol ? `${vol}%` : 'OFF';
    knob.style.transform = `rotate(${-135 + vol * 2.7}deg)`;
    knob.setAttribute('aria-valuenow', String(vol));
    knob.setAttribute('aria-valuetext', vol ? `${vol} percent` : 'Muted');
    volumeValue.textContent = padChannel(vol);

    volumeBarsContainer.querySelectorAll('i').forEach((bar, idx) => {
      bar.classList.toggle('on', idx < Math.round((vol / 100) * 15));
    });

    if (powered && showOsd) {
      volumeOsd.classList.add('visible');
      clearTimeout(volumeTimer);
      volumeTimer = setTimeout(() => volumeOsd.classList.remove('visible'), 1200);
    } else if (!showOsd) {
      volumeOsd.classList.remove('visible');
    }
  }

  function bindKeyboardSlider(element, getVal, setVal, min, max, step = 1) {
    element.addEventListener('keydown', (event) => {
      let next = getVal();
      if (['ArrowRight', 'ArrowUp'].includes(event.key)) next += step;
      else if (['ArrowLeft', 'ArrowDown'].includes(event.key)) next -= step;
      else if (event.key === 'Home') next = min;
      else if (event.key === 'End') next = max;
      else return;
      event.preventDefault();
      setVal(next);
    });
  }

  function bindRotaryDrag(element, getVal, setVal, anglePerUnit) {
    let drag = null;
    element.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      drag = {
        x,
        y,
        angle: (Math.atan2(event.clientY - y, event.clientX - x) * 180) / Math.PI,
        value: getVal(),
        travel: 0
      };
      element.setPointerCapture(event.pointerId);
      element.focus();
      event.preventDefault();
    });

    element.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const angle = (Math.atan2(event.clientY - drag.y, event.clientX - drag.x) * 180) / Math.PI;
      let delta = angle - drag.angle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      drag.travel += delta;
      drag.angle = angle;
      setVal(Math.round(drag.value + drag.travel / anglePerUnit));
    });

    const stop = () => {
      drag = null;
    };
    element.addEventListener('pointerup', stop);
    element.addEventListener('pointercancel', stop);
    element.addEventListener('lostpointercapture', stop);
  }

  function init() {
    buildHardwareControls();

    powerBtn.addEventListener('click', () => {
      powered = !powered;
      tuning?.classList.remove('active');
      clearTimeout(tuneTimer);
      sound.clickSound(true);
      syncShellState();
    });

    blankToggleBtn.addEventListener('click', () => {
      const isBlank = tv.classList.toggle('is-blank');
      blankToggleBtn.setAttribute('aria-pressed', String(isBlank));
      blankToggleBtn.textContent = isBlank ? 'SHOW CHANNEL' : 'BLANK SCREEN';
    });

    volumeInput.addEventListener('input', (event) => {
      setVolume(event.target.value, { showOsd: true });
      sound.clickSound(false);
    });

    bindKeyboardSlider(dial, () => activeChannelIndex, (val) => onSelectChannel(val), 0, CHANNELS.length - 1, 1);
    bindKeyboardSlider(
      knob,
      () => sound.getVolume(),
      (val) => {
        setVolume(val, { showOsd: true });
        sound.clickSound(false);
      },
      0,
      100,
      5
    );

    let wheelAt = 0;
    dial.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        if (Date.now() - wheelAt < 130) return;
        wheelAt = Date.now();
        onSelectChannel(activeChannelIndex + (event.deltaY > 0 ? 1 : -1));
      },
      { passive: false }
    );

    knob.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        setVolume(sound.getVolume() + (event.deltaY > 0 ? -5 : 5), { showOsd: true });
        sound.clickSound(false);
      },
      { passive: false }
    );

    bindRotaryDrag(dial, () => activeChannelIndex, (val) => onSelectChannel(val), 45);
    bindRotaryDrag(knob, () => sound.getVolume(), (val) => setVolume(val, { showOsd: true }), 2.7);

    setVolume(0, { showOsd: false });
  }

  return {
    init,
    syncShellState,
    triggerTuningEffect,
    isPowered: () => powered,
    getActiveChannelIndex: () => activeChannelIndex
  };
}
